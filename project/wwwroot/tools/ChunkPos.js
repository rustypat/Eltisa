'use strict';


const ChunkPos = new function() {

    let byteBuffer = new ArrayBuffer(8);
    let byteView = new DataView(byteBuffer);
    byteView.setFloat64(0, 1);

    this.create = function(chunkPosX, chunkPosY, chunkPosZ) {
        byteView.setInt16(6, chunkPosX);
        byteView.setInt16(2, chunkPosY);
        byteView.setInt16(4, chunkPosZ);
        return byteView.getFloat64(0);
    }


    this.isValidChunkPos = function(x, y, z) {
        if( x >= Config.chunkRadius         ) return false;
        if( x < -Config.chunkRadius         ) return false;
        if( z >= Config.chunkRadius         ) return false;
        if( z < -Config.chunkRadius         ) return false;
        if( y >= Config.chunkRadiusVertical ) return false;
        if( y < -Config.chunkRadiusVertical ) return false;
        return true;
    }

    
    this.createFromWorldPos = function(x, y, z) {
        x = x >> 4;
        y = y >> 4;
        z = z >> 4;
        if( !this.isValidChunkPos(x, y, z) ) return null;
        return this.create(x, y, z);
    }


    this.getX = function(chunkPos) {
        byteView.setFloat64(0, chunkPos);
        return byteView.getInt16(6);
    }


    this.getY = function(chunkPos) {
        byteView.setFloat64(0, chunkPos);
        return byteView.getInt16(2);
    }


    this.getZ = function(chunkPos) {
        byteView.setFloat64(0, chunkPos);
        return byteView.getInt16(4);
    }


    this.getServerRegionPoint = function(chunkPos) {
        byteView.setFloat64(0, chunkPos);
        const x = byteView.getInt16(6) >> 4;
        const y = byteView.getInt16(2) >> 4;
        const z = byteView.getInt16(4) >> 4;        
        return (y << 24) | ( (z & 0xFFF) << 12) | (x & 0xFFF);
    }

            
    this.getServerChunkPoint = function(chunkPos) {
        byteView.setFloat64(0, chunkPos);
        const x = byteView.getInt16(6) & 0xF;
        const y = byteView.getInt16(2) & 0xF;
        const z = byteView.getInt16(4) & 0xF;        
        return ( y << 8) | (z << 4) | x
    }

            
    this.createFromServerRegionPoint = function(regionPoint, chunkPoint) {
        const regionY = regionPoint >> 24;
        const regionZ = regionPoint <<  8 >> 20
        const regionX = regionPoint << 20 >> 20;

        const chunkY  = chunkPoint >> 8;
        const chunkZ  = (chunkPoint  >> 4) & 0xF;
        const chunkX  = chunkPoint & 0xF;
        
        byteView.setInt16(6, regionX * Config.regionSize + chunkX);
        byteView.setInt16(2, regionY * Config.regionSize + chunkY);
        byteView.setInt16(4, regionZ * Config.regionSize + chunkZ);
        return byteView.getFloat64(0);
        
    }

            
}


