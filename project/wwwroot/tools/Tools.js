'use strict';

///////////////////////////////////////////////////////////////////////////////////////////////////
// vectors
///////////////////////////////////////////////////////////////////////////////////////////////////


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


    this.equals = function(vector1, vector2) {
        if (!vector1 || !vector2  ) return false;
        if (vector1.x != vector2.x) return false;    
        if (vector1.y != vector2.y) return false;    
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


///////////////////////////////////////////////////////////////////////////////////////////////////
// chunk position
///////////////////////////////////////////////////////////////////////////////////////////////////


const ChunkPos = new function() {

    var byteBuffer = new ArrayBuffer(8);
    var byteView = new DataView(byteBuffer);
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


///////////////////////////////////////////////////////////////////////////////////////////////////
// float 64 array that can grow
///////////////////////////////////////////////////////////////////////////////////////////////////


function NumberArray(startCapacity, capacityIncrement) {
    if(!capacityIncrement)   capacityIncrement = 256;
    if(!startCapacity)       startCapacity     = 256;
    else                     startCapacity     = Math.ceil(startCapacity / capacityIncrement) * capacityIncrement;
    
    var length      = 0;
    var capacity    = startCapacity;
    var floatArray  = new Float64Array(capacity);


    this.getLength = function() {
        return length;
    }


    this.clear = function() {
        length = 0;
    }


    this.add = function(values) {
        if(length + arguments.length >= capacity) {
            const newCapacity = capacity + capacityIncrement;
            const newArray    = new Float64Array(newCapacity);
            newArray.set(floatArray);
            floatArray = newArray;
            capacity = newCapacity;
        }

        for(var i = 0; i < arguments.length; i++) {
            floatArray[length] = arguments[i];
            length++;
        }        
    }


    this.get = function(index) {
        assert(index < length);
        return floatArray[index];
    }


    this.contains = function(value) {
        for(var i=length-1; i >= 0; i--) {
            if(floatArray[i] == value) return true;
        }
        return false;
    }

    this.removeFirstMatch = function(value,  matchFunction) {
        var shift = false;
        for(var i=0; i < length; i++) {
            if(!shift && matchFunction(floatArray[i], value)) {
                length--;
                shift = true;
            }
            if(shift) floatArray[i] = floatArray[i+1];
        }
        return shift;
    }


    this.replaceFirstMatch = function(value,  matchFunction) {
        for(var i=0; i < length; i++) {
            if(matchFunction(floatArray[i], value)) {
                floatArray[i] = value;
                return true;
            }
        }
        return false;
    }


    // returns true if replaced and false if added
    this.replaceOrAdd = function(value,  matchFunction) {
        // try replace
        for(var i=0; i < length; i++) {
            if(matchFunction(floatArray[i], value)) {
                floatArray[i] = value;
                return true;
            }
        }

        // increase capacity if needed
        if(length + 1 >= capacity) {
            capacity = capacity + capacityIncrement;
            const newArray    = new Float64Array(capacity);
            newArray.set(floatArray);
            floatArray = newArray;
        }

        // add value at end
        floatArray[length] = value;
        return false
    }


}



///////////////////////////////////////////////////////////////////////////////////////////////////
// unsigned integer array that can grow
///////////////////////////////////////////////////////////////////////////////////////////////////


function IntegerArray(startCapacity, capacityIncrement, int32Array) {
    var length;
    var capacity;
    var intArray;
    
    if(startCapacity == -1) {
        length      = int32Array.length;
        capacity    = int32Array.length;
        intArray    = int32Array;    
    }
    else {
        length      = 0;
        capacity    = startCapacity;
        intArray    = new Int32Array(capacity);    
    }


    this.getLength = function() {
        return length;
    }


    this.clear = function() {
        length = 0;
    }


    this.add = function(unsignedIntValue) {
        if(length >= capacity) {
            const newCapacity = capacity + capacityIncrement;
            const newArray    = new Int32Array(newCapacity);
            newArray.set(intArray);
            intArray = newArray;
            capacity = newCapacity;
        }
        intArray[length] = unsignedIntValue;
        length++;
    }


    this.get = function(index) {
        assert(index < length);
        return intArray[index];
    }


    this.removeFirstMatch = function(value,  matchFunction) {
        var shift = false;
        for(var i=0; i < length; i++) {
            if(!shift && matchFunction(intArray[i], value)) {
                length--;
                shift = true;
            }
            if(shift) intArray[i] = intArray[i+1];
        }
        return shift;
    }


    this.replaceFirstMatch = function(value,  matchFunction) {
        for(var i=0; i < length; i++) {
            if(matchFunction(intArray[i], value)) {
                intArray[i] = value;
                return true;
            }
        }
        return false;
    }


    // returns true if replaced and false if added
    this.replaceOrAdd = function(value,  matchFunction) {
        // try replace
        for(var i=0; i < length; i++) {
            if(matchFunction(intArray[i], value)) {
                intArray[i] = value;
                return true;
            }
        }

        // increase capacity if needed
        if(length + 1 >= capacity) {
            capacity = capacity + capacityIncrement;
            const newArray    = new Int32Array(capacity);
            newArray.set(intArray);
            intArray = newArray;
        }

        // add value at end
        intArray[length] = value;
        length++;
        return false
    }

}



///////////////////////////////////////////////////////////////////////////////////////////////////
// watch
///////////////////////////////////////////////////////////////////////////////////////////////////


function WaitWatch(minWaitSeconds) {
    const waitTime      = minWaitSeconds * 1000;
    var   startTime     = performance.now();
    

    this.hasWaitedEnough = function() {
        const currentTime = performance.now();
        if(currentTime - startTime < waitTime) {
            return false;
        }
        else {
            startTime = currentTime;
            return true;
        }

    }


}


///////////////////////////////////////////////////////////////////////////////////////////////////
// system
///////////////////////////////////////////////////////////////////////////////////////////////////

const System = new function() {

    this.browserIsLittleEndian = (
        function() {
            var buffer = new ArrayBuffer(2);
            new DataView(buffer).setInt16(0, 256, true /* littleEndian */);
            // Int16Array uses the platform's endianness.
            return new Int16Array(buffer)[0] === 256;
        }
    )();
    
    
    this.info = function() {
        console.log("System Info");
        console.log("    browser:                " + navigator.appName + " " + navigator.appVersion);
        console.log("    isLittleEndian:         " + this.browserIsLittleEndian);
        console.log("    memory usage:           " + (performance.memory ? performance.memory : "unknown") );        
    }

}


///////////////////////////////////////////////////////////////////////////////////////////////////
// extensions
///////////////////////////////////////////////////////////////////////////////////////////////////


// adds a mathematical mod to numbers
Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};


Number.prototype.isInRange = function(min, max) {
    return this >= min && this <= max;
};


String.prototype.getHash = function() {
  return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}


Math.randomBetween = function(min, max) {
    return Math.random() * (max - min) + min;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// assert
///////////////////////////////////////////////////////////////////////////////////////////////////

const assertDebug = function (condition, message) {
    if(condition) return;
    if(!message) message = "Assertion failed";
    console.assert(condition, message);
    console.trace();
    throw message;
};

const assertProduction = function() {};

const assert = Config.debug ? assertDebug : assertProduction;


const fail = function(message) {
    console.assert(false, message);
    console.trace();    
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// Methods
///////////////////////////////////////////////////////////////////////////////////////////////////


function isOneOf(obj, values) {
    for(var i = 1; i < arguments.length; i++) {
        if( obj == arguments[i] ) return true;
    }
    return false;
}


function calculateProportionalValue(inValue, inMinValue, inMaxValue, outMinValue, outMaxValue) {
    assert(inMaxValue > inMinValue);
    if(inValue <= inMinValue) return outMinValue;   
    if(inValue >= inMaxValue) return outMaxValue;        
    const d = (inValue - inMinValue) / (inMaxValue - inMinValue);
    return d * outMaxValue + (1-d) * outMinValue;
}


function isValidString(str) {
    if( typeof str != "string" ) return false;
    let trimedString = str.trim();
    return trimedString.length > 0;

}

function sleep(milliseconds) {
    return new Promise(r => setTimeout(r, milliseconds));
}

