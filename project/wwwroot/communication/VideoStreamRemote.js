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



// administrates a remote video stream connection over RTC
function VideoStreamRemote(serverIn, serverOut, changeHandler, id) {
    
    // type definitions
    const mediaConstraints = {
        audio: true,
        video: { mandatory: { maxWidth: 320, maxHeight: 240 } }
    };

    // connection data
    let localName;
    let remoteName;
    let videoStream;
    let statusMessage;
    let status               = VCS_Idle;
    let peerConnection;
    const self               = this;

    
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // video chat connection
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    

    this.openConnection = async function(_localName, _remoteName, localVideoStream) {
        try {
            localName   = _localName;
            remoteName  = _remoteName;

            serverIn.receiveVideoChatObserver.add(handleVideoChatMessage);
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

            serverIn.receiveVideoChatObserver.add(handleVideoChatMessage);
            peerConnection        = createPeerConnection();
            localVideoStream.getTracks().forEach(track => peerConnection.addTrack(track, localVideoStream));            
            setStatus(VCS_Calling, "answering to " + remoteName);
            let sdpOffer          = await peerConnection.createOffer();
            peerConnection.setLocalDescription(sdpOffer);
            serverOut.requestVideoChat(VMT_SendSdpOffer, remoteName,sdpOffer);
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
        setStatus(VCS_Idle);
        serverIn.receiveVideoChatObserver.remove(handleVideoChatMessage);
    }


    function handleVideoChatMessage(type, senderId, senderName, data) {
        if(senderName != remoteName) {
            Log.warn("got message from " + senderName);
        }
        else if(!peerConnection) {
            Log.error("received video chat message while peer connection is closed");
        }
        else if( type == VMT_RequestChat ) {
            // should not happen            
        }
        else if( type == VMT_StopChat ) {
            self.closeConnection();            
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


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // access and configuration
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    this.getId =  () => id;
    this.getVideoStream =  () => videoStream;
    this.getRemoteName  =  () => remoteName;
    this.getStatusMessage =  () => statusMessage;
    this.isIdle =  () => status == VCS_Idle;
    this.isCalling =  () => status == VCS_Calling;
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
            serverOut.requestVideoChat(VMT_SendSdpAnswer, remoteName, sdpAnswer);
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
            serverOut.requestVideoChat(VMT_SendIce, remoteName, event.candidate);
        };

        connection.ontrack = function(event){
            videoStream = event.streams[0];
            setStatus(VCS_Connected, "");
        };

        connection.onremovestream                = function() {};
        connection.oniceconnectionstatechange    = function() {
            if(connection.iceConnectionState == 'disconnected') {
                videoStream = null;
                setStatus(VCS_Idle, "lost connection to " + remoteName);
            }                        
        };
        connection.onicegatheringstatechange     = function() {};
        connection.onsignalingstatechange        = function() {};
        connection.onnegotiationneeded           = function() {};
        return connection;
    }


    function setStatus(_status, _statusMessage) {
        if( status==_status && statusMessage==_statusMessage) return;
        status        = _status;
        statusMessage = _statusMessage;        
        changeHandler(self);
    }

}
