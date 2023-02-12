'use strict';


function WorldViewer(viewManager, serverIn, serverOut, player, chunkStore, worldport, carousel, blockSelector, helpViewer) {

    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_F1]      = toggleMoveMode;
    eventHandlers[EV_Keyboard_F2]      = showBlockSelector;
    eventHandlers[EV_Keyboard_F3]      = editBlock;
    eventHandlers[EV_Keyboard_F5]      = toggleEnvironmentRadius;
    eventHandlers[EV_Keyboard_Escape]  = showHelp;
    eventHandlers[EV_Window_Resize]    = resizeWindow;
    eventHandlers[EV_Mouse_Left]       = addBlock;
    eventHandlers[EV_Mouse_Right]      = removeBlock;
    eventHandlers[EV_Keyboard_Control] = jump;
    eventHandlers[EV_Keyboard_Space]   = switchBlock;
    eventHandlers[EV_Mouse_Move]       = showStatusBarInfo;

    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement = () => worldport.getCanvas();

    const radiusWaitWatch        = new WaitWatch(2);
    const switchWaitWatch        = new WaitWatch(0.5);
    const changeWaitWatch        = new WaitWatch(0.5);

    const cameraEditor           = new CameraEditor(viewManager, serverIn, serverOut, player);
    const cameraViewer           = new CameraViewer(viewManager, serverIn, serverOut, player);
    const internetEditor         = new InternetEditor(viewManager, serverIn, serverOut, player);
    const internetViewer         = new InternetViewer(viewManager, serverIn, serverOut, player);
    const scriptureEditor        = new ScriptureEditor(viewManager, serverIn, serverOut, player);
    const scriptureViewer        = new ScriptureViewer(viewManager, serverIn, serverOut, player);
    const bookEditor             = new BookEditor(viewManager, serverIn, serverOut, player);
    const portalEditor           = new PortalEditor(viewManager, serverIn, serverOut, player);
    const oracleEditor           = new OracleEditor(viewManager, serverIn, serverOut, player);
    const tetrisViewer           = new TetrisViewer(viewManager);

    this.enable = function() {
        player.activateControls();
        worldport.lockPointer();
        worldport.resize();
        serverIn.receiveResourceHandler = receiveResource;
    }
    
    
    this.disable = function() {
        serverIn.receiveResourceHandler = null;
        document.exitPointerLock();
        player.deactivateControls();
    }
    

    function resizeWindow() {
        worldport.resize();
    }


    function addBlock() {
        if(!worldport.hasPointerLock()) {
            worldport.lockPointer();
            return;
        }

        if( player.targetIsActor() ) return false;

        const blockDefinition = carousel.getSelectedBlock();
        var   targetPos       = player.getTargetPoint();

        if( targetPos == null && BlockData.isFlightStone(blockDefinition) ) {
            const addDirection = player.getDirection().scale(10);
            const addTargetPos = player.getPosition().add(addDirection);
            const addPos       = Vector.roundToFloor(addTargetPos);
            if( !Policy.canModifyBlock(player, addPos) ) return;
            Behavior.addBlock(serverOut, chunkStore, actorStore, player, addPos, null, blockDefinition);
        }
        else if( !targetPos ) return;
        else if( !Policy.canModifyBlock(player, targetPos) ) return;
        else if( targetPos ) {
            const inDirection    = player.getDirection().scale(+0.01);
            const inTargetPos    = targetPos.add(inDirection);
            const attachPos      = Vector.roundToFloor(inTargetPos);
    
            const outDirection   = player.getDirection().scale(-0.01);
            const outTargetPos   = targetPos.add(outDirection);
            const addPos         = Vector.roundToFloor(outTargetPos);
            Behavior.addBlock(serverOut, chunkStore, actorStore, player, addPos, attachPos, blockDefinition);
        }
    }


    function removeBlock() {
        if( player.targetIsActor() ) return;
        const removePos      = player.getTargetPos();
        if( removePos == null)  return;
        if( !Policy.canModifyBlock(player, removePos) ) return;
        Behavior.removeBlock(serverOut, chunkStore, removePos);
    }


    function jump() {
        player.jump();
    }


    function toggleMoveMode() {
        player.toogleMoveMode();
    }


    function toggleEnvironmentRadius() {
        if(radiusWaitWatch.hasWaitedEnough()) {
            Config.toggleEnvironmentRadius();
            chunkStore.updateEnvironmentRadius();
        }
    }


    function showBlockSelector() {
        viewManager.showModal(blockSelector);
    }


    function showHelp() {
        viewManager.showModal(helpViewer);
    }


    function editBlock() {
        const targetPos      = player.getTargetPos();
        if( targetPos == null ) return;
        if( !changeWaitWatch.hasWaitedEnough() ) return;
        if( !Policy.canModifyBlock(player, targetPos) ) return;
        const blockData      = chunkStore.getBlockData(targetPos);
       
        if( BlockData.isCamera(blockData) )         viewManager.showModal(cameraEditor);
        else if( BlockData.isInternet(blockData) )  viewManager.showModal(internetEditor);
        else if( BlockData.isScripture(blockData) ) viewManager.showModal(scriptureEditor);
        else if( BlockData.isPortal(blockData) )    viewManager.showModal(portalEditor);
        else if( BlockData.isOracle(blockData) )    viewManager.showModal(oracleEditor);
    }


    function switchBlock() {
        const targetPos      = player.getTargetPos();
        if( targetPos == null ) return;
        if( !switchWaitWatch.hasWaitedEnough() ) return;
        const blockData      = chunkStore.getBlockData(targetPos);
       
        if( Behavior.switchState(serverOut, chunkStore, targetPos) ) return;
        else if( BlockData.isCamera(blockData) )    viewManager.showModal(cameraViewer);
        else if( BlockData.isInternet(blockData) )  viewManager.showModal(internetViewer);
        else if( BlockData.isScripture(blockData) ) viewManager.showModal(scriptureViewer);
        else if( BlockData.isBook(blockData) )      viewManager.showModal(bookEditor);
        else if( BlockData.isTetris(blockData) )    viewManager.showModal(tetrisViewer);
        else if( BlockData.isPortal(blockData))     serverOut.requestReadResource(targetPos, Block.Portal, ""); 

        // if( !handled ) handled = tresorBlocker.show(chunkStore, blockPos);
        // if( !handled ) handled = chat.addText(" ");
    }


    function receiveResource(messageType, blockType, resourceResponse, text) {
        if( resourceResponse == SR_Ok && blockType==Block.Portal && messageType == SM_ReadResourceResponse) {
            const targetPos = JSON.parse(text);
            player.setPosition(targetPos.x, targetPos.y, targetPos.z);
        }
        else if( resourceResponse == SR_Ok && blockType==Block.Oracle && messageType == SM_ReadResourceResponse) {
            statusbar.setBlockInfo(text, Block.Oracle);
        }
    }


    let lastTargetPos;

    function showStatusBarInfo() {
        const targetPos  = player.getTargetPos()
        if( Vector.equals(targetPos, lastTargetPos)) return;
        lastTargetPos = targetPos;
        const blockData  = chunkStore.getBlockData(targetPos);     
        
        if( BlockData.isOracleUsed(blockData) ) {
            serverOut.requestReadResource(targetPos, Block.Oracle, ""); 
        }
        else { // clear message if focus leaves block
            statusbar.clearBlockInfo();
        }
        statusbar.updateInfo();
    }

}