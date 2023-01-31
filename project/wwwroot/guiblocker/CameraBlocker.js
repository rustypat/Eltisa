'use strict';

function CameraBlocker(body, activateGame, deactivateGame, server) {
    const self               = this;
    var   blockPos;

    const baseDiv            = GuiTools.createBaseDiv();    
    const panel              = GuiTools.createTabletDiv(baseDiv);
    panel.style.width        = '90%';
    
    const closeDiv           = GuiTools.createCloseButtonDiv(panel);    
    GuiTools.createCloseButton(closeDiv, exitAction);

    GuiTools.createLineBreak(panel, 1);
    GuiTools.createText(panel, "Take a snapshot");

    GuiTools.createLineBreak(panel, 2);
    const video              = GuiTools.createVideo(null, true);
    const canvas             = GuiTools.createCanvas(panel, 320, 240, null, 'LightGrey');
    canvas.style.borderStyle = 'double';
    GuiTools.createLineBreak(panel, 2);
    const pictureButton      = GuiTools.createButton(panel, "Take Picture", takePicture);
    const deleteButton       = GuiTools.createButton(panel, "Delete", clearPicture);
    const closeButton        = GuiTools.createButton(panel, "Close", exitAction);
    const leftButton         = GuiTools.createButton(panel, "<", null, '30px');
    const rightButton        = GuiTools.createButton(panel, ">", null, '30px');
    leftButton.style.marginRight = '0px';
    rightButton.style.marginLeft = '5px';
    

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show and hide blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    function takePicture() {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataString        = canvas.toDataURL('image/jpeg');
        //const dataString     = dataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        server.requestWriteResource(blockPos, Block.Camera, "", dataString); 
    }


    function clearPicture() {
        canvas.clear();
        server.requestWriteResource(blockPos, Block.Camera, "", ""); 
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
        if(event) event.stopPropagation();
        document.removeEventListener("keydown", keydownHandler);

        if(video.srcObject) video.srcObject.getVideoTracks().forEach(track => track.stop());
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
        
        navigator.mediaDevices.getUserMedia( {video: true} )
        .then( (stream) => { video.srcObject = stream; });
        server.requestReadResource(blockPos, Block.Camera, "");             
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
