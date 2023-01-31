'use strict';


function OracleBlocker(body, activateGame, deacitvateGame, server) {

    const div                = GuiTools.createBaseDiv();
    const panel              = GuiTools.createTabletDiv(div);
    panel.style.backgroundColor = "rgba(175, 165, 155, 0.8)";
    const closeDiv           = GuiTools.createCloseButtonDiv(panel);    
    const closeButton        = GuiTools.createCloseButton(closeDiv, closeAction);


    GuiTools.createLineBreak(panel, 2);
    const textField          = GuiTools.createTextInput(panel, 150, '400px', '30px');
    GuiTools.createLineBreak(panel);
    const saveButton         = GuiTools.createButton(panel, "save",     saveAction);
    const cancelButton       = GuiTools.createButton(panel, "cancel",   closeAction);

    var blockPos;
    var blockData;
    var text;

    
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    

    function closeAction(event)  {
        if(event) event.stopPropagation();
        document.removeEventListener("keydown", keydownHandler);
        activateGame();     
        body.removeChild(div);     
        return false  
    }


    function saveAction(event) {
        if(event) event.stopPropagation();
        text  = textField.value.trim();

        const changedOracleDefinition = getChangedOracleBlockDefinition(text);
        if( changedOracleDefinition != null ) {
            server.requestSwitchBlock(blockPos.x, blockPos.y, blockPos.z);
        }
        server.requestWriteResource(blockPos, Block.Oracle, "", text); 
        closeAction();
        return false;
    }
    

    function keydownHandler(event) {
        const keyCode = KeyCode.getFromEvent(event);
    
        if( keyCode == KeyCode.F3 ) {
            event.preventDefault();
            event.stopPropagation();
            closeAction();
            return false;
        }
        if( keyCode == KeyCode.RETURN && !saveButton.disabled) {
            event.preventDefault();
            event.stopPropagation();
            saveAction();
            return false;
        }
        else {
            saveButton.disabled = false;
            return true; 
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////
        
    this.show = function(chunkStore, _blockPos) {
        blockData            = chunkStore.getBlockData(_blockPos);
        if( !BlockData.isOracle(blockData) ) return false;
        
        if(!body.contains(div)) {
            body.appendChild(div);
        }        
        document.addEventListener("keydown", keydownHandler);        
        textField.value  = "";
        textField.focus();
        saveButton.disabled = true;        

        server.requestReadResource(_blockPos, Block.Oracle, ""); 
        blockPos             = _blockPos;
        deacitvateGame();
        return true;
    }


    this.isVisible = function() {
        return body.contains(div);
    }


    this.updateOracle = function(newText) {
        textField.value  = newText;
        text             = newText;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // support methods
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    function getChangedOracleBlockDefinition(text) {
        const currentOracleDefinition = BlockData.getDefinition(blockData);

        if( text.length > 0) {
            if( currentOracleDefinition == Block.Oracle   ) return Block.OracleUsed;
        }
        else {
            if( currentOracleDefinition == Block.OracleUsed   ) return Block.Oracle;
        }
        return null;
    }

    
}
