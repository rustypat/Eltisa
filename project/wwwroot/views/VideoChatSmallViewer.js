"use strict"


function VideoChatSmallViewer(viewManager, serverIn, videoStreamStore) {
    const self = this;
    
    // event handler
    this.getEventHandler = (eventType) => null;
    this.getHtmlElement  = () => div;
    
    const div= GuiTools.createDiv();
    div.style.position = 'absolute';
    div.style.left     = '0px';
    div.style.top      = '0px';
    div.style.right    = '0px';
    div.style.height   = '120px';
    div.style.backgroundColor = 'transparent';    
    div.style.display  = 'flex';
    div.style.justifyContent = 'space-between';

    const localVideo = GuiTools.createVideo(div, true).small();
    const remoteDiv  = GuiTools.createDiv(div);

    const remoteVideos = [];
    remoteVideos[2] = GuiTools.createVideo(remoteDiv, true).small().transparent();
    remoteVideos[1] = GuiTools.createVideo(remoteDiv, true).small().transparent();
    remoteVideos[0] = GuiTools.createVideo(remoteDiv, true).small().transparent();
    
    updateView();


    this.enable = function() {
        videoStreamStore.streamsChangedObserver.add(updateView);
        updateView();
    }


    this.disable = function() {
        videoStreamStore.streamsChangedObserver.remove(updateView);
    }


    function updateView() {
        const localStream = videoStreamStore.getLocalStream();
        if(localStream) {
            localVideo.srcObject = localStream;
        }
        
        for(let i=0; i < 3; i++) {
            const remote = videoStreamStore.getRemote(i);
            const remoteVideo = remoteVideos[i];
            if(!remote) {
                remoteVideo.transparent();
                remoteVideo.srcObject  =  null;
            }
            else if(remote.isConnected()) {
                remoteVideo.srcObject  = remote.getStream();
            }
            else if(remote.isOpen()) {
                remoteVideo.attention();
                remoteVideo.srcObject  =  null;
            }
            else if(remote.isIdle()) { // is called
                remoteVideo.attention();
                remoteVideo.srcObject  =  null;
            }
        }
    }

}