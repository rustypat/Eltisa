'use strict';



// video message sub types
const VMT_RequestChat        = 1;
const VMT_StopChat           = 2;
const VMT_SendSdpOffer       = 3;
const VMT_SendSdpAnswer      = 4;
const VMT_SendIce            = 5;

// video chat status
const VCS_Idle               = 'idle';
const VCS_Connected          = 'connected';
const VCS_Calling            = 'calling';


///////////////////////////////////////////////////////////////////////////////////////////////////
// local video
///////////////////////////////////////////////////////////////////////////////////////////////////

function VideoLocal(changeHandler) {

    let localVideo;

    const mediaConstraints = {
        audio: true,
        video: { mandatory: { maxWidth: 320, maxHeight: 240 } }
    };

    let statusMessage;
    let status               = VCS_Idle;
    const self               = this;

    function setStatus(_status, _statusMessage) {
        if( status == _status && statusMessage == _statusMessage) return;
        status        = _status;
        statusMessage = _statusMessage;        
        changeHandler(self);
    }


    this.isIdle = function() {
        return status == VCS_Idle;
    }
    
    
    this.isConnected = function() {
        return status == VCS_Connected;
    }
    
    
    this.getStatusMessage = function() {
        return statusMessage;
    }

    
    this.start = async function() {
        if(localVideo) {
            return;
        }
        else if(!navigator.mediaDevices) {
            setStatus(VCS_Idle, "Error: not allowed to access camera without https!");
        }
        else try {
            localVideo  = await navigator.mediaDevices.getUserMedia( mediaConstraints );
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
        if(localVideo)  localVideo.getTracks().forEach( function(track) {track.stop() } );
        localVideo           = null;
        setStatus(VCS_Idle);
    }


    this.getVideoStream = function() {
        return localVideo
    }
    
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// remote video connection
///////////////////////////////////////////////////////////////////////////////////////////////////


function VideoRTC(serverOut, changeHandler, id) {
    
    this.id  = id;
    
    // type definitions
    const mediaConstraints = {
        audio: true,
        video: { mandatory: { maxWidth: 320, maxHeight: 240 } }
    };

    // connection data
    let localName;
    let remoteName;
    let remoteVideo;
    let statusMessage;
    let status               = VCS_Idle;
    let peerConnection;
    const self               = this;

    
    function setStatus(_status, _statusMessage) {
        if( status==_status && statusMessage==_statusMessage) return;
        status        = _status;
        statusMessage = _statusMessage;        
        changeHandler(self);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // access and configuration
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    this.getVideoStream = function() { 
        return remoteVideo;
    }


    this.getRemoteName = function() {
        return remoteName;
    }


    this.getStatusMessage = function() {
        return statusMessage;
    }
    

    this.isIdle = function() {
        return status == VCS_Idle;
    }


    this.isCalling = function() {
        return status == VCS_Calling;
    }


    this.isConnected = function() {
        return status == VCS_Connected;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // video chat connection
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    

    this.openConnection = async function(_localName, _remoteName, localVideoStream) {
        try {
            localName   = _localName;
            remoteName  = _remoteName;

            peerConnection        = createPeerConnection();
            localVideoStream.getTracks().forEach(track => peerConnection.addTrack(track, localVideoStream));            
            setStatus(VCS_Calling, "waiting for " + remoteName);
        } catch(e) {
            setStatus(VCS_Idle, e.name);
            Log.error(e);
        }
    }


    this.answerConnection = async function(_localName, _remoteName, localVideoStream) {
        try {
            localName   = _localName;
            remoteName  = _remoteName;

            peerConnection        = createPeerConnection();
            localVideoStream.getTracks().forEach(track => peerConnection.addTrack(track, localVideoStream));            
            setStatus(VCS_Calling, "answering to " + remoteName);
            let sdpOffer          = await peerConnection.createOffer();
            peerConnection.setLocalDescription(sdpOffer);
            serverOut.requestVideoChat(localName, remoteName, VMT_SendSdpOffer, sdpOffer);
        } catch(e) {
            setStatus(VCS_Idle, e.name);
            Log.error(e);
        }
    }



    this.closeConnection = function() {
        if(remoteVideo) remoteVideo.getTracks().forEach( function(track) {track.stop() } );
        if(peerConnection) peerConnection.close();
        remoteVideo          = null;
        peerConnection       = null;
        setStatus(VCS_Idle);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // peer message handling
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    
    this.handleVideoChatMessage = function(sender, receiver, type, data) {
        if(!peerConnection) {
            Log.error("received video chat message while peer connection is closed");
        }

        else if( type == VMT_SendSdpOffer ) {
            acceptSdpOffer(data);            
        }

        else if( type == VMT_SendSdpAnswer ) {
            acceptSdpAnswer(data);            
        }

        else if( type == VMT_SendIce ) {
            acceptIceCandidat(data);            
        }

        else {
            Log.error("got unknown video chat message of type "+ type);
        }
    }


    async function acceptIceCandidat(iceCandidat) {
        try {
            let candidate = new RTCIceCandidate(iceCandidat);
            await peerConnection.addIceCandidate(candidate)
        } catch(e) {
            Log.error(e);
        }
    }


    async function acceptSdpOffer(sdp) {
        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
            let sdpAnswer         = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(sdpAnswer);
            serverOut.requestVideoChat(localName, remoteName, VMT_SendSdpAnswer, sdpAnswer);
        } catch(e) {
            Log.error(e);
        }
    }


    async function acceptSdpAnswer(sdp) {
        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
        } catch(e) {
            Log.error(e);
        }
    }



    function createPeerConnection() {
        let connectionConfig = { iceServers: [ {urls: 'stun:stun.l.google.com:19302'} ]};
        let connection       = new RTCPeerConnection(connectionConfig);

        connection.onicecandidate = function(event){
            serverOut.requestVideoChat(localName, remoteName, VMT_SendIce, event.candidate);
        };

        connection.ontrack = function(event){
            remoteVideo = event.streams[0];
            setStatus(VCS_Connected, "");
        };

        connection.onremovestream                = function() {};
        connection.oniceconnectionstatechange    = function() {
            if(connection.iceConnectionState == 'disconnected') {
                remoteVideo = null;
                setStatus(VCS_Idle, "lost connection to " + remoteName);
            }                        
        };
        connection.onicegatheringstatechange     = function() {};
        connection.onsignalingstatechange        = function() {};
        connection.onnegotiationneeded           = function() {};
        return connection;
    }

}
