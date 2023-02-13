'use strict';

/*
const eltisa = new function() {

    const body                   = document.getElementsByTagName("body")[0];

    const worldport              = new WorldPort(body);
    const crosshair              = new CrosshairViewer(body);
    const carousel               = new Carousel(body);
    const statusbar              = new Statusbar(body);
    const chat                   = new Chat(body);

    const actorStore             = new ActorStore(worldport);
    const chunkStore             = new ChunkStore(worldport);
    const player                 = new Player(worldport, chunkStore);
    const serverSocket           = new ServerSocket(document.location, "/ws");
    const serverIn               = new ServerIn(serverSocket);
    const serverOut              = new ServerOut(serverSocket);

    const loginBlocker           = new LoginBlocker(body, activateGame, deactivateGame, serverSocket, serverOut);
    const introBlocker           = new HelpViewer(body, activateGame, deactivateGame, serverOut);
    const errorBlocker           = new ErrorBlocker(body, activateGame, deactivateGame);
    const scriptureEditor        = new ScriptureEditor(body, activateGame, deactivateGame, serverOut);
    const scriptureViewer        = new ScriptureViewer(body, activateGame, deactivateGame, serverOut);
    const tresorBlocker          = new TresorBlocker(body, activateGame, deactivateGame, serverOut);
    const portalBlocker          = new PortalBlocker(body, activateGame, deactivateGame, serverOut, player);
    const videoChatBlocker       = new VideoChatBlocker(body, activateGame, deactivateGame, serverOut);
    const tetrisBlocker          = new TetrisBlocker(body, activateGame, deactivateGame);
    const blockBlocker           = new BlockSelector(body, activateGame, deactivateGame, carousel);
    const bookmarkBlocker        = new BookmarkBlocker(body, activateGame, deactivateGame);
    const oracleBlocker          = new OracleBlocker(body, activateGame, deactivateGame, serverOut);
    const bookBlocker            = new BookBlocker(body, activateGame, deactivateGame, serverOut, player);
    const cameraEditor           = new CameraEditor(body, activateGame, deactivateGame, serverOut);
    const cameraViewer           = new CameraViewer(body, activateGame, deactivateGame, serverOut);
    const internetEditor         = new InternetEditor(body, activateGame, deactivateGame, serverOut);
    const internetViewer         = new InternetViewer(body, activateGame, deactivateGame, serverOut);

    const oracleShower           = new OracleShower(chunkStore, statusbar, serverOut);
    const portalShower           = new PortalShower(chunkStore, statusbar, serverOut);

    const switchWaitWatch        = new WaitWatch(0.5);
    const changeWaitWatch        = new WaitWatch(0.5);
    const radiusWaitWatch        = new WaitWatch(2);

    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // events
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    window.addEventListener("beforeunload", function (event) {
        chunkStore.dispose();
        worldport.dispose();
    });


    window.addEventListener("resize", function () {
        worldport.resize();
    });


    document.addEventListener( 'pointerlockchange', function ( event ) {
        if( !worldport.hasPointerLock() ) {
            if( !hasVisibleBlocker() ) {
                deactivateGame();
                introBlocker.show(player);
            }
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
        let   targetPos       = player.getTargetPoint();

        if( targetPos == null && BlockData.isFlightStone(blockDefinition) ) {
            const addDirection = player.getDirection().scale(10);
            const addTargetPos = player.getPosition().add(addDirection);
            const addPos       = Vector.roundToFloor(addTargetPos);
            if( Policy.canModifyBlock(player, addPos) ) {
                Behavior.addBlock(serverOut, chunkStore, actorStore, player, addPos, null, blockDefinition);
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
            Behavior.addBlock(serverOut, chunkStore, actorStore, player, addPos, attachPos, blockDefinition);
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
        Behavior.removeBlock(serverOut, chunkStore, removePos);
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

        if( keyCode == KeyCode.BACKSPACE || keyCode == KeyCode.DELETE ) {
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
            let text = chat.getText();
            if( text == "") return true;
            if( player.targetIsActor() && !text.indexOf("@") > -1 ) {
                text = "@" + player.getTargetInfo() + " " + text;   // dedicate message to player pointed at
            }
            serverOut.requestChat(text, peerName);
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

            let            handled = portalBlocker.show(chunkStore, blockPos);
            if( !handled ) handled = oracleBlocker.show(chunkStore, blockPos);
            if( !handled ) handled = scriptureEditor.show(chunkStore, blockPos);
            if( !handled ) handled = cameraEditor.show(chunkStore, blockPos);
            if( !handled ) handled = internetEditor.show(chunkStore, blockPos);
            if( !handled ) handled = Behavior.changeState(serverOut, chunkStore, blockPos);
            if( handled ) return false;
        }

        else if( keyCode == KeyCode.F4 ) {
            event.preventDefault();
            let peerName;
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
           
            let            handled = Behavior.switchState(serverOut, chunkStore, blockPos);
            if( !handled ) handled = scriptureViewer.show(chunkStore, blockPos);
            if( !handled ) handled = bookBlocker.show(chunkStore, blockPos);
            if( !handled ) handled = tetrisBlocker.show(chunkStore, blockPos);
            if( !handled ) handled = tresorBlocker.show(chunkStore, blockPos);
            if( !handled ) handled = cameraViewer.show(chunkStore, blockPos);
            if( !handled ) handled = internetViewer.show(chunkStore, blockPos);
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

        worldport.startRenderLoop(renderFunction);    
        player.activateControls();
        worldport.lockPointer();
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
        if( introBlocker.isVisible() ) return true;
        if( errorBlocker.isVisible() ) return true;
        if( scriptureEditor.isVisible() ) return true;
        if( scriptureViewer.isVisible() ) return true;
        if( tresorBlocker.isVisible() ) return true;    
        if( bookBlocker.isVisible() ) return true;    
        if( cameraEditor.isVisible() ) return true;    
        if( cameraViewer.isVisible() ) return true;    
        if( portalBlocker.isVisible() ) return true;    
        if( videoChatBlocker.isVisible() ) return true;    
        if( tetrisBlocker.isVisible() ) return true;    
        if( blockBlocker.isVisible() ) return true;    
        if( bookmarkBlocker.isVisible() ) return true;    
        if( oracleBlocker.isVisible() ) return true;    
        if( internetEditor.isVisible() ) return true;    
        if( internetViewer.isVisible() ) return true;    
        return false;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // server message handler
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    serverIn.receiveLoginHandler = function(response, actorId, actorType, actorName, actorColor) {
        if(response == 0) {
            player.setId(actorId);
            player.setType(actorType);
            player.setName(actorName);
            sessionStorage.setItem('name', actorName);        
            introBlocker.show(player);        
        }
        else {
            Log.error("login failed, try again");
            serverSocket.close();
            loginBlocker.show(player);
        }
    }


    serverIn.receiveActorChangedHandler = function(message) {
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


    serverIn.receiveActorListHandler = function(message) {
        introBlocker.handleActorListMessage(message);
        videoChatBlocker.handleActorListMessage(message);
    }


    serverIn.receiveChunksHandler = function(chunksMessage) {
        chunkStore.handleChunkMessage(chunksMessage);
    }


    serverIn.receiveChatHandler = function(chatMessage) {
        chat.addMessage(chatMessage.sender, chatMessage.message);
    }


    serverIn.updateBlock = function(x, y, z, blockData) {
        return chunkStore.updateBlock(x, y, z, blockData);
    }


    serverIn.updateChunk = function(chunk) {
        return chunkStore.updateChunk(chunk);
    }


    serverIn.receiveResourceHandler = function(messageType, blockType, resourceResponse, text) {
        if( blockType == Block.Scripture) {
            if( resourceResponse == SR_Ok) {
                scriptureEditor.updateText(text);
                scriptureViewer.updateText(text);
            }
        }
        else if( blockType == Block.Tresor ) {
            tresorBlocker.update(messageType, resourceResponse, text);
        }
        else if( blockType == Block.Portal ) {
            if( resourceResponse == SR_Ok) {
                portalBlocker.updateOrJump(text, player);
                portalShower.updateStatusbar(text);
            }
        }
        else if( blockType == Block.Camera ) {
            if( resourceResponse == SR_Ok && messageType == SM_ReadResourceResponse) {
                cameraEditor.updatePicture(text);
                cameraViewer.updatePicture(text);
            }
        }
        else if( blockType == Block.Internet ) {
            if( resourceResponse == SR_Ok && messageType == SM_ReadResourceResponse) {
                internetEditor.updateUrl(text);
                internetViewer.updateUrl(text);
            }
        }
        else if( blockType == Block.Book ) {
            if( resourceResponse == SR_Ok) {
                bookBlocker.updateContent(text);
            }
        }
        else if( blockType == Block.Oracle) {
            if( resourceResponse == SR_Ok) {
                if(oracleBlocker.isVisible() )   oracleBlocker.updateOracle(text);
                else                             oracleShower.updateStatusbar(text);
            }
        }
    }


    serverIn.receiveVideoChatHandler = function(message) {
        if(message.type==VideoMessageType.RequestChat && !videoChatBlocker.isVisible() ) {
            statusbar.setInfoMessage( message.sender + " wants to video chat, press F4 to accept", Config.videoChatTimeOut);
        }

        if(message.type==VideoMessageType.StopChat ) {
            statusbar.clearMessage();
        }

        videoChatBlocker.handleVideoChatMessage(message);
    }


    serverSocket.connectionLostHandler = function(message) {
        document.exitPointerLock();
        player.deactivateControls();    
        errorBlocker.show(ErrorType.ConnectionLost);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // render function
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    let updateCounter = 0;
    let breakTime     = Number.MAX_SAFE_INTEGER;

    function renderFunction() {
        if( player.getId() == 0 ) {
            Log.warning("got no id from server, waiting for id");
            return;
        }

        carousel.animate();
        player.update();
        
        chunkStore.timeOutRequest();
        chunkStore.sendRequest(serverOut);
        chunkStore.updateNewChunks(breakTime);

        chunkStore.updateCenterPosition(player.getPosition());
        chunkStore.updateChunks(breakTime);
        
        actorStore.updateCenterPosition(player.getPosition());
        actorStore.updateActors(breakTime);

        updateCounter++;
        if( updateCounter % 16 == 1 ) {
            player.sendMove(serverOut);
        }    
        else if( updateCounter % 16 == 2 ) {
            statusbar.setStatus(player, worldport);
            statusbar.update();
        }
        
        worldport.updatePositionAndDirection(player.getPosition(), player.getRotation());
        worldport.updateScene();
        
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
            
            serverSocket.connect();
            serverOut.requestLogin(playerName, playerPassword);
        }
    }
}

eltisa.start();
*/


