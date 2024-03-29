'use strict';


const RunMode = { Develop:'Develop', Server:'Server', Eltisa:'Eltisa' };

const Config = new function() {
    const self                       = this;
    
    this.version                     = "0.29";    
    this.debug                       = true;

    this.chunkSize                   = 16;
    this.regionSize                  = 16;
    
    this.regionRadius                = 2048;
    this.regionRadiusVertical        = 64;
    this.chunkRadius                 = this.regionRadius * this.regionSize;
    this.chunkRadiusVertical         = this.regionRadiusVertical * this.regionSize;
    this.worldRadius                 = this.chunkRadius * this.chunkSize;
    this.worldRadiusVertical         = this.chunkRadiusVertical * this.chunkSize;
    
    this.environmentChunkRadiusMin   = 16;             // messured in chunks
    this.environmentChunkRadiusMax   = 32;             // messured in chunks
    
    this.maxMessageLength            = 256 * 1024;     // to send over websocket to server
    
    this.maxSwitches                 = 5;
    this.maxChatMessageLength        = 150;
    this.maxTargetDistance           = 20;
    this.videoChatTimeOut            = 30 * 1000;      // how long a phone call is ringing
    this.statusbarTimeout            = 10 * 1000;      // how long system infos are shown in the status bar

    
    if(this.debug) this.randomStartRange =  0;
    else           this.randomStartRange = 20;

    const mutables                   = {};
    mutables.environmentChunkRadius  = this.environmentChunkRadiusMin;
    mutables.environmentBlockRadius  = this.environmentChunkRadiusMin * this.chunkSize;

    this.getEnvironmentChunkRadius = function() {
        return mutables.environmentChunkRadius;
    }


    this.getEnvironmentBlockRadius = function() {
        return mutables.environmentBlockRadius;
    }


    this.toggleEnvironmentRadius = function() {
        if(mutables.environmentChunkRadius == this.environmentChunkRadiusMin) {
            mutables.environmentChunkRadius  = this.environmentChunkRadiusMax;
            mutables.environmentBlockRadius  = this.environmentChunkRadiusMax * this.chunkSize;
        }
        else {
            mutables.environmentChunkRadius  = this.environmentChunkRadiusMin;
            mutables.environmentBlockRadius  = this.environmentChunkRadiusMin * this.chunkSize;
        }
    }


    this.info = function() {
        console.log("Config Info");
        console.log("    version:                " + this.version );
        console.log("    environmentChunkRadius: " + this.getEnvironmentChunkRadius() );
    }

    
}

Object.freeze(Config);
