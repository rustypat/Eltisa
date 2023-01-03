'use strict';

const CarouselInfo = new function() {

    this.LineTypes = { Nature: 1, Build: 2, Things: 3, Special: 4 };
    Object.freeze(this.LineTypes);
    
    const blockInfos = [];
    const lineInfos  = [];


    this.addBlockInfo = function(block, name, icon, description) {
        const info           = {};
        info.block           = block;
        info.name            = name;
        info.icon            = icon;
        if(description) info.description     = description;
        blockInfos[block]    = info;
    }


    this.getBlockInfo = function(block) {
        return blockInfos[block];
    }


    this.addLineInfo = function(lineType, name, VARARG_BLOCKS) {
        const line           = [];
        line.name            = name;
        line.lineType        = lineType;
        for(let i=2; i < arguments.length; i++) {
            line[i-2] = arguments[i];
        }
        lineInfos.push(line);
    }


    this.getLineInfo = function(index) {
        if( index >= lineInfos.length ) return null;
        return lineInfos[index];
    }


}