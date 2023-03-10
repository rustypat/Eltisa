'use strict';

function Statusbar() {

    // event handler 
    this.getEventHandler = (eventType) => null;
    this.getHtmlElement  = () => statusbarDiv;

    // gui elements
    const statusbarDiv  = GuiTools.createPanel(null, null, '20px', null, '395px', '0px', '80px', CLR_GlossyLight)
                                  .setPadding('2px').setPaddingLeft('15px');

    // available info texts
    let playerInfo;
    let blockInfo;
    let blockType;
    let systemInfo;
    let systemInfoTime;

    const playerColor    = "rgba(255, 255, 255, 0.2)";
    const oracleColor    = "rgba(150, 150, 150, 1)";
    const portalColor    = "rgba(0, 160, 190, 1)";
    const systemColor    = "rgba(255, 255, 0, 0.2)";


    this.setPlayerInfo = function(player, worldport) {
        const playerName = player.getName();
        const playerPos  = player.getPosition();
        const positionInfo = Math.floor(playerPos.x) + "|" + Math.floor(playerPos.y) + "|" + Math.floor(playerPos.z);

        const targetInfo = player.getTargetPlayerName();
        const fpsInfo    = worldport.getFramesPerSecond() + " fps";
        const moveInfo   = player.getMoveModeDescription();
    
        const distance = "&nbsp;&nbsp;&nbsp;&nbsp;";
        playerInfo = playerName + distance + positionInfo + distance + moveInfo + distance + fpsInfo + distance + targetInfo;
    }


    this.setBlockInfo = function(infotext, _blockType) {
        blockInfo = infotext;
        blockType = _blockType;
    }


    this.clearBlockInfo = function() {
        blockInfo = null;
    }


    this.setSystemInfo = function(infotext) {
        systemInfo = infotext;
        systemInfoTime = Date.now();
    }


    this.clearSystemInfo = function() {
        systemInfo = null;
    }


    this.updateInfo = function() {
        let text;
        let bgColor;
        if(systemInfo) {
            text = systemInfo;
            bgColor = systemColor;
            if( Date.now() - systemInfoTime >  Config.statusbarTimeout) systemInfo = null;
        }   
        else if(blockInfo) {
            text = blockInfo;
            if(blockType == Block.Oracle) bgColor = oracleColor;
            else if(blockType == Block.Portal) bgColor = portalColor;
            else bgColor = playerColor;
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