'use strict';


function ScriptureViewer(viewManager, serverIn, serverOut, player) {
    const self               = this;

    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_Any]   = keyPressedHandler;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;

    // gui elements
    const baseDiv            = GuiTools.createOverlayTransparent();


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
