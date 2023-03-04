"use strict"


function VideoChatStore() {
    const self  =  this;
    let local;
    let remote  =  [];



    this.addLocal = function() {
        if(local) return;
        local = new Local();
    }


    this.removeLocal = function() {
        if(!local) return;
        local.dispose();
        local = null;
    }


    this.addRemote = function() {

    }


    this.removeRemote = function() {

    }
    
}


function Local() {
    let video;
    let videoStream;

    this.dispose = function() {
        
    }
}


function Remote() {
    let video;
    let videoStream;
    let remoteName;
    let remoteId;    
}
