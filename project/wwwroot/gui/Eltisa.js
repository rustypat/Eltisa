'use strict';

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
const chatViewer             = new ChatViewer(serverIn, serverOut);
const carouselViewer         = new CarouselViewer();
const blockSelector          = new BlockSelector(viewManager, carouselViewer);
const helpViewer             = new HelpViewer(viewManager, serverOut, stopGame);
const worldViewer            = new WorldViewer(viewManager, serverIn, serverOut, player, chunkStore, worldport, statusbar, chatViewer, carouselViewer, blockSelector, helpViewer, stopGame);


function startLogin() {
    serverIn.receiveLoginHandler = loginViewer.receiveLogin;
    viewManager.clear();
    viewManager.show(loginViewer);
}


function startGame(actorId, actorType, actorName, startLocation) {
    serverIn.receiveChunksHandler =  (chunksMessage) => chunkStore.handleChunkMessage(chunksMessage);
    serverIn.updateBlock          =  (x, y, z, blockData) => chunkStore.updateBlock(x, y, z, blockData);
    serverIn.updateChunk          =  (chunk) => chunkStore.updateChunk(chunk);
    serverIn.receiveActorMovedHandler =  (id, x, y, z, orientation) => actorStore.handleActorMove(id, x,y ,z, orientation);
    serverIn.actorJoinedObserver.add(actorStore.handleActorJoined);
    serverIn.receiveActorListObserver.add(actorStore.handleActorList);
    serverIn.actorLeftObserver.add(actorStore.handleActorLeft);
    serverOut.requestListActors();

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
    viewManager.show(chatViewer);
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


