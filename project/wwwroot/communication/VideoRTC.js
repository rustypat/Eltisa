'use strict';


const VideoMessageType = { RequestChat: 1, StopChat:2,  SendSdpOffer: 3, SendSdpAnswer: 4, SendIce: 5 };


///////////////////////////////////////////////////////////////////////////////////////////////////
// local video
///////////////////////////////////////////////////////////////////////////////////////////////////

function VideoLocal(changeHandler) {

    var localVideo;

    const mediaConstraints = {
        audio: true,
        video: { mandatory: { maxWidth: 320, maxHeight: 240 } }
    };

    const Status             = { Idle: "off", Connected: "on" };
    this.Status              = Status;
    var statusMessage;
    var status               = Status.Idle;
    const self               = this;

    function setStatus(_status, _statusMessage) {
        if( status==_status && statusMessage==_statusMessage) return;
        status        = _status;
        statusMessage = _statusMessage;        
        changeHandler(self);
    }


    this.isIdle = function() {
        return status == Status.Idle;
    }
    
    
    this.isConnected = function() {
        return status == Status.Connected;
    }
    
    
    this.getStatusMessage = function() {
        return statusMessage;
    }

    
    this.start = async function() {
        if(localVideo) return;
        try {
            localVideo  = await navigator.mediaDevices.getUserMedia( mediaConstraints );
            setStatus(Status.Connected);
        } catch(e) {
            if( e.name == "NotFoundError" )         setStatus(Status.Idle, "Error: no camera found");
            else if( e.name == "NotAllowedError" )  setStatus(Status.Idle, "Error: no access to camera");
            else if( e.name == "NotReadableError" ) setStatus(Status.Idle, "Error: no access to camera");
            else                                    setStatus(Status.Idle, e.name);
        }
    }


    this.stop = function() {
        if(localVideo)  localVideo.getTracks().forEach( function(track) {track.stop() } );
        localVideo           = null;
        setStatus(Status.Idle);
    }


    this.getVideoStream = function() {
        return localVideo
    }
    
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// remote video connection
///////////////////////////////////////////////////////////////////////////////////////////////////


function VideoRTC(server, changeHandler, id) {
    
    this.id  = id;
    
    // type definitions
    const mediaConstraints = {
        audio: true,
        //video: { mandatory: { maxWidth: 160, maxHeight: 120 } }
        video: { mandatory: { maxWidth: 320, maxHeight: 240 } }
    };

    const Status = { Idle: "idle", Calling: "calling", Connected: "connected" };
    this.Status  = Status;


    // connection data
    var localName;
    var remoteName;
    var remoteVideo;
    var statusMessage;
    var status               = Status.Idle;
    var peerConnection;
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
        return status == Status.Idle;
    }


    this.isCalling = function() {
        return status == Status.Calling;
    }


    this.isConnected = function() {
        return status == Status.Connected;
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
            setStatus(Status.Calling, "waiting for " + remoteName);
        } catch(e) {
            setStatus(Status.Idle, e.name);
            Log.error(e);
        }
    }


    this.answerConnection = async function(_localName, _remoteName, localVideoStream) {
        try {
            localName   = _localName;
            remoteName  = _remoteName;

            peerConnection        = createPeerConnection();
            localVideoStream.getTracks().forEach(track => peerConnection.addTrack(track, localVideoStream));            
            setStatus(Status.Calling, "answering to " + remoteName);
            var sdpOffer          = await peerConnection.createOffer();
            peerConnection.setLocalDescription(sdpOffer);
            server.requestVideoChat(localName, remoteName, VideoMessageType.SendSdpOffer, sdpOffer);
        } catch(e) {
            setStatus(Status.Idle, e.name);
            Log.error(e);
        }
    }



    this.closeConnection = function() {
        if(remoteVideo) remoteVideo.getTracks().forEach( function(track) {track.stop() } );
        if(peerConnection) peerConnection.close();
        remoteVideo          = null;
        peerConnection       = null;
        setStatus(Status.Idle);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // peer message handling
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    
    this.handleVideoChatMessage = function(message) {
        if(!peerConnection) {
            Log.error("received video chat message while peer connection is closed");
        }

        else if( message.type == VideoMessageType.SendSdpOffer ) {
            acceptSdpOffer(message.object);            
        }

        else if( message.type == VideoMessageType.SendSdpAnswer ) {
            acceptSdpAnswer(message.object);            
        }

        else if( message.type == VideoMessageType.SendIce ) {
            acceptIceCandidat(message.object);            
        }

        else {
            Log.error("got unknown video chat message of type "+ message.type);
        }
    }


    async function acceptIceCandidat(iceCandidat) {
        try {
            var candidate = new RTCIceCandidate(iceCandidat);
            await peerConnection.addIceCandidate(candidate)
        } catch(e) {
            Log.error(e);
        }
    }


    async function acceptSdpOffer(sdp) {
        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
            var sdpAnswer         = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(sdpAnswer);
            server.requestVideoChat(localName, remoteName, VideoMessageType.SendSdpAnswer, sdpAnswer);
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
        var connectionConfig = { iceServers: [ {urls: 'stun:stun.l.google.com:19302'} ]};
        var connection       = new RTCPeerConnection(connectionConfig);

        connection.onicecandidate = function(event){
            server.requestVideoChat(localName, remoteName, VideoMessageType.SendIce, event.candidate);
        };

        connection.ontrack = function(event){
            remoteVideo = event.streams[0];
            setStatus(Status.Connected, "");
        };

        connection.onremovestream                = function() {};
        connection.oniceconnectionstatechange    = function() {
            if(connection.iceConnectionState == 'disconnected') {
                remoteVideo = null;
                setStatus(Status.Idle, "lost connection to " + remoteName);
            }                        
        };
        connection.onicegatheringstatechange     = function() {};
        connection.onsignalingstatechange        = function() {};
        connection.onnegotiationneeded           = function() {};
        return connection;
    }

}
