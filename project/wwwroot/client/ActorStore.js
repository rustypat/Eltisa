'use strict';


const ActorChangeType = { Login: 1, Moved: 2, Logout: 3 };

function ActorStore(_worldport) {

    const worldport    = _worldport;
    const actors      = new Map();
    

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // actor updating
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    this.handleActorMessage = function(actorMessage) {
        const key   = actorMessage.id;
        let actor    = actors.get(key);        
        if(actor) {
            worldport.updateActorMesh(actor, actorMessage);
        }
        else {
            actor = actorMessage;
            worldport.createActorMesh(actor);
            actors.set(key, actor);
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // actor maintenance
    ///////////////////////////////////////////////////////////////////////////////////////////////    
    
    let actorIterator        = null;
    let actorUpdateNeeded    = false;
    let centerChunkPosition  = Vector.create(0, 0, 0);
    let playerPosition       = Vector.create(0, 0, 0);

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
                worldport.removeActorMesh(actor);
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
        for(let actor in actors.values()) {
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