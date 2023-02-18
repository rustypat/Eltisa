'use strict';

function CameraEditor(viewManager, serverIn, serverOut, player) {
    const self               = this;
    let   videoStream        = null;
    let   blockPos           = null;

    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_F3]   = close;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;

    // gui elements
    const baseDiv            = GuiTools.createOverlayTransparent(null);    
    const panel              = GuiTools.createCenteredPanel(baseDiv, '600px', '500px');
    
    const closeDiv           = GuiTools.createCloseButtonDiv(panel);    
    GuiTools.createCloseButton(closeDiv, close);

    GuiTools.createLineBreak(panel, 4);
    GuiTools.createText(panel, "Take a snapshot");

    GuiTools.createLineBreak(panel, 2);
    const video              = GuiTools.createVideo(null, true);
    const canvas             = GuiTools.createCanvas(panel, 320, 240);
    canvas.style.borderStyle = 'double';
    GuiTools.createLineBreak(panel, 3);
    const pictureButton      = GuiTools.createButton(panel, "Take Picture", takePicture);
    const closeButton        = GuiTools.createButton(panel, "Close", close);
    


    this.enable = function() {
        blockPos = player.getTargetPos();
        if( blockPos == null ) return;

        canvas.clear();

        navigator.mediaDevices.getUserMedia( {video: true} )
        .then( (stream) => video.srcObject = videoStream = stream );

        serverIn.receiveResourceHandler = updatePicture;
        serverOut.requestReadResource(blockPos, Block.Camera, "");             
    }
    
    
    this.disable = function() {
        serverIn.receiveResourceHandler = null;
    }
    

    function updatePicture(messageType, blockType, resourceResponse, text, targetId) {
        if( resourceResponse == SR_Ok && blockType==Block.Camera && messageType == SM_ReadResourceResponse) {
            let image = new Image();
            image.onload = () => canvas.drawImage(image);
            image.src = text; 
        }
    }


    function close() {
        if(videoStream) videoStream.getVideoTracks().forEach(track => track.stop());
        viewManager.unshow(self);
    }


    async function takePicture() {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        serverOut.requestWriteResource(blockPos, Block.Camera, "", canvas.toDataURL('image/jpeg'));      
    }

}
