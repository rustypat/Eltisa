'use strict';


const Policy = new function() {


    this.canModifyBlock = function(player, blockPos) {
        if ( player.isCitizen()       ) return true;
        if ( player.isAdministrator() ) return true;
        if ( player.isVisitor()       ) return blockPos.x > 0 && blockPos.y > 0;
    }


    this.isEltisaServer = function() {
        return runsEltisaMode();
    }


    
}
