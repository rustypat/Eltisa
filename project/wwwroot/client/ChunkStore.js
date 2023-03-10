'use strict';

function ChunkStore(_worldport) {

    const worldport               = _worldport;
    const chunks                  = new Map();
    const newChunks               = [];
    const self                    = this;
    

    this.dispose = function() {
        clearChunks();
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // chunk updating
    ///////////////////////////////////////////////////////////////////////////////////////////////

    this.handleChunkMessage = function(chunksMessage) {
        if(chunksMessage.requestId != requestTimeStamp) return;
        for(let i=0; i < requestChunkList.getLength(); i++) {
            const chunkKey         = requestChunkList.get(i);
            const chunkDescription = getChunkDescription(chunksMessage, chunkKey);
            newChunks.push(chunkDescription);
        }
        clearRequest();
    }


    this.updateNewChunks = function(breakTime) {
        while(newChunks.length > 0) {
            replaceChunk(newChunks.pop());
            if(performance.now() > breakTime) return;
        }
    }


    this.updateBlock = function(x, y, z, blockdata) {
        const key = ChunkPos.createFromWorldPos(x, y, z);
        if( !key ) return null;
        const chunk = chunks.get(key);
        if( !chunk ) return null;
        if(BlockData.hasFaces(blockdata)) {
            if(!chunk.blocks) chunk.blocks = new IntegerArray(64, 64);
            chunk.blocks.replaceOrAdd(blockdata, BlockData.equalLocation);
        }
        else {
            if(chunk.blocks) chunk.blocks.removeFirstMatch(blockdata, BlockData.equalLocation)
        }
        return chunk;
    }


    function replaceChunk(chunkDescription) {
        // add or replace mesh
        const key       = ChunkPos.create(chunkDescription.x, chunkDescription.y, chunkDescription.z);
        let   chunk     = chunks.get(key);
        
        worldport.removeChunkMesh(chunk);

        chunk = chunkDescription;
        chunks.set(key, chunk);

        worldport.addChunkMesh(chunk);

        chunk.isValid = true;        
        return;
    }

    this.updateChunk = function(chunk) {
        worldport.removeChunkMesh(chunk);
        worldport.addChunkMesh(chunk);
        chunk.isValid = true;        

    }

    const chunkPos = {};

    function getChunkDescription(chunksMessage, key) {
        chunkPos.x = ChunkPos.getX(key);
        chunkPos.y = ChunkPos.getY(key);
        chunkPos.z = ChunkPos.getZ(key);

        for(let i=0; i < chunksMessage.chunks.length; i++) {
            const chunk = chunksMessage.chunks[i];
            if(chunk.x == chunkPos.x && chunk.y == chunkPos.y && chunk.z == chunkPos.z) {
                chunksMessage.chunks.splice(i, 1);
                return chunk;
            }
        }

        return DefaultWorld.getDefaultChunkDescription(chunkPos);
    }


    function clearChunks() {
        chunks.forEach(function(chunk, key) {
            worldport.removeChunkMesh(chunk);
        });

        chunks.clear();
        newChunks.length = 0;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // chunk maintenance
    ///////////////////////////////////////////////////////////////////////////////////////////////

    let environmentIterator  = null;
    let chunkUpdateNeeded    = false;
    let centerChunkPosition  = Vector.create(0, 0, 0);

    this.updateCenterPosition = function(playerPosition) {
        const newCenterChunkPosition = Vector.toChunkVector(playerPosition);
        const hasChangedChunk = ! Vector.equals(centerChunkPosition, newCenterChunkPosition);
        if( hasChangedChunk ) {
            if( Vector.calculateEuclidDistance(centerChunkPosition, newCenterChunkPosition)  >= 2) {    // player was teleporting big distance
                clearChunks();
            }
            else if(chunkUpdateNeeded) {
                Log.warning("chunk change skiped: probably lost some memory"); 
            }
            chunkUpdateNeeded     = true;
            centerChunkPosition   = newCenterChunkPosition;
        }
    }


    this.updateEnvironmentRadius = function() {
        chunkUpdateNeeded = true;
    }


    this.updateChunks = function(breakTime) {        
        if(!environmentIterator) {
            if(!chunkUpdateNeeded) return;
            environmentIterator = getEnvironmentIterator(centerChunkPosition, Config.getEnvironmentChunkRadius() + 1);
            chunkUpdateNeeded = false;
        }
                
        const radius    = Config.getEnvironmentChunkRadius() + 0.9;

        while(environmentIterator.next() ) {
            const chunkPos  = ChunkPos.create(environmentIterator.x, environmentIterator.y, environmentIterator.z);
            const chunk     = chunks.get(chunkPos);
            const chunkDist = Vector.calculateEuclidDistance(environmentIterator, centerChunkPosition);

            if( !chunk ) {
                if( chunkDist <= radius && !requestChunkList.contains(chunkPos) ) {
                    missingChunkList.add(chunkPos);
                }
            }
            else {
                if(chunkDist > radius ) {
                    worldport.removeChunkMesh(chunk);
                    chunks.delete(chunkPos);                
                }
                else if(chunkDist > 2) {
                    worldport.updateChunkMesh(chunk, false);
                }
                else if(chunkDist <= 2) {
                    worldport.updateChunkMesh(chunk, true);
                }
            }

            if(performance.now() > breakTime) return;
        }

        environmentIterator = null;
    }


    function getEnvironmentIterator(centerPosition, radius) {
        const iterator = new function() {
            let xMin = centerPosition.x - radius
            let yMin = centerPosition.y - radius
            let zMin = centerPosition.z - radius

            let xMax = centerPosition.x + radius
            let yMax = centerPosition.y + radius
            let zMax = centerPosition.z + radius

            if( xMin < -Config.chunkRadius         ) xMin = -Config.chunkRadius;
            if( xMax >= Config.chunkRadius         ) xMax =  Config.chunkRadius - 1;
            if( yMin < -Config.chunkRadiusVertical ) yMin = -Config.chunkRadiusVertical;
            if( yMax >= Config.chunkRadiusVertical ) yMax =  Config.chunkRadiusVertical - 1;
            if( zMin < -Config.chunkRadius         ) zMin = -Config.chunkRadius;
            if( zMax >= Config.chunkRadius         ) zMax =  Config.chunkRadius - 1;
                
            this.x = xMin;
            this.y = yMin - 1;
            this.z = zMin;
    
            this.next = function() {
                this.y++;
                if(this.y > yMax) {
                    this.y = yMin;
                    this.z++;
                }
                if(this.z > zMax) {
                    this.z = zMin;
                    this.x++;
                }
                return this.x <= xMax;
            }    
        }
        return iterator;
    }


    function *getEnvironmentIteratorThatIsToSlowForFirefox(center) {
        const position = {};

        yield center;
        for(let radius=1; radius <= Config.getEnvironmentChunkRadius() + 1; radius++) {
            for(let x = center.x - radius; x <= center.x + radius; x++) {
                position.x = x;
                for(let y = center.y - radius; y <= center.y + radius; y++) {
                    position.y = y;
                    position.z = center.z-radius;
                    yield position;
                    position.z = center.z+radius;
                    yield position;
                }        
            }        
            for(let x = center.x - radius; x <= center.x + radius; x++) {
                position.x = x;
                for(let z = center.z - radius; z <= center.z + radius; z++) {
                    position.z = z;
                    position.y = center.y-radius;
                    yield position;
                    position.y = center.y+radius;
                    yield position;
                }        
            }        
            for(let z = center.z - radius; z <= center.z + radius; z++) {
                position.z = z;
                for(let y = center.y - radius; y <= center.y + radius; y++) {
                    position.y = y;
                    position.x = center.x-radius;
                    yield position;
                    position.x = center.x+radius;
                    yield position;
                }        
            }     
        }  
    }

    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // chunk request
    ///////////////////////////////////////////////////////////////////////////////////////////////
        
    let   missingChunkList         = new NumberArray(256, 256);    
    let   requestChunkList         = new NumberArray(256, 256);    
    let   requestTimeStamp         = 0;
    const requestTimeoutSeconds    = 10;



    this.sendRequest = function(serverOut) {
        if( missingChunkList.getLength() == 0 ) return;    // no data
        if( requestTimeStamp != 0 )             return;    // pending request

        const swapList    = requestChunkList;
        requestChunkList  = missingChunkList;
        missingChunkList  = swapList;        

        if( requestChunkList.getLength() > 0 ) {
            requestTimeStamp  = Math.floor(performance.now());
            serverOut.requestChunks(requestTimeStamp, requestChunkList);
        }    
    }


    function clearRequest() {
        requestChunkList.clear();
        requestTimeStamp = 0;        
    }


    this.timeOutRequest = function() {
        if( requestTimeStamp == 0 ) return;
        if( performance.now() - requestTimeStamp >= 1000 * requestTimeoutSeconds ) {
            requestChunkList.clear();
            requestTimeStamp = 0;     
            chunkUpdateNeeded = true;                   
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // access block info
    ///////////////////////////////////////////////////////////////////////////////////////////////

    this.getBlockData = function(worldPos) {
        if(!worldPos)  return Block.InvalidBlock;
        const key       = ChunkPos.createFromWorldPos(worldPos.x, worldPos.y, worldPos.z);
        let   chunk     = chunks.get(key);
        if(!chunk) return Block.NoBlock;
        if(!chunk.blocks) return Block.NoBlock;
        const blockPos  = Vector.toBlockVector(worldPos);
        for(let i=0; i < chunk.blocks.getLength(); i++) {
            const blockData = chunk.blocks.get(i);
            const blockX = BlockData.getX(blockData);
            const blockY = BlockData.getY(blockData);
            const blockZ = BlockData.getZ(blockData);
            if(blockX == blockPos.x && blockY == blockPos.y && blockZ == blockPos.z ) {
                return blockData;
            }
        }
        return Block.NoBlock;
    }


    this.isSolid = function(blockPos) {
        const blockData = self.getBlockData(blockPos);  
        return BlockData.isSolid(blockData);        
    }

    this.isEmpty = function(blockPos) {
        const blockData = self.getBlockData(blockPos);  
        return !BlockData.isBlock(blockData);        
    }


    this.isTransparent = function(blockPos) {
        const blockData = self.getBlockData(blockPos);  
        return BlockData.isTransparent(blockData);        
    }


    this.hasValidChunkEnvironment = function(centerPos) {
        if(!hasValidChunkAt(centerPos.x-1, centerPos.y,   centerPos.z))   return false;
        if(!hasValidChunkAt(centerPos.x+1, centerPos.y,   centerPos.z))   return false;
        if(!hasValidChunkAt(centerPos.x,   centerPos.y-1, centerPos.z))   return false;
        if(!hasValidChunkAt(centerPos.x,   centerPos.y+1, centerPos.z))   return false;
        if(!hasValidChunkAt(centerPos.x,   centerPos.y,   centerPos.z-1)) return false;
        if(!hasValidChunkAt(centerPos.x,   centerPos.y,   centerPos.z+1)) return false;
        return true;    
    }

    
    function hasValidChunkAt(worldPosX, worldPosY, worldPosZ) {
        const chunkPos = ChunkPos.createFromWorldPos(worldPosX, worldPosY, worldPosZ);
        if(!chunkPos)   return false;

        let chunk  = chunks.get(chunkPos);        
        if(chunk)  return chunk.isValid;
        else       return false;
    }    


    this.info = function() {
        console.log("ChunkStore Info");
        console.log("    chunks.size:            " + chunks.size);
        console.log("    newChunks.length:       " + newChunks.length);
        console.log("    missingChunkList.length:" + missingChunkList.getLength());
        console.log("    requestChunkList.length:" + requestChunkList.getLength());
        console.log("    chunkUpdateNeeded:      " + chunkUpdateNeeded);
        console.log("    environmentIterator:    " + environmentIterator);
        console.log("    requestTimeStamp:       " + requestTimeStamp);
        console.log("    centerChunkPosition:    " + Vector.toString(centerChunkPosition));        
    }

}