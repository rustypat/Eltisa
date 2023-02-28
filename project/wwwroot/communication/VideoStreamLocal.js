'use strict';

function VideoStreamLocal(changeHandler) {

    const mediaConstraints = {
        audio: true,
        video: { mandatory: { maxWidth: 320, maxHeight: 240 } }
    };

    let videoStream;
    let statusMessage;
    let status               = VCS_Idle;
    const self               = this;


    this.start = async function() {
        if(videoStream) {
            return;
        }
        else if(!navigator.mediaDevices) {
            setStatus(VCS_Idle, "Error: not allowed to access camera without https!");
        }
        else try {
            videoStream  = await navigator.mediaDevices.getUserMedia( mediaConstraints );
            setStatus(VCS_Connected);
        } catch(e) {
            if( e.name == "NotFoundError" )         setStatus(VCS_Idle, "Error: no camera found");
            else if( e.name == "NotAllowedError" )  setStatus(VCS_Idle, "Error: no access to camera");
            else if( e.name == "NotReadableError" ) setStatus(VCS_Idle, "Error: no access to camera");
            else if( e.name == "TypeError" )        setStatus(VCS_Idle, "Error: no access to camera (missing certificate?) ");
            else                                    setStatus(VCS_Idle, e.name);
        }
    }


    this.stop = function() {
        if(videoStream)  videoStream.getTracks().forEach( function(track) {track.stop() } );
        videoStream           = null;
        setStatus(VCS_Idle);
    }


    this.isIdle           =   () => status == VCS_Idle;
    this.isConnected      =   () => status == VCS_Connected;
    this.getStatusMessage =   () => statusMessage;
    this.getVideoStream   =   () => videoStream;

    
    function setStatus(_status, _statusMessage) {
        if( status == _status && statusMessage == _statusMessage) return;
        status        = _status;
        statusMessage = _statusMessage;        
        changeHandler(self);
    }

}

