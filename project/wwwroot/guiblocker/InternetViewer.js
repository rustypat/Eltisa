'use strict';


function InternetViewer(body, activateGame, deacitvateGame, server) {

    const baseDiv            = GuiTools.createOverlayTransparent();    
    const iframe             = GuiTools.createCenteredIframe(baseDiv, "", "100px", "100px");

    var blockPos;
    const self               = this;


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    

    function keydownHandler(event) {
        const keyCode = KeyCode.getFromEvent(event);
    
        if( keyCode == KeyCode.SPACE ) {
            event.preventDefault();
            event.stopPropagation();
            exitAction();
            return false;
        }

        return true;
    }


    function mouseLeftClickHandler(event) {
        if( event.button != 0 ) return true;
        event.preventDefault();
        event.stopPropagation();
        exitAction();
        return false;
    }


    function exitAction() {
        document.removeEventListener("keydown", keydownHandler);
        document.removeEventListener("click",   mouseLeftClickHandler); 

        body.removeChild(baseDiv);
        activateGame();
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////
        
    this.show = function(chunkStore, _blockPos) {
        blockPos             = _blockPos;
        var blockData        = chunkStore.getBlockData(blockPos);
        if( !BlockData.isInternet(blockData) ) return false;
        
        deacitvateGame();

        if(!body.contains(baseDiv)) {
            body.appendChild(baseDiv);
        }
        document.addEventListener("keydown", keydownHandler);
        document.addEventListener("click",   mouseLeftClickHandler); 
       
        server.requestReadResource(blockPos, Block.Internet, ""); 

        return true;
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }


    this.updateUrl = function(jsonText) {
        if( self.isVisible() ) {
            let jsonObject =  JSON.parse(jsonText);
            iframe.setUrl(jsonObject.text);
            iframe.setSize(jsonObject.width, jsonObject.height);
        }
    }

}
