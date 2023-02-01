'use strict';

function CameraViewer(body, activateGame, deactivateGame, server) {
    const self               = this;
    var   blockPos;

    const baseDiv            = GuiTools.createBaseDivLight();    
    const panel              = GuiTools.createTabletDiv(baseDiv);
    panel.style.width        = '500px';
    panel.style.height       = '380px'
    
    const closeDiv           = GuiTools.createCloseButtonDiv(panel);    
    GuiTools.createCloseButton(closeDiv, exitAction);

    GuiTools.createLineBreak(closeDiv, 1);

    GuiTools.createLineBreak(closeDiv, 2);
    const canvas             = GuiTools.createCanvas(closeDiv, 320, 240, null, 'LightGrey');
    canvas.style.borderStyle = 'double';
    GuiTools.createLineBreak(closeDiv, 2);
    

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show and hide blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    function keydownHandler(event) {
        const keyCode = KeyCode.getFromEvent(event);
    
        if( keyCode == KeyCode.SPACE ) {
            event.preventDefault();
            event.stopPropagation();
            return exitAction();
        }

        return true;
    }


    function exitAction(event) {
        if(event) event.stopPropagation();
        document.removeEventListener("keydown", keydownHandler);

        body.removeChild(baseDiv);
        activateGame();
        return false;
    }



    this.show = function(chunkStore, _blockPos) {
        blockPos         = _blockPos;
        const blockData  = chunkStore.getBlockData(blockPos);
        if( !BlockData.isCamera(blockData) ) return false;

        canvas.clear();
        if(!body.contains(baseDiv)) {
            body.appendChild(baseDiv);
        }
        document.addEventListener("keydown", keydownHandler);        
        deactivateGame();  
        
        server.requestReadResource(blockPos, Block.Camera, "");             
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }

    
    this.updatePicture = function(text) {
        if( self.isVisible() ) {
            var image = new Image();
            image.onload = function() {
                canvas.getContext('2d').drawImage(image, 0, 0);
            };
            image.src = text; 
        }
    }


}
