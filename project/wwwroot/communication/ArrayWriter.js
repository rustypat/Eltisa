'use strict';

function ArrayWriter(maxBufferLength) {

    if(maxBufferLength == null) maxBufferLength = Config.maxMessageLength;

    const buffer   = new ArrayBuffer(maxBufferLength);
    const dataView = new DataView(buffer, 0);

    var   pos      = 0;    


    this.reset = function() {
        pos = 0;
    }

    
    this.writeByte = function(value) {        
        dataView.setUint8(pos, value);
        pos += 1;
    }


    this.writeShort = function(value) {        
        dataView.setUint16(pos, value, true);
        pos += 2;
    }


    this.writeInteger = function(value) {
        dataView.setInt32(pos, value, true);
        pos += 4;
    }


    this.writeFloat = function(value) {
        dataView.setFloat32(pos, value, true);
        pos += 4;
    }


    const encoder = new TextEncoder("utf-8");
    this.writeString = function(str) {
        if( str == null) {
            dataView.setInt32(pos, -1, true);        
            pos += 4;
        }
        else {
            const uint8Array = encoder.encode(str);

            dataView.setInt32(pos, uint8Array.byteLength, true);        
            pos += 4;
            
            for(var i=0; i < uint8Array.byteLength; i++) {
                dataView.setUint8(pos, uint8Array[i]);
                pos += 1;
            }    
        }
    }


    this.ToArrayBuffer = function() {
        assert(pos < maxBufferLength, "buffer overflow");
        return buffer.slice(0, pos);
    }
    
}