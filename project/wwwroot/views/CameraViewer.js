'use strict';

function CameraViewer(viewManager, serverIn, serverOut, player) {
    const self               = this;

    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_Space]   = close;
    eventHandlers[EV_Mouse_Left]       = close;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;

    // gui elements
    const baseDiv            = GuiTools.createOverlayTransparent();    
    const canvas             = GuiTools.createCenteredCanvas(baseDiv, 320, 240);
    

    this.enable = function() {
        const blockPos = player.getTargetPos();
        if( blockPos == null ) return;

        canvas.clear();
        serverIn.receiveResourceHandler = updatePicture;
        serverOut.requestReadResource(blockPos, Block.Camera, "");             
    }
    
    
    this.disable = function() {
        serverIn.receiveResourceHandler = null;
    }
    


    function updatePicture(messageType, blockType, resourceResponse, text) {
        if( resourceResponse == SR_Ok && blockType==Block.Camera && messageType == SM_ReadResourceResponse) {
            var image = new Image();
            image.onload = () => canvas.drawImage(image);
            image.src = text; 
        }
    }


    function close() {
        viewManager.unshow(self);
    }

}
