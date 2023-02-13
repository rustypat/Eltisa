'use strict';

function Statusbar() {

    // event handler 
    this.getEventHandler = (eventType) => null;
    this.getHtmlElement  = () => statusbarDiv;

    // gui elements
    const statusbarDiv       = document.createElement("div");
    statusbarDiv.id = "statusbar";

    // available info texts
    let playerInfo;
    let chatInfo;
    let blockInfo;
    let blockType;
    let systemInfo;

    const playerColor    = "rgba(255, 255, 255, 0.2)";
    const chatColor      = "rgba(255, 255, 255, 0.2)";
    const oracleColor    = "rgba(150, 150, 150, 1)";
    const portalColor    = "rgba(0, 160, 190, 1)";
    const systemColor    = "rgba(255, 255, 255, 0.2)";

    // old staff, to be removed
    const standardBgColor    = "rgba(255, 255, 255, 0.2)";
    const infoBgColor        = "rgba(255, 255, 0, 0.5)";
    const oracleBgColor      = "rgba(150, 150, 150, 1)";

    let   statusText         = null;
    let   messageText        = null;
    let   messageStartTime   = null;
    let   messageShowTime    = null;



    this.update = function() {
        if (messageText) {
            if(performance.now() - messageStartTime > messageShowTime) {
                this.clearMessage();
            }
        }

        if (messageText == null) {
            updateText(statusText);
        }
        else {
            updateText(messageText);
        }        
    }


    this.setInfoMessage = function(text, showTime) {
        if (messageText == text) return;
        messageText          = text;
        messageStartTime     = performance.now();
        if (showTime) messageShowTime = showTime;
        else          messageShowTime = Config.infoShowTime;
        statusbarDiv.style.backgroundColor = infoBgColor;
    }


    this.setOracleMessage = function(text) {
        if (messageText == text) return;
        messageText          = text;
        messageStartTime     = performance.now();
        messageShowTime      = Config.oracleShowTime;
        statusbarDiv.style.backgroundColor = oracleBgColor;
    }


    this.clearMessage = function(message) {
        if (message && messageText!=message) return;
        messageText          = null;
        messageStartTime     = null;
        messageShowTime      = null;
        statusbarDiv.style.backgroundColor = standardBgColor;
    }


    this.setStatus = function(player, worldport) {
        const playerInfo = player.getName();
        const playerPos  = player.getPosition();
        const positionInfo = Math.floor(playerPos.x) + "|" + Math.floor(playerPos.y) + "|" + Math.floor(playerPos.z);

        const targetInfo = player.getTargetInfo();
        const fpsInfo    = worldport.getFramesPerSecond() + " fps";
        const moveInfo   = player.getMoveModeDescription();
    
        const distance = "&nbsp;&nbsp;&nbsp;&nbsp;";
        if(Config.debug) {
            statusText = playerInfo + distance + positionInfo + distance + moveInfo + distance + fpsInfo + distance + targetInfo;
        }
        else {
            statusText = playerInfo + distance + positionInfo + distance + moveInfo + distance + targetInfo;
        }
    }


    function updateText(text) {
        if( text != statusbarDiv.innerHTML) {
            statusbarDiv.innerHTML = text;
        }
    }

    

    this.setPlayerInfo = function(player, worldport) {
        const playerName = player.getName();
        const playerPos  = player.getPosition();
        const positionInfo = Math.floor(playerPos.x) + "|" + Math.floor(playerPos.y) + "|" + Math.floor(playerPos.z);

        const targetInfo = player.getTargetInfo();
        const fpsInfo    = worldport.getFramesPerSecond() + " fps";
        const moveInfo   = player.getMoveModeDescription();
    
        const distance = "&nbsp;&nbsp;&nbsp;&nbsp;";
        if(Config.debug) {
            playerInfo = playerName + distance + positionInfo + distance + moveInfo + distance + fpsInfo + distance + targetInfo;
        }
        else {
            playerInfo = playerName + distance + positionInfo + distance + moveInfo + distance + targetInfo;
        }
    }


    this.setBlockInfo = function(infotext, _blockType) {
        blockInfo = infotext;
        blockType = _blockType;
    }


    this.clearBlockInfo = function() {
        blockInfo = null;
    }


    this.updateInfo = function() {
        let text;
        let bgColor;
        if(systemInfo) {
            text = systemInfo;
            bgColor = systemColor;
        }   
        else if(blockInfo) {
            text = blockInfo;
            if(blockType == Block.Oracle) bgColor = oracleColor;
            else if(blockType == Block.Portal) bgColor = portalColor;
            else bgColor = playerColor;
        }
        else if(chatInfo)  {
            text = chatInfo;
            bgColor = chatColor;
        }
        else {
            text = playerInfo;
            bgColor = playerColor;
        }
        
        if( text != statusbarDiv.innerHTML) {
            statusbarDiv.innerHTML = text;
            statusbarDiv.style.backgroundColor = bgColor;
        }
    }

}