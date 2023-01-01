'Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved';
'use strict';


const Policy = new function() {


    this.canModifyBlock = function(player, blockPos) {
        if( Config.runMode() == RunMode.Eltisa) {
            if ( player.isCitizen()       ) return true;
            if ( player.isAdministrator() ) return true;
            if ( player.isVisitor()       ) return blockPos.x > 0 && blockPos.y > 0;
            return false;
        }
        else if( Config.runMode() == RunMode.Server) {
            if ( player.isCitizen()       ) return true;
            if ( player.isAdministrator() ) return true;
            return false;
        }
        else if( Config.runMode() == RunMode.Develop) {
            if ( player.isCitizen()       ) return true;
            if ( player.isAdministrator() ) return true;
            return false;
        }
        return false;
    }


    this.isEltisaServer = function() {
        return runsEltisaMode();
    }


    
}
