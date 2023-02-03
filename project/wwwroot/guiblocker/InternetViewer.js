'use strict';


function InternetViewer(body, activateGame, deacitvateGame, server) {

    const baseDiv            = GuiTools.createOverlayTransparent();    
    const panel              = GuiTools.createCenteredPanel(baseDiv, '70%', '70%');
    const iframe             = GuiTools.createCenteredIframe(panel, "", "95%", "92%");

    var blockPos;
    const self               = this;


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    

    function keypressHandler(event) {
        const keyCode = KeyCode.getFromEvent(event);
    
        if( keyCode == KeyCode.SPACE ) {
            event.preventDefault();
            event.stopPropagation();
            body.removeChild(baseDiv);       
            document.removeEventListener("keydown", keypressHandler);
            activateGame();     
            return false;
        }

        return true;
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
        document.addEventListener("keydown", keypressHandler);
       
        server.requestReadResource(blockPos, Block.Internet, ""); 

        return true;
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }


    this.updateUrl = function(text) {
        if( self.isVisible() ) {
            iframe.setUrl(text);
        }
    }

}
