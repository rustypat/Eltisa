'use strict';


const ActorChangeType = { Login: 1, Moved: 2, Logout: 3 };

function ActorStore(_viewport) {

    const viewport    = _viewport;
    const actors      = new Map();
    

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // actor updating
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    this.handleActorMessage = function(actorMessage) {
        const key   = actorMessage.id;
        var actor    = actors.get(key);        
        if(actor) {
            viewport.updateActorMesh(actor, actorMessage);
        }
        else {
            actor = actorMessage;
            viewport.createActorMesh(actor);
            actors.set(key, actor);
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // actor maintenance
    ///////////////////////////////////////////////////////////////////////////////////////////////    
    
    var actorIterator        = null;
    var actorUpdateNeeded    = false;
    var centerChunkPosition  = Vector.create(0, 0, 0);
    var playerPosition       = Vector.create(0, 0, 0);

    this.updateCenterPosition = function(newPlayerPosition) {
        playerPosition               = newPlayerPosition;
        const newCenterChunkPosition = Vector.toChunkVector(newPlayerPosition);
        const hasChangedChunk = ! Vector.equals(centerChunkPosition, newCenterChunkPosition);
        if( hasChangedChunk ) {
            actorUpdateNeeded     = true;
            centerChunkPosition   = newCenterChunkPosition;
        }
    }


    this.updateActors = function(breakTime) {
        if(!actorIterator && !actorUpdateNeeded) return;

        if(!actorIterator) {
            actorIterator = actors.entries();
        }

        for(const [actorKey, actor] of actorIterator) {
            if(Vector.calculateEuclidDistance(actor, playerPosition) > Config.getEnvironmentBlockRadius() ) {
                viewport.removeActorMesh(actor);
                actors.delete(actorKey);
            }

            if(performance.now() > breakTime) return;            
        }
        actorIterator        = null;
        actorUpdateNeeded    = false;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // actor information
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    this.isOccupying = function(blockPos) {
        for(var actor in actors.values()) {
            const playerHeadBlock = Vector.roundToFloor(actor);
            const playerFeetBlock = Vector.down(playerHeadBlock);
            return Vector.equals(blockPos, playerHeadBlock) || Vector.equals(blockPos, playerFeetBlock);    
        }

        return false;
    }


    this.info = function() {
        console.log("ActorStore Info");
        console.log("    actors.size:            " + actors.size);
        console.log("    actorUpdateNeeded:      " + actorUpdateNeeded);
        console.log("    actorIterator:          " + actorIterator);
        console.log("    centerChunkPosition:    " + Vector.toString(centerChunkPosition));
        console.log("    playerPosition:         " + Vector.toString(playerPosition));
    }
    

}