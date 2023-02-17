'use strict';


function Observer() {
    const handlers = [];


    this.add = function(handler) {
        const index = handlers.indexOf(handler);
        if (index > -1) return; 
        handlers.push(handler);
    }


    this.remove = function(handler) {
        const index = handlers.indexOf(handler);
        if (index > -1) handlers.splice(index, 1); 
    }


    this.call = function(...args) {
        handlers.forEach(h => h(...args));
    }


    this.isEmpty = function() {
        return handlers.length == 0;
    }


    this.contains = function(handler) {
        return handlers.indexOf(handler) >= 0;
    }
}