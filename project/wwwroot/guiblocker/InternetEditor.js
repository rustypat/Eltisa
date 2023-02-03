'use strict';


function InternetEditor(body, activateGame, deacitvateGame, server) {

    const baseDiv            = GuiTools.createOverlayTransparent();    
    const panel              = GuiTools.createCenteredPanel(baseDiv, '70%', '70%');

    const url                = GuiTools.createTextInput(panel, 256, "60%");  
    const saveButton         = GuiTools.createButton(panel, "save",   saveAction);
    const cancelButton       = GuiTools.createButton(panel, "cancel", cancelAction);
    GuiTools.createLineBreak(panel);    
    const iframe             = GuiTools.createIframe(panel, "", "95%", "90%");

    var blockPos;
    const self               = this;


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    

    function saveAction(event)  {
        if(event) event.stopPropagation();
        const text = url.getText().trim();
        server.requestWriteResource(blockPos, Block.Internet, "", text); 
        body.removeChild(baseDiv);      
        document.removeEventListener("keydown", keypressHandler);
        activateGame();     
    }


    function cancelAction(event)  {
        if(event) event.stopPropagation();
        body.removeChild(baseDiv);       
        document.removeEventListener("keydown", keypressHandler);
        activateGame();     
    }


    function keypressHandler(event) {
        const keyCode = KeyCode.getFromEvent(event);
    
        if( keyCode == KeyCode.RETURN ) {
            event.preventDefault();
            event.stopPropagation();
            iframe.setUrl(url.getText());
            return false;
        }

        if( keyCode == KeyCode.F3 ) {
            event.preventDefault();
            event.stopPropagation();
            cancelAction(event);
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
        

        if(!body.contains(baseDiv)) {
            body.appendChild(baseDiv);
        }
        document.addEventListener("keydown", keypressHandler);
        deacitvateGame();
        server.requestReadResource(blockPos, Block.Internet, ""); 

        return true;
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }


    this.updateUrl = function(text) {
        if( self.isVisible() ) {
            url.setText(text);
            iframe.setUrl(text);
        }
    }

}
