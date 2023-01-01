'Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved';
'use strict';


function PortalBlocker(body, activateGame, deacitvateGame, server, player) {

    const div                = GuiTools.createBaseDiv();
    if(Config.blackAndWhite) div.style.filter = "grayscale(1)";

    const panel              = GuiTools.createTabletDiv(div);
    panel.style.backgroundColor = "rgba(0, 160, 190, 0.8)";
    const closeDiv           = GuiTools.createCloseButtonDiv(panel);    
    const closeButton        = GuiTools.createCloseButton(closeDiv, closeAction);


    GuiTools.createLineBreak(panel, 2);
    GuiTools.createTitle(panel, "Warning");
    GuiTools.createLineBreak(panel, 2);
    const textDiv            = GuiTools.createDiv(panel);
    GuiTools.createText(textDiv, "Only for experts. Use with caution!");
    GuiTools.createLineBreak(textDiv);
    GuiTools.createText(textDiv, "If you know what your doing, enter teleport target coordinate.");
    GuiTools.createLineBreak(panel, 2);
    GuiTools.createLabel(panel, "x / y / z:", '100px');
    const targetX            = GuiTools.createNumberInput(panel, -524280, 524280, changeAction);
    const targetY            = GuiTools.createNumberInput(panel, -16380, 16380, changeAction);
    const targetZ            = GuiTools.createNumberInput(panel, -524280, 524280, changeAction);
    GuiTools.createLineBreak(panel);
    GuiTools.createLabel(panel, "description:", '100px');
    const description        = GuiTools.createTextInput(panel, '150', '290px');
    GuiTools.createLineBreak(panel);
    const teleportButton     = GuiTools.createButton(panel, "teleport", teleportAction);
    const saveButton         = GuiTools.createButton(panel, "save",     saveAction);
    const cancelButton       = GuiTools.createButton(panel, "cancel",   closeAction);


    const self               = this;
    var blockPos;

    
    function getTargetPos() {
        const targetPos                = {};
        targetPos.description          = description.getText();
        targetPos.x                    = parseInt(targetX.value); 
        targetPos.y                    = parseInt(targetY.value); 
        targetPos.z                    = parseInt(targetZ.value); 

        const radiusHorizontal         = Config.worldRadius-Config.chunkSize; 
        const radiusVertical           = Config.worldRadiusVertical-Config.chunkSize; 
        if( !targetPos.x.isInRange( -radiusHorizontal, radiusHorizontal) ) return null;
        if( !targetPos.y.isInRange( -radiusVertical,   radiusVertical)   ) return null;
        if( !targetPos.z.isInRange( -radiusHorizontal, radiusHorizontal) ) return null;
        return targetPos;
    }


    function teleportAction(event)  {
        if(event) event.stopPropagation();

        const targetPos = getTargetPos();
        if( !targetPos ) return;
        player.setPosition(targetPos.x, targetPos.y, targetPos.z);
        closeAction();
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    

    function closeAction(event)  {
        if(event) event.stopPropagation();
        document.removeEventListener("keydown", keydownHandler);
        activateGame();     
        body.removeChild(div);       
        return false;
    }


    function saveAction(event) {
        if(event) event.stopPropagation();

        const targetPos = getTargetPos();
        if( !targetPos ) return;
        const text = JSON.stringify(targetPos);
        server.requestSaveBlockResource(blockPos, Block.Portal, text); 
        closeAction();
        return false;
    }
    

    function changeAction() {
        teleportButton.disabled = false;
    }



    function keydownHandler(event) {
        const keyCode = KeyCode.getFromEvent(event);
    
        if( keyCode == KeyCode.F3 ) {
            event.preventDefault();
            event.stopPropagation();
            closeAction();
            return false;
        }
        else {
            teleportButton.disabled = false;
            saveButton.disabled = false;
            return true; 
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////
        
    this.show = function(chunkStore, _blockPos) {
        blockPos   = _blockPos;
        const blockData  = chunkStore.getBlockData(blockPos);
        if( !BlockData.isPortal(blockData) ) return false;
        
        if(!body.contains(div)) {
            body.appendChild(div);
        }        
        document.addEventListener("keydown", keydownHandler);        
        targetX.focus();
        teleportButton.disabled = true;        
        saveButton.disabled = true;        

        const playerPos = player.getPosition();
        targetX.value   = Math.floor(playerPos.x);
        targetY.value   = Math.floor(playerPos.y);
        targetZ.value   = Math.floor(playerPos.z);
        description.setText("");
        targetX.select();
        
        server.requestBlockResource(blockPos, Block.Portal); 
        deacitvateGame();

        return true;
    }


    this.isVisible = function() {
        return body.contains(div);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // asynchronous server resource events
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    
    var jumpRequestTime = 0;

    this.requestTeleportation = function(chunkStore, blockPos) {
        const blockData  = chunkStore.getBlockData(blockPos);
        if( !BlockData.isPortal(blockData) ) return false;
        jumpRequestTime = performance.now();
        server.requestBlockResource(blockPos, Block.Portal); 
    }

    this.handleBlockResourceMessage = function(resourceMessage, player) {
        if( self.isVisible() ) {
            const targetPos = JSON.parse(resourceMessage.text);
            targetX.value              = targetPos.x;
            targetY.value              = targetPos.y;
            targetZ.value              = targetPos.z;            
            description.setText(targetPos.description);
            teleportButton.disabled    = false;        
        }
        else if (performance.now()-jumpRequestTime < 5000 ) {
            const targetPos = JSON.parse(resourceMessage.text);
            player.setPosition(targetPos.x, targetPos.y, targetPos.z);
            jumpRequestTime = 0;
        }
    }

}
