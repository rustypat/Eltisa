'use strict';


function VideoChatViewer(viewManager, serverIn, serverOut, player, videoStreamStore, smallViewer) {
    const self           = this;
    const messageTimeout = Config.videoChatTimeOut;
    
    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_F4]   = close;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => div;


    const div                = GuiTools.createOverlay(null, CLR_Glossy);
    const panel              = GuiTools.createTabletDiv(div);
    panel.style.width        = '90%';
    panel.style.textAlign    = 'left';

    const messageField       = createHeader(panel);
    
    const local              = createLocal(panel);
    let localName            = "me";

    const remotes            = []
    remotes[0]               = createRemote(0, panel);
    remotes[1]               = createRemote(1, panel);
    remotes[2]               = createRemote(2, panel);

    GuiTools.createLineBreak(panel);
    const nameList           = GuiTools.createList(panel, '5', null, callRemote);


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // init
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    this.enable = function() {
        localName      = player.getName();
        let remoteName = player.getTargetPlayerName();

        serverOut.requestListActors();
        if(remoteName) videoStreamStore.startLocal(() => callRemote(remoteName));
        else           videoStreamStore.startLocal();

        serverIn.receiveVideoChatObserver.add(handleVideoChatMessage);
        serverIn.receiveActorListObserver.add(handleActorList);
        serverIn.actorJoinedObserver.add(handleActorJoined);
        serverIn.actorLeftObserver.add(handleActorLeft);
        videoStreamStore.streamsChangedObserver.add(updateView);
        updateView();
    }


    this.disable = function() {
        videoStreamStore.streamsChangedObserver.remove(updateView);
        serverIn.receiveVideoChatObserver.remove(handleVideoChatMessage);
        serverIn.receiveActorListObserver.remove(handleActorList);
        serverIn.actorJoinedObserver.remove(handleActorJoined);
        serverIn.actorLeftObserver.remove(handleActorLeft);
    }


    function close()  {
        viewManager.unshow(self);
        if(videoStreamStore.countRemotes() == 0) {
            videoStreamStore.stopLocal();
        }
        else {
            viewManager.show(smallViewer);
        }
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
        local.button                   = GuiTools.createButtonSmall(local.div, "start cam", startLocal);
        local.name.style.marginTop     = '0px';
        local.name.style.width         = "200px";
        local.button.style.marginTop   = '0px';
        return local;
    }


    function createRemote(index, panel) {
        const remote                   = {};

        remote.hangupTimer             = null;
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
        remote.button.id               = index;
        remote.id                      = index;
        
        return remote;            
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // actions
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    function startLocal() {
        messageField.clearMessage();
        videoStreamStore.startLocal();
    }

    
    function stopLocal() {
        messageField.clearMessage();
        videoStreamStore.stopLocal();
    }

    
    function callAction(event) {
        const id         = event.target.id;
        const remote     = remotes[id];
        const remoteName = remote.name.getText();

        if( remoteName == "" ) {
            messageField.setMessage("enter name of peer", messageTimeout);
        }
        else if( remoteName == localName ) {
            messageField.setMessage("you better take a mirror if you want to talk to yourself!", messageTimeout);
        }
        else {
            videoStreamStore.openRemote(remoteName);
        }
    }


    function answerAction(event) {
        const button    = event.target;
        const id        = button.id;
        const remote    = remotes[id];
        videoStreamStore.answerRemote(remote.name.getText());
    }


    function hangupAction(event, id) {
        if(event) id  = event.target.id;          // take id from triggering button
        const remote  = remotes[id];        
        const remoteName = remote.name.getText();
        videoStreamStore.closeRemote(remoteName);
    }


    function callRemote(remoteName) {
        if(remoteName == localName) return;
        videoStreamStore.openRemote(remoteName);
    }
    

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // message handling
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    

    function handleActorList(actors) {
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
    
    
    function handleVideoChatMessage(type, senderName, data) {
        Log.trace("VideoChatViewer: video chat message is of type " + type);     
        
        if( type == VMT_RequestChat) {
            messageField.setMessage(senderName + " wants to video chat with you", messageTimeout);    
        }
        else if( type == VMT_StopChat) {
            messageField.setMessage(data, messageTimeout);    
        }
    }


    function updateView() {
        const localStream = videoStreamStore.getLocalStream();
        if(localStream) {
            local.video.srcObject = localStream;
            local.name.setText(localName);
            local.button.set("stop cam", stopLocal);
            remotes.forEach(r => r.button.enable());
        }
        else {
            local.video.srcObject = null;
            local.button.set("start cam", startLocal);
            remotes.forEach(r => r.button.disable());
        }

        for(let i=0; i < 3; i++) {
            const remoteVideo = videoStreamStore.getRemote(i);
            if(!remoteVideo)
            {
                remotes[i].video.srcObject  = null;
                remotes[i].video.solid();
                remotes[i].name.readOnly    = false;
                remotes[i].name.setText("");
                remotes[i].button.set("call", callAction);
                remotes[i].button.enable();                    
            }
            else if(remoteVideo.isIdle()) {               // call from remote
                remotes[i].video.srcObject  = null;
                remotes[i].video.attention();
                remotes[i].name.setText(remoteVideo.getId());
                remotes[i].name.readOnly    = true;
                remotes[i].button.set("answer", answerAction);
                remotes[i].button.enable();                                    
            }
            else if(remoteVideo.isOpen()) {               // call to remote
                remotes[i].video.srcObject  = null;
                remotes[i].video.attention();
                remotes[i].name.setText(remoteVideo.getId());
                remotes[i].name.readOnly    = true;
                remotes[i].button.set("stop call", hangupAction);
                remotes[i].button.enable();                                    
            }
            else if(remoteVideo.isConnected()) {          // chat with remote
                remotes[i].video.srcObject  = remoteVideo.getStream();
                remotes[i].name.setText(remoteVideo.getId());
                remotes[i].name.readOnly    = true;
                remotes[i].button.set("hang up", hangupAction);
                remotes[i].button.enable();                                    
            }
            else {
                Log.error("unknown state of remote stream");
            }
        }
    }

}
