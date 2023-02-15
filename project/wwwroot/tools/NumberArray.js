'use strict';


///////////////////////////////////////////////////////////////////////////////////////////////////
// float 64 array that can grow
///////////////////////////////////////////////////////////////////////////////////////////////////


function NumberArray(startCapacity, capacityIncrement) {
    if(!capacityIncrement)   capacityIncrement = 256;
    if(!startCapacity)       startCapacity     = 256;
    else                     startCapacity     = Math.ceil(startCapacity / capacityIncrement) * capacityIncrement;
    
    let length      = 0;
    let capacity    = startCapacity;
    let floatArray  = new Float64Array(capacity);


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

        for(let i = 0; i < arguments.length; i++) {
            floatArray[length] = arguments[i];
            length++;
        }        
    }


    this.get = function(index) {
        assert(index < length);
        return floatArray[index];
    }


    this.contains = function(value) {
        for(let i=length-1; i >= 0; i--) {
            if(floatArray[i] == value) return true;
        }
        return false;
    }

    this.removeFirstMatch = function(value,  matchFunction) {
        let shift = false;
        for(let i=0; i < length; i++) {
            if(!shift && matchFunction(floatArray[i], value)) {
                length--;
                shift = true;
            }
            if(shift) floatArray[i] = floatArray[i+1];
        }
        return shift;
    }


    this.replaceFirstMatch = function(value,  matchFunction) {
        for(let i=0; i < length; i++) {
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
        for(let i=0; i < length; i++) {
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

