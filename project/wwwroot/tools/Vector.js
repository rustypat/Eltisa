'use strict';


const Vector = new function() {

    this.create = function(x, y, z) {
        const vector = {};
        vector.x = x;
        vector.y = y;
        vector.z = z;
        return vector;
    }


    this.clone = function(vector) {
        const clone = {};
        clone.x = vector.x;
        clone.y = vector.y;
        clone.z = vector.z;
        return clone;    
    }


    this.randomize = function(vector, range) {
        const clone = {};
        clone.x = vector.x + Math.randomBetween(-range, range);
        clone.y = vector.y + Math.randomBetween(-range, range);
        clone.z = vector.z + Math.randomBetween(-range, range);
        return clone;    
    }

    
    this.calculateEuclidDistance = function(vector1, vector2) {
        const dx = vector1.x - vector2.x;
        const dy = vector1.y - vector2.y;
        const dz = vector1.z - vector2.z;
        return Math.sqrt( dx*dx + dy*dy + dz*dz);
    }


    this.calculateChebyshevDistance = function(vector1, vector2) {
        const dx = Math.abs(vector1.x - vector2.x);
        const dy = Math.abs(vector1.y - vector2.y);
        const dz = Math.abs(vector1.z - vector2.z);
        return Math.max( dx, dy, dz);
    }

    this.calculateDistance = function(vector1, vector2) {
        const dx = vector1.x - vector2.x;
        const dy = vector1.y - vector2.y;
        const dz = vector1.z - vector2.z;
        return {x:dx, y:dy, z:dz};
    }

    this.calculateDistanceAbsolute = function(vector1, vector2) {
        const dx = Math.abs(vector1.x - vector2.x);
        const dy = Math.abs(vector1.y - vector2.y);
        const dz = Math.abs(vector1.z - vector2.z);
        return {x:dx, y:dy, z:dz};
    }


    this.equals = function(vector1, vector2) {
        if (!vector1 || !vector2  ) return false;
        if (vector1.x != vector2.x) return false;    
        if (vector1.y != vector2.y) return false;    
        if (vector1.z != vector2.z) return false;    
        return true;
    }
    
    this.equalsXZ = function(vector1, vector2) {
        if (!vector1 || !vector2  ) return false;
        if (vector1.x != vector2.x) return false;     
        if (vector1.z != vector2.z) return false;    
        return true;
    }

    this.copy = function(sinkVector, sourceVector) {
        sinkVector.x = sourceVector.x;
        sinkVector.y = sourceVector.y;
        sinkVector.z = sourceVector.z;
    }


    this.roundToFloor = function(clientVector) {
        const position = new Object
        position.x = Math.floor(clientVector.x);
        position.y = Math.floor(clientVector.y);
        position.z = Math.floor(clientVector.z);
        return position;
    }


    this.copyAsWorldVector = function(worldPosition, chunkPosition) {
        worldPosition.x = chunkPosition.x * Config.chunkSize;
        worldPosition.y = chunkPosition.y * Config.chunkSize;
        worldPosition.z = chunkPosition.z * Config.chunkSize;
    }


    this.toChunkVector = function(worldPosition) {
        const chunkPosition = new Object
        chunkPosition.x = Math.floor(worldPosition.x / Config.chunkSize);
        chunkPosition.y = Math.floor(worldPosition.y / Config.chunkSize);
        chunkPosition.z = Math.floor(worldPosition.z / Config.chunkSize);
        return chunkPosition;
    }
    

    this.toBlockVector = function(worldPosition) {
        const blockPosition = new Object
        blockPosition.x = worldPosition.x.mod(16);
        blockPosition.y = worldPosition.y.mod(16);
        blockPosition.z = worldPosition.z.mod(16);
        return blockPosition;
    }
    

    this.left = function(vector) {
        return { x: vector.x-1, y: vector.y, z: vector.z};
    }

    
    this.right = function(vector) {
        return { x: vector.x+1, y: vector.y, z: vector.z};
    }

    
    this.back = function(vector) {
        return { x: vector.x, y: vector.y, z: vector.z-1};
    }

    
    this.forward = function(vector) {
        return { x: vector.x, y: vector.y, z: vector.z+1};
    }

    
    this.down = function(vector) {
        return { x: vector.x, y: vector.y-1, z: vector.z};
    }

    
    this.up = function(vector) {
        return { x: vector.x, y: vector.y+1, z: vector.z};
    }


    this.toString = function(vector) {
        return vector.x + "/" + vector.y + "/" + vector.z;
    }
    
}
