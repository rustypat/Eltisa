'use strict';


function InternetEditor(body, activateGame, deacitvateGame, server) {

    const baseDiv            = GuiTools.createOverlayTransparent();    
    const panel              = GuiTools.createCenteredPanel(baseDiv, '70%', '70%');

    const url                = GuiTools.createTextInput(panel, 256, "50%");  
    const width              = GuiTools.createTextInput(panel, 256, "7%");  
    const height             = GuiTools.createTextInput(panel, 256, "7%");  
    const saveButton         = GuiTools.createButton(panel, "save",   saveAction, "7%");
    const cancelButton       = GuiTools.createButton(panel, "cancel", cancelAction, "7%");
    GuiTools.createLineBreak(panel);    
    const iframe             = GuiTools.createIframe(panel, "", "95%", "90%");

    var blockPos;
    const self               = this;


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    

    function saveAction(event)  {
        if(event) event.stopPropagation();
        let jsonObject = {};        
        jsonObject.text = url.getText().trim();
        jsonObject.width = width.getText().trim();
        jsonObject.height = height.getText().trim();
        const jsonText = JSON.stringify(jsonObject);
        server.requestWriteResource(blockPos, Block.Internet, "", jsonText); 
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
            iframe.setSize(width.getText(), height.getText());
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


    function clearContent() {
        url.setText("");
        width.setText("90%");
        height.setText("90%");
        iframe.setUrl("");
        iframe.setSize("95%", "90%");
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////
        
    this.show = function(chunkStore, _blockPos) {
        blockPos             = _blockPos;
        var blockData        = chunkStore.getBlockData(blockPos);
        if( !BlockData.isInternet(blockData) ) return false;
        
        deacitvateGame();
        clearContent();

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


    this.updateUrl = function(jsonText) {
        if( self.isVisible() ) {
            let jsonObject =  JSON.parse(jsonText);
            url.setText(jsonObject.text);
            width.setText(jsonObject.width);
            height.setText(jsonObject.height);
            iframe.setUrl(jsonObject.text);
            iframe.setSize(jsonObject.width, jsonObject.height);
        }
    }

}
