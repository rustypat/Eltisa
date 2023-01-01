'Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved';
'use strict';

const DefaultWorld = new function() {    


    this.getDefaultChunkDescription = function(pos) {
        if(pos.y == 1) {   // sea surface
            return getDefaultSeaChunk(pos);
        }
        else {
            return getDefaultEmptyChunk(pos);
        }
    }


    function getDefaultSeaChunk(pos) {
        const chunk               = {};
        chunk.x                   = pos.x;
        chunk.y                   = pos.y;
        chunk.z                   = pos.z;
        chunk.solidBlocks         = Config.chunkSize * Config.chunkSize;
        chunk.transparentBlocks   = 0;

        chunk.blocks              = new IntegerArray(Config.chunkSize * Config.chunkSize, 64);
        const y = Config.chunkSize - 1;
        for(var x=0; x < Config.chunkSize; x++) {
            for(var z=0; z < Config.chunkSize; z++) {
                const blockData = BlockData.createBlockData(x, y, z, BlockFaces.Top, Block.Water);
                chunk.blocks.add(blockData);
            }                    
        }
    
        return chunk;
    }


    function getDefaultEmptyChunk(pos) {
        const chunk               = {};
        chunk.x                   = pos.x;
        chunk.y                   = pos.y;
        chunk.z                   = pos.z;
        chunk.solidBlocks         = Config.chunkSize * Config.chunkSize;
        chunk.transparentBlocks   = 0;
        chunk.blocks              = null;
        return chunk;
    }


    
}
        