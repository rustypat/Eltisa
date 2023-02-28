'use strict';


function VideoChatViewer(viewManager, serverIn, serverOut, player) {
    const self = this;
    const body = document.getElementsByTagName("body")[0];
    
    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_F4]   = close;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => div;


    const localSmallVideoDiv = createLocalSmallVideoDiv()
    const remoteSmallVideoDiv= createRemoteSmallVideoDiv()
    
    const div                = GuiTools.createOverlay(null, CLR_Glossy);
    const panel              = GuiTools.createTabletDiv(div);
    panel.style.width        = '90%';
    panel.style.textAlign    = 'left';

    const messageField       = createHeader(panel);
    
    const local              = createLocal(panel);

    const remotes            = []
    remotes[0]               = createRemote(0, panel);
    remotes[1]               = createRemote(1, panel);
    remotes[2]               = createRemote(2, panel);

    GuiTools.createLineBreak(panel);
    const nameList           = GuiTools.createList(panel, '5', selectRemoteNameAction, callRemoteNameAction);


    this.enable = function() {
        let localName = player.getName();
        let remoteName = player.getTargetPlayerName();

        serverOut.requestListActors();
        //hideSmallVideo();
        local.videoLocal.start();
        
        local.name.setText(localName);
        remotes[0].name.focus();

        const id = getRemoteIdFirstIdle();
        if(remoteName && id >= 0) {
            remotes[id].name.setText(remoteName);
        }

        serverIn.receiveVideoChatObserver.add(handleVideoChatMessage);
        serverIn.receiveActorListObserver.add(updateActorList);
        serverIn.actorJoinedObserver.add(handleActorJoined);
        serverIn.actorLeftObserver.add(handleActorLeft);

        return true;
    }


    this.disable = function() {
        serverIn.receiveVideoChatObserver.remove(handleVideoChatMessage);
        serverIn.receiveActorListObserver.remove(updateActorList);
        serverIn.actorJoinedObserver.remove(handleActorJoined);
        serverIn.actorLeftObserver.remove(handleActorLeft);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // gui helper
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    function createHeader(panel) {
        const closeDiv           = GuiTools.createCloseButtonDiv(panel);
        const closeButton        = GuiTools.createCloseButton(closeDiv, close);
    
        GuiTools.createTitle(panel, "Video chat", "10px");
        GuiTools.createLineBreak(panel);
        const messageField       = GuiTools.createMessageField(panel, null, "660px", "20px");    
        GuiTools.createLineBreak(panel);
        return messageField;
    }


    function createLocalSmallVideoDiv() {
        const smallDiv= GuiTools.createDiv();
        smallDiv.style.position = 'absolute';
        smallDiv.style.left     = '0px';
        smallDiv.style.top      = '0px';
        smallDiv.style.width    = '160px';
        smallDiv.style.height   = '120px';
        //smallDiv.style.backgroundColor = 'grey';
        return smallDiv;            
    }

    
    function createRemoteSmallVideoDiv() {
        const smallDiv= GuiTools.createDiv();
        smallDiv.style.position = 'absolute';
        smallDiv.style.right    = '0px';
        smallDiv.style.top      = '0px';
        smallDiv.style.width    = '160px';
        smallDiv.style.height   = '360px';
        //smallDiv.style.backgroundColor = 'grey';
        return smallDiv;            
    }

    
    function createLocal(panel) {
        const local                    = {};

        local.div                      = GuiTools.createDiv(panel);
        local.bigVideoDiv              = GuiTools.createDiv(local.div);
        local.bigVideoDiv.style.margin = '10px';
        local.bigVideoDiv.style.marginBottom = '0px';
        local.bigVideoDiv.style.width  = '320px';
        local.bigVideoDiv.style.height = '240px';
        local.video                    = GuiTools.createVideo(local.bigVideoDiv, true);
        GuiTools.createLineBreak(local.div);
        local.name                     = GuiTools.createLabel(local.div, "me");
        local.button                   = GuiTools.createButtonSmall(local.div, "start cam", startAction);
        local.name.style.marginTop     = '0px';
        local.name.style.width         = "200px";
        local.button.style.marginTop   = '0px';

        local.videoLocal               = new VideoStreamLocal(localVideoChangeHandler);
        
        return local;
    }


    function createRemote(id, panel) {
        const remote                   = {};

        remote.ringTone                = new Audio("/resources/sounds/telephoneRing.mp3");
        remote.ringTone.loop           = true;
        remote.hangupTimer             = null;
        remote.videoRTC                = new VideoStreamRemote(serverOut, remoteVideoChangeHandler, id);

        remote.div                     = GuiTools.createDiv(panel);
        remote.bigVideoDiv             = GuiTools.createDiv(remote.div);
        remote.bigVideoDiv.style.margin= '10px';
        remote.bigVideoDiv.style.marginBottom = '0px';
        remote.bigVideoDiv.style.width = '320px';
        remote.bigVideoDiv.style.height= '240px';
        remote.video                   = GuiTools.createVideo(remote.bigVideoDiv);    
        GuiTools.createLineBreak(remote.div);
        remote.name                    = GuiTools.createEditField(remote.div, 30, "194px", "25px");
        remote.name.style.marginTop    = '0px';
        remote.name.style.paddingLeft  = '5px';
        remote.button                  = GuiTools.createButtonSmall(remote.div, "call", callAction);
        remote.button.disable();
        remote.button.style.marginTop  = '0px';
        remote.button.id               = id;
        remote.id                      = id;
        
        return remote;            
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // local video
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    
    function startAction() {
        local.videoLocal.start();
    }

    
    function stopAction() {
        local.videoLocal.stop();
        local.video.srcObject  = null;
    }

    
    function localVideoChangeHandler() {

        if(local.videoLocal.isIdle()) {
            local.button.set("start cam", startAction);
            local.video.srcObject      = null;
            for(const remote of remotes) {
                remote.videoRTC.closeConnection();
                remoteSetIdle(remote);
                remote.button.disable();
            }
            messageField.setMessage(local.videoLocal.getStatusMessage());
        }
        else if(local.videoLocal.isConnected()) {
            local.video.srcObject = local.videoLocal.getVideoStream();
            local.button.set("stop cam", stopAction);
            for(const remote of remotes) {
                if(remote.button.disabled) remote.button.enable();
            }
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // remote video
    ///////////////////////////////////////////////////////////////////////////////////////////////////
   
    
    function callAction(event, id) {
        if( event ) id = event.target.id;
        const remote    = remotes[id];

        if( remote.name.getText() == "" ) {
            messageField.setMessage("enter name of peer");
            return;
        }
        if( remote.name.getText() == local.name.getText() ) {
            messageField.setMessage("you better take a mirror if you want to talk to yourself!");
            return;
        }
        if( !local.videoLocal.getVideoStream() ) {
            messageField.setMessage("video camera ist not turned on");
            return;
        }
        serverOut.requestVideoChat(local.name.getText(), remote.name.getText(), VMT_RequestChat, null);        
        remote.videoRTC.openConnection(local.name.getText(), remote.name.getText(), local.videoLocal.getVideoStream());
    }


    function answerAction(event) {
        const button    = event.target;
        const id        = button.id;
        const remote    = remotes[id];

        remote.videoRTC.answerConnection(local.name.getText(), remote.name.getText(), local.videoLocal.getVideoStream());
    }


    function hangupAction(event, id) {
        if(event) id  = event.target.id;          // take id from triggering button
        const remote  = remotes[id];        
        if( !remote.videoRTC.isIdle() ) {
            serverOut.requestVideoChat(local.name.getText(), remote.name.getText(), VMT_StopChat, null);        
            remote.videoRTC.closeConnection();
        }     
        else {
            remoteSetIdle(remote);
        }   
    }


    function remoteVideoChangeHandler(remoteVideoStream) {
        messageField.setMessage(remoteVideoStream.getStatusMessage());

        const id        = remoteVideoStream.getId();
        const remote    = remotes[id];
        if(remoteVideoStream.isIdle())           remoteSetIdle(remote);
        else if(remoteVideoStream.isCalling())   remoteSetCalling(remote);
        else if(remoteVideoStream.isConnected()) remoteSetConnected(remote);
        else                                  Log.error("invalid remoteVideo status ");
    }


    function remoteSetIdle(remote) {
        remote.video.srcObject  = null;
        remote.name.readOnly    = false;
        remote.button.set("call", callAction);
        remote.ringTone.pause();
        remote.button.enable();
        stopHangupTimer(remote);                
    } 


    function remoteSetCalling(remote) {
        remote.video.srcObject  = null;
        remote.name.readOnly    = true;
        remote.button.set("hang up", hangupAction);
        remote.ringTone.play();
        remote.button.activate();
        startHangupTimer(remote);
    }


    function remoteSetAnswering(remote) {
        remote.video.srcObject  = null;
        remote.name.readOnly    = true;
        remote.button.set("answer", answerAction);
        remote.ringTone.play();
        remote.button.activate();
        startHangupTimer(remote);
    }


    function remoteSetConnected(remote) {
        remote.video.srcObject  = remote.videoRTC.getVideoStream();
        remote.name.readOnly    = true;
        remote.button.set("hang up", hangupAction);
        remote.ringTone.pause();
        remote.button.enable();
        stopHangupTimer(remote);
    }


    function remoteIsAnswering(remote) {
        if(remote.videoRTC.isConnected()) return false;
        return remote.button.innerHTML == "answer";
    }


    function startHangupTimer(remote) {
        if(remote.hangupTimer) window.clearTimeout(remote.hangupTimer);
        remote.hangupTimer = window.setTimeout(function(){
            hangupAction(null, remote.id);
        }, Config.videoChatTimeOut);
    }


    function stopHangupTimer(remote) {
        if(remote.hangupTimer) window.clearTimeout(remote.hangupTimer);
        remote.hangupTimer = null;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // name list
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    function selectRemoteNameAction(_remoteName) {
        if(_remoteName == local.name.getText()) return;

        if(remotes[0].videoRTC.isIdle()) {
            remotes[0].name.setText(_remoteName);
        }
        else if(remotes[1].videoRTC.isIdle()) {
            remotes[1].name.setText(_remoteName);
        }
        else if(remotes[1].videoRTC.isIdle()) {
            remotes[1].name.setText(_remoteName);
        }        
    }
    

    function callRemoteNameAction(_remoteName) {
        if(_remoteName == local.name.getText()) return;

        if(remotes[0].videoRTC.isIdle()) {
            remotes[0].name.setText(_remoteName);
            callAction(null, 0);
        }
        else if(remotes[1].videoRTC.isIdle()) {
            remotes[1].name.setText(_remoteName);
            callAction(null, 1);
        }
        else if(remotes[1].videoRTC.isIdle()) {
            remotes[1].name.setText(_remoteName);
            callAction(null, 2);
        }        
    }
    

    function updateActorList(actors) {
        nameList.clearEntries();
        for(const actor of actors) {
            nameList.addEntry(actor.name);
        }
    }


    function handleActorJoined(id, name, type, look) {
        if( nameList.containsEntry(name) ) return;
        nameList.addEntry(name);
    }


    function handleActorLeft(id, name) {
        nameList.removeEntry(name);
    }
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show and hide blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    

    function showSmallVideo() {
        if( !body.contains(localSmallVideoDiv) ) {
            body.appendChild(localSmallVideoDiv);
        }

        if( !body.contains(remoteSmallVideoDiv) ) {
            body.appendChild(remoteSmallVideoDiv);
        }

        if( !localSmallVideoDiv.contains(local.video) ) {
            localSmallVideoDiv.appendChild(local.video);
            local.video.small();
            local.video.srcObject = local.videoLocal.getVideoStream();   // needed for chrome, otherwise it freezes
        }

        for(const remote of remotes) {
            if( !remoteSmallVideoDiv.contains(remote.video) && remote.videoRTC.isConnected()) {
                remoteSmallVideoDiv.appendChild(remote.video);
                remote.video.small();
                remote.video.srcObject = remote.videoRTC.getVideoStream();   // needed for chrome, otherwise it freezes
            }
        }
    }
    

    function hideSmallVideo() {
        if( body.contains(localSmallVideoDiv) ) {
            body.removeChild(localSmallVideoDiv);
        }

        if( body.contains(remoteSmallVideoDiv) ) {
            body.removeChild(remoteSmallVideoDiv);
        }


        if( !local.bigVideoDiv.contains(local.video) ) {
            local.bigVideoDiv.appendChild(local.video);
            local.video.big();
            local.video.srcObject = local.videoLocal.getVideoStream();   // needed for chrome, otherwise it freezes
        }

        for(const remote of remotes) {
            if( !remote.bigVideoDiv.contains(remote.video) ) {
                remote.bigVideoDiv.appendChild(remote.video);
                remote.video.big();
                remote.video.srcObject = remote.videoRTC.getVideoStream();   // needed for chrome, otherwise it freezes
            }
        }
    }


    function close()  {
        viewManager.unshow(self);

        for(const remote of remotes) {
            if(remoteIsAnswering(remote)) {
                serverOut.requestVideoChat(local.name.getText(), remote.name.getText(), VMT_StopChat, null);        
                remoteSetIdle(remote);
            }            
            else if(remote.videoRTC.isCalling()) {
                serverOut.requestVideoChat(local.name.getText(), remote.name.getText(), VMT_StopChat, null);        
                remote.videoRTC.closeConnection();
                remoteSetIdle(remote);
            }            
            else if(remote.videoRTC.isIdle()) {
                remoteSetIdle(remote);
            }
        }

        if( remotes.some(  remote => remote.videoRTC.isConnected() ) ) { 
            showSmallVideo();
        }
        else {
            local.videoLocal.stop();
        }

        messageField.clearMessage();       
        return false; 
    }
    



    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // message handling
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    
    function handleVideoChatMessage(sender, receiver, type, data) {
        Log.trace("      video chat message is of type " + type);     
        
        if( type == VMT_RequestChat) {
            const id = getRemoteIdFirstIdle();
            if(id >= 0) {
                remotes[id].name.setText(sender);
                remoteSetAnswering(remotes[id]);
                messageField.setMessage(sender + " wants to video chat with you");    
            }
        }

        else if( type == VMT_StopChat ) {
            const id = getRemoteIdByName(sender);
            if(id >= 0) {
                remotes[id].videoRTC.closeConnection();
                remoteSetIdle(remotes[id]); 
                if(data) messageField.setMessage(data);   
            }
        }

        else {
            const id = getRemoteIdByName(sender);
            if(id >= 0) {
                remotes[id].videoRTC.handleVideoChatMessage(sender, receiver, type, data);
            }
            else {
                Log.error("discarding message for wrong peer " + sender);
            }
        }
    }


    function getRemoteIdFirstIdle() {
        for(let id=0; id < remotes.length; id++) {
            const remote = remotes[id];
            if(remote.videoRTC.isIdle()) {
                return id;
            }
        }
        return null;
    }


    function getRemoteIdByName(name) {
        for(let id=0; id < remotes.length; id++) {
            const remote = remotes[id];
            if(remote.videoRTC.getRemoteName() == name || remote.name.getText() == name) {
               return id;
            }
        }
        
        return null;
    }

}
