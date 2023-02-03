'use strict';

function CameraEditor(body, activateGame, deactivateGame, server) {
    const self               = this;
    var   blockPos;
    let   videoStream        = null;

    const baseDiv            = GuiTools.createOverlayTransparent();    
    const panel              = GuiTools.createCenteredPanel(baseDiv, '600px', '500px');
    
    const closeDiv           = GuiTools.createCloseButtonDiv(panel);    
    GuiTools.createCloseButton(closeDiv, exitAction);

    GuiTools.createLineBreak(panel, 4);
    GuiTools.createText(panel, "Take a snapshot");

    GuiTools.createLineBreak(panel, 2);
    const video              = GuiTools.createVideo(null, true);
    const canvas             = GuiTools.createCanvas(panel, 320, 240, null, 'LightGrey');
    canvas.style.borderStyle = 'double';
    GuiTools.createLineBreak(panel, 3);
    const pictureButton      = GuiTools.createButton(panel, "Take Picture", takePicture);
    const closeButton        = GuiTools.createButton(panel, "Close", exitAction);
    

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show and hide blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    async function takePicture() {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        server.requestWriteResource(blockPos, Block.Camera, "", canvas.toDataURL('image/jpeg'));        
    }


    function keydownHandler(event) {
        const keyCode = KeyCode.getFromEvent(event);
    
        if( keyCode == KeyCode.F3 ) {
            event.preventDefault();
            event.stopPropagation();
            return exitAction();
        }

        return true;
    }


    function exitAction(event) {
        if(videoStream) videoStream.getVideoTracks().forEach(track => track.stop());
        if(event) event.stopPropagation();
        document.removeEventListener("keydown", keydownHandler);
        body.removeChild(baseDiv);
        activateGame();
        return false;
    }



    this.show = function(chunkStore, _blockPos) {
        blockPos             = _blockPos;
        const blockData  = chunkStore.getBlockData(blockPos);
        if( !BlockData.isCamera(blockData) ) return false;

        canvas.clear();
        if(!body.contains(baseDiv)) {
            body.appendChild(baseDiv);
        }
        document.addEventListener("keydown", keydownHandler);        
        deactivateGame();          
        server.requestReadResource(blockPos, Block.Camera, "");

        navigator.mediaDevices.getUserMedia( {video: true} )
        .then( (stream) => video.srcObject = videoStream = stream );
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }

    
    this.updatePicture = function(text) {
        if( self.isVisible() ) {
            var image = new Image();
            image.onload = function() {
                canvas.getContext('2d').drawImage(image, 0, 0);
            };
            image.src = text; 
        }
    }


}
