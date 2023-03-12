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


    this.start = function(afterConnectionAction) {
        if(videoStream) {
            return;
        }
        else if(!navigator.mediaDevices) {
            setStatus(VCS_Idle, "Error: not allowed to access camera without https!");
        }
        else {
            navigator.mediaDevices.getUserMedia( mediaConstraints)
            .then((stream) => {
                videoStream = stream;
                setStatus(VCS_Connected);
                try{ afterConnectionAction?.(); }catch(e){ Log.error(e); }
            }) 
            .catch((err) => {
                if( err.name == "NotFoundError" )         setStatus(VCS_Idle, "Error: no camera found");
                else if( err.name == "NotAllowedError" )  setStatus(VCS_Idle, "Error: no access to camera");
                else if( err.name == "NotReadableError" ) setStatus(VCS_Idle, "Error: no access to camera");
                else if( err.name == "TypeError" )        setStatus(VCS_Idle, "Error: no access to camera (missing certificate?) ");
                else                                      setStatus(VCS_Idle, err.name);
            });
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
    this.getStream        =   () => videoStream;

    
    function setStatus(_status, _statusMessage) {
        if( status == _status && statusMessage == _statusMessage) return;
        status        = _status;
        statusMessage = _statusMessage;        
        changeHandler?.(self);
    }

}

