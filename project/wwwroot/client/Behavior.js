'use strict';

const Behavior = new function() {


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // actions
    ///////////////////////////////////////////////////////////////////////////////////////////////

    this.addBlock = function(server, chunkStore, actorStore, player, addPos, attachPos, blockData) {
        if( !chunkStore.isEmpty(addPos)    ) return false;
        if( actorStore.isOccupying(addPos) ) return false;  
        if( player.isOccupying(addPos)     ) return false;

        var attachDefinition;
        if(attachPos) {
            if( !chunkStore.isSolid(attachPos) ) return false;  // must not attach blocks to any kind of transparent block
            const attachFace = getAttachFace(addPos, attachPos);
            if( !attachFace )                    return false;
            attachDefinition = getAttachableDefinition(blockData, attachFace);
            if( !(attachDefinition > 0) )        return false;    
        }
        else {
            attachDefinition = blockData;
        }
        
        server.requestAddBlock(addPos.x, addPos.y, addPos.z, attachDefinition);

        return true;           
    }


    function getAttachFace(addPos, attachPos) {
        var attachFace = null;
        if(addPos.x - attachPos.x == -1)  {
            if(attachFace == null)   attachFace = BlockFaces.Right;
            else                     return null;
        }
        if(addPos.x - attachPos.x ==  1) {
            if(attachFace == null)   attachFace = BlockFaces.Left;
            else                     return null;
        }
        if(addPos.z - attachPos.z == -1)  {
            if(attachFace == null)   attachFace = BlockFaces.Front;
            else                     return null;
        }
        if(addPos.z - attachPos.z ==  1) {
            if(attachFace == null)   attachFace = BlockFaces.Back;
            else                     return null;
        } 
        if(addPos.y - attachPos.y == -1)  {
            if(attachFace == null)   attachFace = BlockFaces.Top;
            else                     return null;
        }
        if(addPos.y - attachPos.y ==  1)  {
            if(attachFace == null)   attachFace = BlockFaces.Bottom;
            else                     return null;
        }
        return attachFace;
    }


    function getAttachableDefinition(blockData, attachFace) {
        var nextData = blockData;
        do {
            if( BehaviorInfo.addsWith(nextData, attachFace)) return nextData;
            nextData = BehaviorInfo.getNextAttachBlock(nextData);
        } while(nextData && nextData != blockData)
        return Block.NoBlock;
    }


    this.removeBlock = function(server, chunkStore, removePos) {
        var blockData = chunkStore.getBlockData(removePos);

        if(blockData == Block.NoBlock) {
            removePos = Vector.down(removePos);
            blockData = chunkStore.getBlockData(removePos);
            if( !BlockData.isDoubleBlock(blockData) ) return;
        }

        if(removePos.y < -Config.worldRadiusVertical + Config.chunkSize) {
            return false;   // must not remove blocks from lowest chunk
        }

        server.requestRemoveBlock(removePos.x, removePos.y, removePos.z);     

        const belowPos  = Vector.down(removePos);
        const belowData = chunkStore.getBlockData(belowPos); 
        if( BehaviorInfo.removesWith(blockData, belowData, BlockFaces.Top) ) {
            server.requestRemoveBlock(belowPos.x, belowPos.y, belowPos.z);                            
        }
    
        const abovePos  = Vector.up(removePos);
        const aboveData = chunkStore.getBlockData(abovePos);  
        if( BehaviorInfo.removesWith(blockData, aboveData, BlockFaces.Bottom) ) {
            server.requestRemoveBlock(abovePos.x, abovePos.y, abovePos.z);                                        
        }

        const leftPos  = Vector.left(removePos);
        const leftData = chunkStore.getBlockData(leftPos);  
        if( BehaviorInfo.removesWith(blockData, leftData, BlockFaces.Right) ) {
            server.requestRemoveBlock(leftPos.x, leftPos.y, leftPos.z);                                        
        }

        const rightPos  = Vector.right(removePos);
        const rightData = chunkStore.getBlockData(rightPos);  
        if( BehaviorInfo.removesWith(blockData, rightData, BlockFaces.Left) ) {
            server.requestRemoveBlock(rightPos.x, rightPos.y, rightPos.z);                                        
        }

        const backPos  = Vector.back(removePos);
        const backData = chunkStore.getBlockData(backPos);  
        if( BehaviorInfo.removesWith(blockData, backData, BlockFaces.Front) ) {
            server.requestRemoveBlock(backPos.x, backPos.y, backPos.z);                                        
        }

        const frontPos  = Vector.forward(removePos);
        const frontData = chunkStore.getBlockData(frontPos);  
        if( BehaviorInfo.removesWith(blockData, frontData, BlockFaces.Back) ) {
            server.requestRemoveBlock(frontPos.x, frontPos.y, frontPos.z);                                        
        }
    }


    this.changeState = function(server, chunkStore, blockPos) {
        var blockData     = chunkStore.getBlockData(blockPos);
        if(blockData == Block.NoBlock) {
            blockPos = Vector.down(blockPos);
            blockData = chunkStore.getBlockData(blockPos);
            if( !BlockData.isDoubleBlock(blockData) ) return false;
        }

        if( !BehaviorInfo.canChange(blockData) ) return false;

        const changedBlock  = BehaviorInfo.getChangeBlock(blockData);
        server.requestChangeBlock(blockPos.x, blockPos.y, blockPos.z, changedBlock);   
        
        if( BlockData.isRadio(blockData)) {
            turnOffRadio();
        }

        return true;
    }


    const switchCoordinates = new NumberArray(256, 256);    

    this.switchState = function(server, chunkStore, blockPos) {
        var blockData     = chunkStore.getBlockData(blockPos);    
        if(blockData == Block.NoBlock) {
            blockPos = Vector.down(blockPos);
            blockData = chunkStore.getBlockData(blockPos);
            if( !BlockData.isDoubleBlock(blockData) ) return;
        }
                
        switchCoordinates.clear();   
        
        if( BlockData.isRadio(blockData)) {
            switchRadio(blockData);
            return true;
        }

        else if( BlockData.isButton(blockData) ) {
            var switched = 1;
            switchCoordinates.add(blockPos.x, blockPos.y, blockPos.z);          
            for(var x=blockPos.x-1; x <= blockPos.x+1; x++)  {
                for(var y=blockPos.y-1; y <= blockPos.y+1; y++)  {
                    for(var z=blockPos.z-1; z <= blockPos.z+1; z++)  {
                        if(switched >= Config.maxSwitches) break;
                        const neighbourPos = Vector.create(x, y, z);
                        const neighbourData = chunkStore.getBlockData(neighbourPos);
                        if( BehaviorInfo.canSwitch(neighbourData) && !BlockData.isDoor(neighbourData) && !BlockData.isButton(neighbourData) ) {
                            switchCoordinates.add(neighbourPos.x, neighbourPos.y, neighbourPos.z);    
                            switched++;      
                        }                        
                    }        
                }    
            }
            server.requestSwitchBlocks(switchCoordinates);            
        }

        else if( BlockData.isDoor(blockData) ) {
            switchDoor(server, chunkStore, blockPos);

            const leftPos   = Vector.left(blockPos);
            const rightPos  = Vector.right(blockPos);
            const backPos   = Vector.back(blockPos);
            const frontPos  = Vector.forward(blockPos);
            
            switchDoor(server, chunkStore, leftPos);
            switchDoor(server, chunkStore, rightPos);
            switchDoor(server, chunkStore, backPos);
            switchDoor(server, chunkStore, frontPos);

            server.requestSwitchBlocks(switchCoordinates);            
            return true;
        }
        
        else if( BehaviorInfo.canSwitch(blockData) ) {        
            switchCoordinates.add(blockPos.x, blockPos.y, blockPos.z);          
            server.requestSwitchBlocks(switchCoordinates);
            return true;          
        }

        else {
            return false;
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // doors
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
    function switchDoor(server, chunkStore, blockPos) {
        const blockData     = chunkStore.getBlockData(blockPos);    
        if(!BlockData.isDoor(blockData)) return;
        
        switchCoordinates.add(blockPos.x, blockPos.y, blockPos.z);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // radio
    ///////////////////////////////////////////////////////////////////////////////////////////////
    

    //const radio = new Audio("http://stream.radio.is:443/flashback");
    //const radio = new Audio("http://stream.radio.is:443/saga");
    //const radio = new Audio("http://live.963.is:443/sudurlandfm");
    //const radio = new Audio("http://www.trioeuter.ch/snd/02%20Ei_Ding.mp3");
    const radio = new Audio();
    var radioBlock = null;
    var radioPlays = false;
    
    
    function turnOffRadio() {
        radioPlays = false;
        radio.pause();
    }
    
    function switchRadio(blockData) {
        const definition = BlockData.getDefinition(blockData);
        if(radioBlock != definition) {
            if(definition == Block.Radio)        radio.src = "http://stream.radio.is:443/saga";
            else if(definition == Block.Radio_1) radio.src = "http://stream.radio.is:443/flashback";
            else if(definition == Block.Radio_2) radio.src = "http://royalfreeradio.co.uk/listen/";
            else if(definition == Block.Radio_3) radio.src = "http://br-br1-obb.cast.addradio.de/br/br1/obb/mp3/128/stream.mp3";
            else assert(false, "unknown radio type: " + definition);
            radioBlock = definition;
            radio.load();
        }

        radioPlays = !radioPlays;
        if(radioPlays) {
            radio.play();
        }
        else {
            radio.pause();
        }
    }
    
}



    