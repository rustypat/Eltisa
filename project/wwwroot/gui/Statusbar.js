'Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved';
'use strict';

function Statusbar(body) {

    const standardBgColor    = "rgba(255, 255, 255, 0.2)";
    const infoBgColor        = "rgba(255, 255, 0, 0.5)";
    const oracleBgColor      = "rgba(150, 150, 150, 1)";

    const statusbarDiv       = document.createElement("div");
    var   statusText         = null;
    var   messageText        = null;
    var   messageStartTime   = null;
    var   messageShowTime    = null;

    initialize();

    function initialize() {
        statusbarDiv.id = "statusbar";
        body.appendChild(statusbarDiv);
    }


    this.update = function(player, viewport) {
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


    this.setStatus = function(player, viewport) {
        const playerInfo = player.getName();
        const playerPos  = player.getPosition();
        const positionInfo = Math.floor(playerPos.x) + "|" + Math.floor(playerPos.y) + "|" + Math.floor(playerPos.z);

        const targetInfo = player.getTargetInfo();
        const fpsInfo    = viewport.getFramesPerSecond() + " fps";
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
    
}