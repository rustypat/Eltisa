'use strict';

const eltisa = new function() {

    const body                   = document.getElementsByTagName("body")[0];

    const viewport               = new Viewport(body);
    const carousel               = new Carousel(body);
    const statusbar              = new Statusbar(body);
    const chat                   = new Chat(body);

    const actorStore             = new ActorStore(viewport);
    const chunkStore             = new ChunkStore(viewport);
    const player                 = new Player(viewport, chunkStore);
    const server                 = new Server(document.location, "/ws");

    const loginBlocker           = new LoginBlocker(body, activateGame, deactivateGame, server);
    const introBlocker           = new IntroBlocker(body, activateGame, deactivateGame, server);
    const errorBlocker           = new ErrorBlocker(body, activateGame, deactivateGame);
    const bossBlocker            = new BossBlocker(body, activateGame, deactivateGame);
    const scriptureBlocker       = new ScriptureBlocker(body, activateGame, deactivateGame, server);
    const tresorBlocker          = new TresorBlocker(body, activateGame, deactivateGame, server);
    const portalBlocker          = new PortalBlocker(body, activateGame, deactivateGame, server, player);
    const videoChatBlocker       = new VideoChatBlocker(body, activateGame, deactivateGame, server);
    const tetrisBlocker          = new TetrisBlocker(body, activateGame, deactivateGame);
    const blockBlocker           = new BlockBlocker(body, activateGame, deactivateGame, carousel);
    const bookmarkBlocker        = new BookmarkBlocker(body, activateGame, deactivateGame);
    const oracleBlocker          = new OracleBlocker(body, activateGame, deactivateGame, server);
    const bookBlocker            = new BookBlocker(body, activateGame, deactivateGame, server, player);
    const cameraBlocker          = new CameraBlocker(body, activateGame, deactivateGame, server);

    const oracleShower           = new OracleShower(chunkStore, statusbar, server);
    const portalShower           = new PortalShower(chunkStore, statusbar, server);

    const switchWaitWatch        = new WaitWatch(0.5);
    const changeWaitWatch        = new WaitWatch(0.5);
    const radiusWaitWatch        = new WaitWatch(2);

    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // events
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    window.addEventListener("beforeunload", function (event) {
        chunkStore.dispose();
        viewport.dispose();
    });


    window.addEventListener("resize", function () {
        viewport.resize();
    });


    document.addEventListener( 'pointerlockchange', function ( event ) {
        if( !viewport.hasPointerLock() ) {
            if( !hasVisibleBlocker() ) {
                deactivateGame();
                introBlocker.show(player);
            }
        }
    });


    document.addEventListener( 'keydown', function(event) {
        const keyCode = KeyCode.getFromEvent(event);

        if( keyCode == KeyCode.END ) {
            event.preventDefault();
            if( bossBlocker.isVisible() ) {
                bossBlocker.hide();
                if( !hasVisibleBlocker() ) {
                    viewport.lockPointer();
                }            
            }
            else {
                bossBlocker.show();
                document.exitPointerLock();        
            }
            return false;        
        }
        else {
            return true;
        }

    });   



    function mouseMoveHandler(event) {
        const targetPoint    = player.getTargetPoint()
        if( !targetPoint ) return true;
        const inDirection    = player.getDirection().scale(+0.01);
        const inTargetPos    = targetPoint.add(inDirection);
        const targetPos      = Vector.roundToFloor(inTargetPos);

        oracleShower.handleBlockFocus(targetPos);
        portalShower.handleBlockFocus(targetPos);
        return true;
    }


    function mouseLeftClickHandler(event) {
        if( event.button != 0 ) return true;
        if( player.targetIsActor() ) return false;

        const blockDefinition = carousel.getSelectedBlock();
        var   targetPos       = player.getTargetPoint();

        if( targetPos == null && BlockData.isFlightStone(blockDefinition) ) {
            const addDirection = player.getDirection().scale(10);
            const addTargetPos = player.getPosition().add(addDirection);
            const addPos       = Vector.roundToFloor(addTargetPos);
            if( Policy.canModifyBlock(player, addPos) ) {
                Behavior.addBlock(server, chunkStore, actorStore, player, addPos, null, blockDefinition);
            }
            return false;
        }
        else if( !targetPos ) {
            return false;
        }
        else if( !Policy.canModifyBlock(player, targetPos) ) {
            chat.addMessage("system", "sorry, you are not allowed to add blocks here");
            return false;
        }
        else if( targetPos ) {
            const inDirection    = player.getDirection().scale(+0.01);
            const inTargetPos    = targetPos.add(inDirection);
            const attachPos      = Vector.roundToFloor(inTargetPos);
    
            const outDirection   = player.getDirection().scale(-0.01);
            const outTargetPos   = targetPos.add(outDirection);
            const addPos         = Vector.roundToFloor(outTargetPos);
            Behavior.addBlock(server, chunkStore, actorStore, player, addPos, attachPos, blockDefinition);
            return false;
        }
        else{
            return false;
        }
    }
        

    function mouseRightClickHandler(event) {
        if( event.button != 2 ) return true;
        event.preventDefault(); 
        const targetPos      = player.getTargetPoint();
        if( targetPos == null)  return false;
        if( player.targetIsActor() ) return false;
        if( !Policy.canModifyBlock(player, targetPos) ) {
            chat.addMessage("system", "sorry, you are not allowed to remove blocks here");
            return false;
        }
        const inDirection    = player.getDirection().scale(+0.01);
        const inTargetPos    = targetPos.add(inDirection);
        const removePos      = Vector.roundToFloor(inTargetPos);
        Behavior.removeBlock(server, chunkStore, removePos);
        return false;
    }
        

    function contextMenuHandler(event) {
        event.preventDefault(); 
        console.log("right button pressed: " + event.button)
        return false;
    }
        

    function wheelClickHandler(event) {
        if( event.button != 1 ) return true;
        event.preventDefault();
        blockBlocker.show();
        return false;
    }
        

    function keypressHandler(event) {
        if (event.key.length == 1) {
            chat.addText(event.key);
        }    
    }


    function keydownHandler(event) {
        const keyCode = KeyCode.getFromEvent(event);

        if( keyCode == KeyCode.BACKSPACE || keyCode == KeyCode.DELET ) {
            event.preventDefault();
            chat.deleteLast();
            return false;
        }

        else if( keyCode == KeyCode.PAGEUP ) {
            if( event.shiftKey ) carousel.moveRight();
            else                 carousel.moveUp();
            return false;
        }
        
        else if( keyCode == KeyCode.PAGEDOWN ) {
            if( event.shiftKey ) carousel.moveLeft();
            else                 carousel.moveDown();
            return false;
        }

        else if( keyCode == KeyCode.CONTROL ) {
            player.jump();
            return true;        
        }

        else if( keyCode == KeyCode.RETURN ) {
            var text = chat.getText();
            if( text == "") return true;
            if( player.targetIsActor() && !text.indexOf("@") > -1 ) {
                text = "@" + player.getTargetInfo() + " " + text;   // dedicate message to player pointed at
            }
            server.requestChat(text, peerName);
            return false;
        }

        else if( keyCode == KeyCode.F1 ) {
            event.preventDefault();
            player.toogleMoveMode();
            return false;        
        }

        else if( keyCode == KeyCode.F2 ) {
            event.preventDefault();
            blockBlocker.show();
            return false;
        }

        else if( keyCode == KeyCode.F3 ) {
            event.preventDefault();
            const targetPos      = player.getTargetPoint();
            if( targetPos == null ) return true;
            if( !Policy.canModifyBlock(player, targetPos) ) {
                chat.addMessage("system", "sorry, you are not allowed to alter a block state here");
                return false;
            }
            if( !changeWaitWatch.hasWaitedEnough() ) return false;
            const direction      = player.getDirection().scale(+0.01);
            const inTargetPos    = targetPos.add(direction);
            const blockPos       = Vector.roundToFloor(inTargetPos);

            var            handled = portalBlocker.show(chunkStore, blockPos);
            if( !handled ) handled = oracleBlocker.show(chunkStore, blockPos);
            if( !handled ) handled = cameraBlocker.show(chunkStore, blockPos);
            if( !handled ) handled = Behavior.changeState(server, chunkStore, blockPos);
            if( handled ) return false;
        }

        else if( keyCode == KeyCode.F4 ) {
            event.preventDefault();
            var peerName;
            if(player.targetIsActor()) peerName = player.getTargetInfo();
            statusbar.clearMessage();
            videoChatBlocker.show(player.getName(), peerName);
            return false;
        }

        else if( keyCode == KeyCode.F5 ) {
            event.preventDefault();
            if(!radiusWaitWatch.hasWaitedEnough()) return false;
            Config.toggleEnvironmentRadius();
            chunkStore.updateEnvironmentRadius();
            return false;
        }

        else if( keyCode == KeyCode.F6 ) {
            event.preventDefault();
            bookmarkBlocker.show(player);
            return false;
        }

        else if( keyCode == KeyCode.F7 ) {
            event.preventDefault();
            System.info();
            Config.info();
            chunkStore.info();
            actorStore.info();
            return false;
        }

        else if( keyCode == KeyCode.SPACE ) {
            event.preventDefault();
            const targetPos      = player.getTargetPoint();
            if( targetPos == null ) {
                chat.addText(" ");
                return false;
            }
            if( !switchWaitWatch.hasWaitedEnough() ) return false;
            const direction      = player.getDirection().scale(+0.01);
            const inTargetPos    = targetPos.add(direction);
            const blockPos       = Vector.roundToFloor(inTargetPos);
           
            var            handled = Behavior.switchState(server, chunkStore, blockPos);
            if( !handled ) handled = scriptureBlocker.show(chunkStore, blockPos);
            if( !handled ) handled = bookBlocker.show(chunkStore, blockPos);
            if( !handled ) handled = tetrisBlocker.show(chunkStore, blockPos);
            if( !handled ) handled = tresorBlocker.show(chunkStore, blockPos);
            if( !handled ) handled = portalBlocker.requestTeleportation(chunkStore, blockPos);
            if( !handled ) handled = chat.addText(" ");
            if( handled ) return false;
        }

        return true;
    }


    function wheelTurnHandler(event) {
        if(event.deltaY > 0) {    
            if(event.shiftKey) carousel.moveLeft();
            else               carousel.moveDown();
        }
        if(event.deltaY < 0) {
            if(event.shiftKey) carousel.moveRight();
            else               carousel.moveUp();
        }
        return true;
    }


    function activateGame() {
        document.addEventListener("contextmenu", contextMenuHandler);
        document.addEventListener("keydown",     keydownHandler);
        document.addEventListener("keypress",    keypressHandler);
        document.addEventListener("mousemove",   mouseMoveHandler);

        if(isFirefox) document.addEventListener("auxclick", mouseRightClickHandler);  
        else document.addEventListener("click",    mouseRightClickHandler);  

        document.addEventListener("click",       mouseLeftClickHandler); 
        document.addEventListener("auxclick",    wheelClickHandler); 
        document.addEventListener("wheel",       wheelTurnHandler);

        viewport.startRenderLoop(renderFunction);    
        player.activateControls();
        viewport.lockPointer();
    }


    function deactivateGame() {
        document.exitPointerLock();
        player.deactivateControls();

        document.removeEventListener("contextmenu", contextMenuHandler);
        document.removeEventListener("keydown",  keydownHandler);
        document.removeEventListener("keypress", keypressHandler);
        document.removeEventListener("mousemove", mouseMoveHandler);
        
        if(isFirefox) document.removeEventListener("auxclick", mouseRightClickHandler); 
        else document.removeEventListener("click", mouseRightClickHandler); 
        
        document.removeEventListener("click",    mouseLeftClickHandler); 
        document.removeEventListener("auxclick", wheelClickHandler); 
        document.removeEventListener("wheel",    wheelTurnHandler);
    }


    function hasVisibleBlocker() {
        if( loginBlocker.isVisible() ) return true;    
        if( bossBlocker.isVisible() ) return true;
        if( introBlocker.isVisible() ) return true;
        if( errorBlocker.isVisible() ) return true;
        if( scriptureBlocker.isVisible() ) return true;
        if( tresorBlocker.isVisible() ) return true;    
        if( bookBlocker.isVisible() ) return true;    
        if( cameraBlocker.isVisible() ) return true;    
        if( portalBlocker.isVisible() ) return true;    
        if( videoChatBlocker.isVisible() ) return true;    
        if( tetrisBlocker.isVisible() ) return true;    
        if( blockBlocker.isVisible() ) return true;    
        if( bookmarkBlocker.isVisible() ) return true;    
        if( oracleBlocker.isVisible() ) return true;    
        return false;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // server message handler
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    server.receiveLoginHandler = function(loginMessage) {
        if(loginMessage.actorId > 0) {
            player.setId(loginMessage.actorId);
            player.setType(loginMessage.actorType);
            player.setName(loginMessage.actorName);
            sessionStorage.setItem('name', loginMessage.actorName);        
            introBlocker.show(player);        
        }
        else {
            Log.error("login failed, try again");
            server.close();
            loginBlocker.show(player);
        }
    }


    server.receiveActorChangedHandler = function(message) {
        if(message.id == player.getId()) {
            Log.error("got my own change notification of type " + message.change);
            return;
        }
                    
        if(message.change == ActorChangeType.Login) {
            statusbar.setInfoMessage( message.name + " joined");        
            introBlocker.handleActorChangedMessage(message);
            videoChatBlocker.handleActorChangedMessage(message);
        }
        else if(message.change == ActorChangeType.Logout) {
            statusbar.setInfoMessage( message.name + " left");        
            introBlocker.handleActorChangedMessage(message);
            videoChatBlocker.handleActorChangedMessage(message);
            actorStore.handleActorMessage(message);
        }
        else if(message.change == ActorChangeType.Moved) {
            actorStore.handleActorMessage(message);
        }
    }


    server.receiveActorListHandler = function(message) {
        introBlocker.handleActorListMessage(message);
        videoChatBlocker.handleActorListMessage(message);
    }


    server.receiveChunksHandler = function(chunksMessage) {
        chunkStore.handleChunkMessage(chunksMessage);
    }


    server.receiveChatHandler = function(chatMessage) {
        chat.addMessage(chatMessage.sender, chatMessage.message);
    }


    server.receiveBlockChangedHandler = function(blockMessage) {
        chunkStore.changeBlock(blockMessage);
    }


    server.updateBlock = function(x, y, z, blockData) {
        return chunkStore.updateBlock(x, y, z, blockData);
    }


    server.updateChunk = function(chunk) {
        return chunkStore.updateChunk(chunk);
    }


    server.receiveBlockResourceHandler = function(message) {
        if( BlockData.isScripture(message.type) ) {
            scriptureBlocker.handleBlockResourceMessage(message);
        }
        else if( BlockData.isBook(message.type) ) {
            bookBlocker.handleBlockResourceMessage(message);
        }
        else if( BlockData.isTresor(message.type) ) {
            tresorBlocker.handleBlockResourceMessage(message);
        }
        else if( BlockData.isPortal(message.type) ) {
            portalBlocker.handleBlockResourceMessage(message, player);
            portalShower.handleBlockResourceMessage(message);
        }
        else if( BlockData.isOracle(message.type) ) {
            if(oracleBlocker.isVisible() )   oracleBlocker.handleBlockResourceMessage(message, statusbar);
            else                             oracleShower.handleBlockResourceMessage(message);
        }
        else if( BlockData.isCamera(message.type) ) {
            cameraBlocker.handleBlockResourceMessage(message);
        }
    }


    server.receiveVideoChatHandler = function(message) {
        if(message.type==VideoMessageType.RequestChat && !videoChatBlocker.isVisible() ) {
            statusbar.setInfoMessage( message.sender + " wants to video chat, press F4 to accept", Config.videoChatTimeOut);
        }

        if(message.type==VideoMessageType.StopChat ) {
            statusbar.clearMessage();
        }

        videoChatBlocker.handleVideoChatMessage(message);
    }


    server.connectionLostHandler = function(message) {
        document.exitPointerLock();
        player.deactivateControls();    
        errorBlocker.show(ErrorType.ConnectionLost);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // render function
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    var updateCounter = 0;
    var breakTime     = Number.MAX_SAFE_INTEGER;

    function renderFunction() {
        if( player.getId() == 0 ) {
            Log.warning("got no id from server, waiting for id");
            return;
        }

        carousel.animate();
        player.update();
        
        chunkStore.timeOutRequest();
        chunkStore.sendRequest(server);
        chunkStore.updateNewChunks(breakTime);

        chunkStore.updateCenterPosition(player.getPosition());
        chunkStore.updateChunks(breakTime);
        
        actorStore.updateCenterPosition(player.getPosition());
        actorStore.updateActors(breakTime);

        updateCounter++;
        if( updateCounter % 16 == 1 ) {
            player.sendMove(server);
        }    
        else if( updateCounter % 16 == 2 ) {
            statusbar.setStatus(player, viewport);
            statusbar.update();
        }
        
        viewport.updatePositionAndDirection(player.getPosition(), player.getRotation());
        viewport.updateScene();
        
        breakTime = performance.now() + (1000/60);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // start up
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    this.start = function() {
        if( !sessionStorage.hasOwnProperty('name') || !sessionStorage.hasOwnProperty('password') ) {
            // window.location.href='/' + window.location.search;
            loginBlocker.show(player);
        }
        else {
            const playerName             = sessionStorage.getItem('name');
            const playerPassword         = sessionStorage.getItem('password');
            player.setCredentials(playerName, playerPassword);
        
            const urlParams              = new URLSearchParams(window.location.search);
            const playerPosX             = urlParams.get('x')
            const playerPosY             = urlParams.get('y');
            const playerPosZ             = urlParams.get('z');    
            player.setPosition(playerPosX, playerPosY, playerPosZ);    
            
            server.connect();
            server.requestLogin(playerName, playerPassword);
        }
    }
}

eltisa.start();