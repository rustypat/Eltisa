'use strict';


function InternetEditor(viewManager, serverIn, serverOut, player) {

    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_F3]   = cancelAction;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;

    // gui elements
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


    function saveAction()  {
        let jsonObject = {};        
        jsonObject.text = url.getText().trim();
        jsonObject.width = width.getText().trim();
        jsonObject.height = height.getText().trim();
        const jsonText = JSON.stringify(jsonObject);
        serverOut.requestWriteResource(blockPos, Block.Internet, "", jsonText); 
        viewManager.unshow(self);
    }


    function cancelAction()  {
        viewManager.unshow(self);
    }


    this.enable = function() {
        blockPos      = player.getTargetPos();
        if( blockPos == null ) return;

        clearContent();
        serverIn.receiveResourceHandler = updateUrl;
        serverOut.requestReadResource(blockPos, Block.Internet, "");             
    }
    
    
    this.disable = function() {
        serverIn.receiveResourceHandler = null;
    }
    

    function clearContent() {
        url.setText("");
        width.setText("90%");
        height.setText("90%");
        iframe.setUrl("");
        iframe.setSize("95%", "90%");
    }


    function updateUrl(messageType, blockType, resourceResponse, jsonText) {
        if( resourceResponse == SR_Ok && blockType==Block.Internet && messageType == SM_ReadResourceResponse) {
            let jsonObject =  JSON.parse(jsonText);
            url.setText(jsonObject.text);
            width.setText(jsonObject.width);
            height.setText(jsonObject.height);
            iframe.setUrl(jsonObject.text);
            iframe.setSize(jsonObject.width, jsonObject.height);
        }
    }

}
