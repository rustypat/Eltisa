"use strict"


function VideoStreamStore(serverIn, serverOut) {
    const self                    =  this;
    const local                   =  new VideoStreamLocal(localStreamChangedHandler);
    const remotes                 =  [];
    const maxConnections          =  3;

    this.streamsChangedObserver   =  new Observer();
    serverIn.actorLeftObserver.add(handleActorLeft);
    serverIn.receiveVideoChatObserver.add(handleVideoChatMessage);

    const ringTone                = new Audio("/resources/sounds/telephoneRing.mp3");
    ringTone.loop                 = true;


    this.startLocal = function(afterConnectionAction) {
        if(local.isConnected()) return;
        local.start(afterConnectionAction);
    }


    this.stopLocal = function() {
        if(local.isIdle()) return;
        local.stop();
        for(let remote of remotes) {            
            remote.closeConnection();
        }
        remotes.length = 0;
        ringTone.pause();
        remoteStreamChangeHandler();
    }


    this.getLocalStream =  () => local.getStream();


    this.openRemote = function(name) {
        if(remotes.length > maxConnections) return;
        if(remoteExists(name)) return;
        if(!name) return;
        if(!local.getStream()) return;
        Log.trace("VideoStreamStore: open remote " + name);
        const remote = new VideoStreamRemote(serverIn, serverOut, remoteStreamChangeHandler, name);
        remotes.push(remote);
        remote.openConnection(local.getStream());
        startHangupTimer(remote);
    }


    function receiveRemote(name) {
        if(remotes.length > maxConnections) return;
        if(remoteExists(name)) return;
        if(!name) return;
        Log.trace("VideoStreamStore: receive remote " + name);
        const remote = new VideoStreamRemote(serverIn, serverOut, remoteStreamChangeHandler, name);
        remotes.push(remote);
        remoteStreamChangeHandler();
        startHangupTimer(remote);
    }


    this.answerRemote = function(name) {
        const remote = remotes.find(r => r.getId() == name);
        if(!remote) return;
        Log.trace("VideoStreamStore: answer remote " + name);
        stopHangupTimer(remote);
        remote.answerConnection(local.getStream());
    }


    this.closeRemote = function(name) {
        const remote = remotes.find(r => r.getId() == name);
        if(!remote) return;
        Log.trace("VideoStreamStore: close remote " + name);
        removeRemote(remote);
    }


    this.getRemoteByName = function(name) {
        return remotes.find(r => r.getId() == name);
    }


    this.getRemote = function(index) {
        if(index < 0 || index >= remotes.length) return;
        return remotes[index];
    }


    this.countRemotes = function() {
        return remotes.length;
    }


    function remoteExists(name) {
        if(remotes.find(r => r.getId() == name)) return true;
        else                                     return false;
    }


    function removeRemote(remote) {
        const index = remotes.indexOf(remote);
        if (index > -1) remotes.splice(index, 1); 
        stopHangupTimer(remote);
        remote.closeConnection();
        remoteStreamChangeHandler();
    }


    function localStreamChangedHandler() {
        Log.debug("VideoStreamStore: local video stream changed");
        setRingTone();
        self.streamsChangedObserver.call();
    }


    function remoteStreamChangeHandler() {
        Log.debug("VideoStreamStore: remote video stream changed");
        setRingTone();
        self.streamsChangedObserver.call();
    }


    function handleActorLeft(id, name) {
        if(remoteExists(name)) {
            self.closeRemote(name);
            self.streamsChangedObserver.call();
        }
    }


    function handleVideoChatMessage(type, senderName, data) {
        if(type == VMT_RequestChat) {
            receiveRemote(senderName);
        }
        else if(type == VMT_StopChat ) {
            self.closeRemote(senderName);
        }        
    }


    function setRingTone() {
        let hasCalling = remotes.some(r => r.isIdle() || r.isOpen());
        if(hasCalling) ringTone.play();
        else           ringTone.pause();
    }

    
    function startHangupTimer(remote) {
        if(remote.hangupTimer) window.clearTimeout(remote.hangupTimer);
        remote.hangupTimer = window.setTimeout(function(){
            if(!remote.isConnected()) removeRemote(remote);
        }, Config.videoChatTimeOut);
    }


    function stopHangupTimer(remote) {
        if(remote.hangupTimer) window.clearTimeout(remote.hangupTimer);
        remote.hangupTimer = null;
    }

}


