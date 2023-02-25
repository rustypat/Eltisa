'use strict';


const ActorChangeType = { Login: 1, Moved: 2, Logout: 3 };

function ActorStore(_worldport) {

    const worldport    = _worldport;
    const actors       = new Map();
    

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // actor updating
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    this.handleActorMove = function(id, x, y, z, orientation) {
        const actor    = actors.get(id);        
        if(!actor) console.log("ERROR Actor not defined");
        worldport.updateActorMesh(actor, x, y, z, orientation);
    }


    this.handleActorJoined = function(id, name, type, look) {
        if(id === player.getId()) return;
        const actor = new Actor(id, name, type, look, 0, 0, 0, 0);
        worldport.createActorMesh(actor);
        actors.set(id, actor);
    }
    
    this.handleActorList = function(actorsServer) {
        actorsServer.forEach(actor => {
            if(actors.get(actor.id)) return;
            if(actor.id === player.getId()) return;
            worldport.createActorMesh(actor);
            actors.set(actor.id, actor);
        });
    }

    this.handleActorLeft = function(id, name) {
        worldport.removeActorMesh(actors.get(id));
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


function Actor(id, name, type, look, x, y, z, rotation) {
    this.id   = id;
    this.name = name;
    this.type = type;
    this.look = look;
    this.mesh = undefined;
    this.x    = x;
    this.y    = y;
    this.z    = z;
    this.rotation = rotation;
}

