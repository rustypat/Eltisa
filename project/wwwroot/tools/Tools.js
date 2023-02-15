'use strict';



///////////////////////////////////////////////////////////////////////////////////////////////////
// watch
///////////////////////////////////////////////////////////////////////////////////////////////////


function WaitWatch(minWaitSeconds) {
    const waitTime      = minWaitSeconds * 1000;
    let   startTime     = performance.now();
    

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
            let buffer = new ArrayBuffer(2);
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
    for(let i = 1; i < arguments.length; i++) {
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

