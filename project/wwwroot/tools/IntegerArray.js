'use strict';


///////////////////////////////////////////////////////////////////////////////////////////////////
// unsigned integer array that can grow
///////////////////////////////////////////////////////////////////////////////////////////////////


function IntegerArray(startCapacity, capacityIncrement, int32Array) {
    let length;
    let capacity;
    let intArray;
    
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
        let shift = false;
        for(let i=0; i < length; i++) {
            if(!shift && matchFunction(intArray[i], value)) {
                length--;
                shift = true;
            }
            if(shift) intArray[i] = intArray[i+1];
        }
        return shift;
    }


    this.replaceFirstMatch = function(value,  matchFunction) {
        for(let i=0; i < length; i++) {
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
        for(let i=0; i < length; i++) {
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
