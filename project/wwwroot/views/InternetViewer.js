'use strict';


function InternetViewer(viewManager, serverIn, serverOut, player) {

    const self               = this;
    const baseDiv            = GuiTools.createOverlay(null, CLR_GlossyLight);    
    const iframe             = GuiTools.createCenteredIframe(baseDiv, "", "100px", "100px");

    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_Space]   = close;
    eventHandlers[EV_Mouse_Left]       = close;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;



    this.enable = function() {
        const blockPos      = player.getTargetPos();
        if( blockPos == null ) return;

        iframe.setUrl("");
        iframe.setSize("100px", "100px");

        serverIn.receiveResourceHandler = updateUrl;
        serverOut.requestReadResource(blockPos, Block.Internet, "");             
    }
    
    
    this.disable = function() {
        serverIn.receiveResourceHandler = null;
    }
 

    function updateUrl(messageType, blockType, resourceResponse, jsonText, targetId) {
        if( resourceResponse == SR_Ok && blockType==Block.Internet && messageType == SM_ReadResourceResponse) {
            let jsonObject =  JSON.parse(jsonText);
            iframe.setUrl(jsonObject.text);
            iframe.setSize(jsonObject.width, jsonObject.height);
        }
    }


    function close() {
        viewManager.unshow(self);
    }

}