///////////////////////////////////////////////////////////////////////////////////////////////////
// new ViewManager prototype
///////////////////////////////////////////////////////////////////////////////////////////////////


const worldport              = new WorldPort();

const actorStore             = new ActorStore(worldport);
const chunkStore             = new ChunkStore(worldport);
const player                 = new Player(worldport, chunkStore);

const serverSocket           = new ServerSocket(document.location, "/ws");
const serverIn               = new ServerIn(serverSocket);
const serverOut              = new ServerOut(serverSocket);

const loginViewer            = new LoginViewer(serverSocket, serverOut, startGame);
const viewManager            = new ViewManager();

const crosshairViewer        = new CrosshairViewer();
const statusbar              = new Statusbar();
const carouselViewer         = new CarouselViewer();
const blockSelector          = new BlockSelector(viewManager, carouselViewer);
const helpViewer             = new HelpViewer(viewManager, serverOut, stopGame);
const worldViewer            = new WorldViewer(viewManager, serverIn, serverOut, player, chunkStore, worldport, carouselViewer, blockSelector, helpViewer, stopGame);




function startLogin() {
    serverIn.receiveLoginHandler = loginViewer.receiveLogin;
    viewManager.clear();
    viewManager.show(loginViewer);
}


function startGame(actorId, actorType, actorName, startLocation) {
    serverIn.receiveChunksHandler =  (chunksMessage) => chunkStore.handleChunkMessage(chunksMessage);
    serverIn.updateBlock          =  (x, y, z, blockData) => chunkStore.updateBlock(x, y, z, blockData);
    serverIn.updateChunk          =  (chunk) => chunkStore.updateChunk(chunk);

    player.init(actorId, actorType, actorName);
    const startingPoint = StartingPoints.getStartingPoint(startLocation, player);
    const startingPosition = Vector.randomize(startingPoint, Config.randomStartRange);
    player.setPosition(startingPosition.x, startingPosition.y, startingPosition.z);
    worldport.startRenderLoop(renderFunction);    
    viewManager.clear();
    viewManager.show(worldViewer)
    viewManager.show(crosshairViewer);
    viewManager.show(carouselViewer);
    viewManager.show(statusbar);
}



