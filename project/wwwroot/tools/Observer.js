'use strict';


function Observer() {
    const handlers = [];


    this.add = function(handler) {
        handlers.push(handler);
    }


    this.remove = function(handler) {
        const index = handlers.indexOf(handler);
        if (index > -1) handlers.splice(index, 1); 
    }


    this.call = function(...args) {
        handlers.forEach(h => h(...args));
    }
}