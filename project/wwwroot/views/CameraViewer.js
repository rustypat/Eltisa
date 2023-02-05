'use strict';

function CameraViewer(body, activateGame, deactivateGame, server) {
    const self               = this;
    var   blockPos;

    const baseDiv            = GuiTools.createOverlayTransparent();    
    const canvas             = GuiTools.createCenteredCanvas(baseDiv, 320, 240);
    

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show and hide blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    function keydownHandler(event) {
        const keyCode = KeyCode.getFromEvent(event);
        if( keyCode != KeyCode.SPACE ) return true;

        event.preventDefault();
        event.stopPropagation();
        exitAction();
        return false;
    }


    function mouseLeftClickHandler(event) {
        if( event.button != 0 ) return true;
        event.preventDefault();
        event.stopPropagation();
        exitAction();
        return false;
    }


    function exitAction(event) {
        if(event) event.stopPropagation();
        document.removeEventListener("keydown", keydownHandler);
        document.removeEventListener("click",   mouseLeftClickHandler); 

        body.removeChild(baseDiv);
        activateGame();
    }



    this.show = function(chunkStore, _blockPos) {
        blockPos         = _blockPos;
        const blockData  = chunkStore.getBlockData(blockPos);
        if( !BlockData.isCamera(blockData) ) return false;

        deactivateGame();  

        canvas.clear();
        if(!body.contains(baseDiv)) {
            body.appendChild(baseDiv);
        }
        document.addEventListener("keydown", keydownHandler);        
        document.addEventListener("click",   mouseLeftClickHandler); 
        
        server.requestReadResource(blockPos, Block.Camera, "");             
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }

    
    this.updatePicture = function(text) {
        if( self.isVisible() ) {
            var image = new Image();
            image.onload = () => canvas.drawImage(image);
            image.src = text; 
        }
    }


}
