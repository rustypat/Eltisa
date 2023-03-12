'use strict';


// video message sub types
const VMT_RequestChat        = 1;
const VMT_StopChat           = 2;
const VMT_SendSdpOffer       = 3;
const VMT_SendSdpAnswer      = 4;
const VMT_SendIce            = 5;

// video chat status
const VCS_Idle               = 'idle';       // used as called
const VCS_Open               = 'calling';
const VCS_Connected          = 'connected';



// administrates a remote video stream connection over RTC
function VideoStreamRemote(serverIn, serverOut, changeHandler, id) {
    
    // type definitions
    const mediaConstraints = {
        audio: true,
        video: { mandatory: { maxWidth: 320, maxHeight: 240 } }
    };

    // connection data
    let videoStream;
    let statusMessage;
    let status               = VCS_Idle;
    let peerConnection;
    const self               = this;

    
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // video chat connection
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    

    this.openConnection = async function(localVideoStream) {
        try {
            serverIn.receiveVideoChatObserver.add(handleVideoChatMessage);
            peerConnection        = createPeerConnection();
            localVideoStream.getTracks().forEach(track => peerConnection.addTrack(track, localVideoStream));            
            setStatus(VCS_Open, "waiting for " + id);
            serverOut.requestVideoChat(VMT_RequestChat, id, null);    
        } catch(e) {
            setStatus(VCS_Idle, e.name);
            Log.error(e);
        }
    }


    this.answerConnection = async function(localVideoStream) {
        try {
            serverIn.receiveVideoChatObserver.add(handleVideoChatMessage);
            peerConnection        = createPeerConnection();
            localVideoStream.getTracks().forEach(track => peerConnection.addTrack(track, localVideoStream));            
            setStatus(VCS_Open, "answering to " + id);
            let sdpOffer          = await peerConnection.createOffer();
            peerConnection.setLocalDescription(sdpOffer);
            serverOut.requestVideoChat(VMT_SendSdpOffer, id, sdpOffer);
        } catch(e) {
            setStatus(VCS_Idle, e.name);
            Log.error(e);
        }
    }


    this.closeConnection = function() {
        if(videoStream) videoStream.getTracks().forEach( function(track) {track.stop() } );
        if(peerConnection) peerConnection.close();
        videoStream          = null;
        peerConnection       = null;
        serverIn.receiveVideoChatObserver.remove(handleVideoChatMessage);
        serverOut.requestVideoChat(VMT_StopChat, id, "connection closed");        
        setStatus(VCS_Idle);
    }


    function handleVideoChatMessage(type, senderName, data) {
        Log.trace("VideoStreamRemote: received videoChatMessage " + type + " from " + senderName + " for " + id);
        if(senderName != id) {
            Log.warning("VideoStreamRemote: dropped message from " + senderName);
        }
        else if(!peerConnection) {
            Log.error("VideoStreamRemote: received video chat message while peer connection is closed");
        }
        else if( type == VMT_RequestChat ) {
            Log.error("VideoStreamRemote: received VMT_RequestChat");
            // should not happen            
        }
        else if( type == VMT_StopChat ) {
            Log.trace("VideoStreamRemote: close connection");
            self.closeConnection();            
        }
        else if( type == VMT_SendSdpOffer ) {
            Log.trace("VideoStreamRemote: accept SDP offer");
            acceptSdpOffer(data);            
        }
        else if( type == VMT_SendSdpAnswer ) {
            Log.trace("VideoStreamRemote: accept SDP answer");
            acceptSdpAnswer(data);            
        }
        else if( type == VMT_SendIce ) {
            Log.trace("VideoStreamRemote: accept ICE candidat");
            acceptIceCandidat(data);            
        }
        else {
            Log.error("VideoStreamRemote: got unknown video chat message of type "+ type);
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // access and configuration
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    this.getId =  () => id;
    this.getStream =  () => videoStream;
    this.getStatusMessage =  () => statusMessage;
    this.isIdle =  () => status == VCS_Idle;
    this.isOpen =  () => status == VCS_Open;
    this.isConnected =  () => status == VCS_Connected;


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // private methods
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    

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
            serverOut.requestVideoChat(VMT_SendSdpAnswer, id, sdpAnswer);
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
            serverOut.requestVideoChat(VMT_SendIce, id, event.candidate);
        };

        connection.ontrack = function(event){
            videoStream = event.streams[0];
            setStatus(VCS_Connected, "");
        };

        connection.onremovestream                = function() {};
        connection.oniceconnectionstatechange    = function() {
            if(connection.iceConnectionState == 'disconnected') {
                videoStream = null;
                setStatus(VCS_Idle, "lost connection to " + id);
            }                        
        };
        connection.onicegatheringstatechange     = function() {};
        connection.onsignalingstatechange        = function() {};
        connection.onnegotiationneeded           = function() {};
        return connection;
    }


    function setStatus(newStatus, newStatusMessage) {
        if( status==newStatus && statusMessage==newStatusMessage) return;
        status        = newStatus;
        statusMessage = newStatusMessage;        
        changeHandler(self);
    }

}
