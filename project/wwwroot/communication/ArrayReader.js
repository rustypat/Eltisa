'use strict';

function ArrayReader(messageArrayBuffer) {

    const message  = messageArrayBuffer;
    const dataView = new DataView(message, 0);

    var   pos      = 0;    


    this.readByte = function() {        
        const result = dataView.getUint8(pos);
        pos += 1;
        return result;
    }


    this.readShort = function() {        
        const result = dataView.getInt16(pos, true);
        pos += 2;
        return result;
    }


    this.readUShort = function() {        
        const result = dataView.getUint16(pos, true);
        pos += 2;
        return result;
    }


    this.readInteger = function() {
        const result = dataView.getInt32(pos, true);
        pos += 4;
        return result;
    }


    this.readInt32Array = function(intLength) {
        if(System.browserIsLittleEndian) {
            const byteLength = intLength * 4;
            const intArray   = new Int32Array(message, pos, intLength);
            pos += byteLength;
            return intArray;
        }
        else {
            const intArray = new Int32Array(intLength);
            for(var i=0; i < intLength; i++) {
                intArray[i] = dataView.getInt32(pos, true);
                pos += 4;
            }
        }
    }


    this.readFloat = function() {
        const result = dataView.getFloat32(pos, true);
        pos += 4;
        return result;
    }


    this.readString = function() {
        const length  = dataView.getInt32(pos, true);
        pos += 4;
        if(length < 0 ) return null;
        const decoder = new TextDecoder("utf-8");
        const view    = new DataView(message, pos, length);
        pos += length;
        return decoder.decode(view);
    }


    this.hasMore = function() {
        return pos < message.byteLength;
    }

}