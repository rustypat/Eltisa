'use strict';


function ScriptureViewer(viewManager, serverIn, serverOut, player) {
    const self               = this;

    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_Space]   = close;
    eventHandlers[EV_Mouse_Left]       = close;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;

    // gui elements
    const baseDiv            = GuiTools.createOverlay(null, CLR_GlossyLight);
    const textArea           = GuiTools.createCenteredTextArrea(baseDiv, "400px", "400px", true);


    
    function close()  {
        viewManager.unshow(self);
    }


    this.enable = function() {
        const blockPos      = player.getTargetPos();
        if( blockPos == null ) return;

        textArea.value       = "";
        textArea.disabled    = true;
        serverIn.receiveResourceHandler = updateText;
        serverOut.requestReadResource(blockPos, Block.Scripture, "");             
    }
    
    
    this.disable = function() {
        serverIn.receiveResourceHandler = null;
    }


    function updateText(messageType, blockType, resourceResponse, text) {
        textArea.value = text;
    }

}
