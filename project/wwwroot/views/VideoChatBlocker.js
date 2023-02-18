'use strict';


function VideoChatBlocker(body, activateGame, deactivateGame, server) {

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


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // gui helper
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    function createHeader(panel) {
        const closeDiv           = GuiTools.createCloseButtonDiv(panel);
        const closeButton        = GuiTools.createCloseButton(closeDiv, hideAction);
    
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

        local.videoLocal               = new VideoLocal(localVideoChangeHandler);
        
        return local;
    }


    function createRemote(id, panel) {
        const remote                   = {};

        remote.ringTone                = new Audio("/resources/sounds/telephoneRing.mp3");
        remote.ringTone.loop           = true;
        remote.hangupTimer             = null;
        remote.videoRTC                = new VideoRTC(server, remoteVideoChangeHandler, id);

        remote.div                     = GuiTools.createDiv(panel);
        remote.bigVideoDiv             = GuiTools.createDiv(remote.div);
        remote.bigVideoDiv.style.margin= '10px';
        remote.bigVideoDiv.style.marginBottom = '0px';
        remote.bigVideoDiv.style.width = '320px';
        remote.bigVideoDiv.style.height= '240px';
        remote.video                   = GuiTools.createVideo(remote.bigVideoDiv);    
        GuiTools.createLineBreak(remote.div);
        remote.name                    = GuiTools.createTextInput(remote.div, 30, "194px", "25px");
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
        server.requestVideoChat(local.name.getText(), remote.name.getText(), VideoMessageType.RequestChat, null);        
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
            server.requestVideoChat(local.name.getText(), remote.name.getText(), VideoMessageType.StopChat, null);        
            remote.videoRTC.closeConnection();
        }     
        else {
            remoteSetIdle(remote);
        }   
    }


    function remoteVideoChangeHandler(remoteVideoRTC) {
        messageField.setMessage(remoteVideoRTC.getStatusMessage());

        const id        = remoteVideoRTC.id;
        const remote    = remotes[id];
        if(remoteVideoRTC.isIdle())           remoteSetIdle(remote);
        else if(remoteVideoRTC.isCalling())   remoteSetCalling(remote);
        else if(remoteVideoRTC.isConnected()) remoteSetConnected(remote);
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
    

    this.handleActorListMessage = function(message) {
        if( !this.isVisible() ) return;
        nameList.clearEntries();
        for(const name of message.names) {
            nameList.addEntry(name);
        }
    }


    this.handleActorChangedMessage = function(message) {
        if( !this.isVisible() ) return;

        if( message.change == ActorChangeType.Login && !nameList.containsEntry(message.name) ) {
            nameList.addEntry(message.name);
        }
        if( message.change == ActorChangeType.Logout ) {
            nameList.removeEntry(message.name);
        }
    }
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show and hide blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    

    function keydownHandler(event) {
        const keyCode = KeyCode.getFromEvent(event);
    
        if( keyCode == KeyCode.F4 ) {
            event.preventDefault();            
            hideAction();        
            return false; 
        }
        else {
            return true;
        }
    }
    

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


    function hideAction(event)  {
        if(event) event.stopPropagation();
        body.removeChild(div);       
        document.removeEventListener("keydown", keydownHandler);
        activateGame();    
        
        for(const remote of remotes) {
            if(remoteIsAnswering(remote)) {
                server.requestVideoChat(local.name.getText(), remote.name.getText(), VideoMessageType.StopChat, null);        
                remoteSetIdle(remote);
            }            
            else if(remote.videoRTC.isCalling()) {
                server.requestVideoChat(local.name.getText(), remote.name.getText(), VideoMessageType.StopChat, null);        
                remote.videoRTC.closeConnection();
                remoteSetIdle(remote);
            }            
            else if(remote.videoRTC.isIdle()) {
                remoteSetIdle(remote);
            }
        }

        if( remotes.some( function(remote) { return remote.videoRTC.isConnected(); } ) ) { 
            showSmallVideo();
        }
        else {
            local.videoLocal.stop();
        }

        messageField.clearMessage();       
        return false; 
    }
    

    this.show = function(_localName, _remoteName) {
        server.requestListActors();
        deactivateGame();
        hideSmallVideo();
        local.videoLocal.start();
        
        if( !body.contains(div) ) body.appendChild(div);
        document.addEventListener("keydown", keydownHandler);
        local.name.setText(_localName);
        remotes[0].name.focus();

        const id = getRemoteIdFirstIdle();
        if(_remoteName && id >= 0) {
            remotes[id].name.setText(_remoteName);
        }

        return true;
    }


    this.isVisible = function() {
        return body.contains(div);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // message handling
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    
    this.handleVideoChatMessage = function(message) {
        Log.trace("      video chat message is of type " + message.type);     
        
        if( message.type == VideoMessageType.RequestChat) {
            const id = getRemoteIdFirstIdle();
            if(id >= 0) {
                remotes[id].name.setText(message.sender);
                remoteSetAnswering(remotes[id]);
                messageField.setMessage(message.sender + " wants to video chat with you");    
            }
        }

        else if( message.type == VideoMessageType.StopChat ) {
            const id = getRemoteIdByName(message.sender);
            if(id >= 0) {
                remotes[id].videoRTC.closeConnection();
                remoteSetIdle(remotes[id]); 
                if(message.object) messageField.setMessage(message.object);   
            }
        }

        else {
            const id = getRemoteIdByName(message.sender);
            if(id >= 0) {
                remotes[id].videoRTC.handleVideoChatMessage(message);
            }
            else {
                Log.error("discarding message for wrong peer " + message.sender);
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