function stopGame() {
    worldport.stopRenderLoop();
    serverIn.receiveLoginHandler = loginViewer.receiveLogin;    
    viewManager.clear();
    viewManager.show(loginViewer);
    serverSocket.close();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// render function
///////////////////////////////////////////////////////////////////////////////////////////////////


let updateCounter = 0;
let breakTime     = Number.MAX_SAFE_INTEGER;

function renderFunction() {
    if( player.getId() == 0 ) {
        Log.warning("got no id from server, waiting for id");
        return;
    }

    carouselViewer.animate();
    player.update();
    
    chunkStore.timeOutRequest();
    chunkStore.sendRequest(serverOut);
    chunkStore.updateNewChunks(breakTime);

    chunkStore.updateCenterPosition(player.getPosition());
    chunkStore.updateChunks(breakTime);
    
    actorStore.updateCenterPosition(player.getPosition());
    actorStore.updateActors(breakTime);

    updateCounter++;
    if( updateCounter % 16 == 1 ) {
        player.sendMove(serverOut);
    }    
    else if( updateCounter % 16 == 2 ) {
        statusbar.setPlayerInfo(player, worldport);
        statusbar.updateInfo();
    }
    
    worldport.updatePositionAndDirection(player.getPosition(), player.getRotation());
    worldport.updateScene();
    
    breakTime = performance.now() + (1000/60);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// start application
///////////////////////////////////////////////////////////////////////////////////////////////////

startLogin();


///////////////////////////////////////////////////////////////////////////////////////////////////
// terminate application
///////////////////////////////////////////////////////////////////////////////////////////////////

window.addEventListener("beforeunload", function (event) {
    chunkStore.dispose();
    worldport.dispose();
});


