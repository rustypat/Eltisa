'Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved';
'use strict';

const LogDebug = new function() {

    this.todo = function(message) {
        console.log("TODO: " + message);
    }

    this.debug = function(message) {
        console.log(message);
    }
    
    
    this.trace = function(message) {
        console.log(message);
    }
    
    
    this.info = function(message) {
        console.log(message);
    }
    
    
    this.warning = function(message) {
        console.log(message);
    }
    
    
    this.error = function(message) {
        console.log("ERROR: " + message);
        console.trace();
    }        
        
}


const LogProduction = new function() {
    
    this.debug     = function() {};    
    this.trace     = function() {};
    this.info      = function() {};
    this.warning   = function() {};

    this.error = function(message) {
        console.log(message);
    }                
}


const Log = Config.debug ? LogDebug : LogProduction;
    
    