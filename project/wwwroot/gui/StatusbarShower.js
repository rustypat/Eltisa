'use strict';


function OracleShower(chunkStore, statusbar, server) {

    var showOracle;
    var text;

    this.updateStatusbar = function(newText) {
        text = newText;
        statusbar.setOracleMessage(text);
    }


    this.handleBlockFocus = function(blockPos) {
        const blockData      = chunkStore.getBlockData(blockPos);        
        
        if( BlockData.isOracleUsed(blockData) ) {
            if (!showOracle) {
                showOracle   = true;
                server.requestReadResource(blockPos, Block.Oracle, ""); 
                return true;
                }
        }
        else { // clear message if focus leaves block
            if (showOracle) {   
                if (isValidString(text)) statusbar.clearMessage(text);
                showOracle   = false;
                return false;
            }
        }
        return false;
    }

}


function PortalShower(chunkStore, statusbar, server) {

    var showDescription;
    var text;

    this.handleBlockResourceMessage = function(resourceMessage) {
        const target         = JSON.parse(resourceMessage.text);
        text                 = target.description;
        statusbar.setOracleMessage(text);
    }


    this.handleBlockFocus = function(blockPos) {
        const blockData      = chunkStore.getBlockData(blockPos);        
        
        if( BlockData.isPortal(blockData) ) {
            if (!showDescription) {
                showDescription   = true;
                server.requestBlockResource(blockPos, Block.Portal); 
                return true;
                }
        }
        else {  // clear message if focus leaves block
            if (showDescription) {   
                if (isValidString(text)) statusbar.clearMessage(text);
                showDescription   = false;
                return false;
            }
        }
        return false;
    }
        
}
