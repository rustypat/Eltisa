'use strict';


function Player(viewport, chunkStore) {

    const PlayerType         = { Unknown: 0, Visitor: 1, Citizen: 2, Administrator:4};
    const MoveType           = { Walk: 0, Run: 1, Fly: 2, Ghost: 3, Train: 4}
    const self               = this;

    // player data
    let id                   = 0;
    let name                 = null;
    let password             = null;
    let type                 = PlayerType.Unknown;
    let moveMode             = MoveType.Walk;

    // camera
    const walkEllipsoid      = new BABYLON.Vector3(0.35, 0.8, 0.35);
    const ladderEllipsoid    = new BABYLON.Vector3(0.35, 0.4, 0.35);
    const ellipsoidOffset    = new BABYLON.Vector3(0, 0.3, 0);

	const camera             = viewport.getCamera();
    camera.position          = new BABYLON.Vector3(0, 0, 0);
    camera.minZ              = 0.2;
    camera.maxZ              = 1000;
    camera.applyGravity      = true;
    camera.ellipsoid         = walkEllipsoid;
    camera.ellipsoidOffset   = ellipsoidOffset;
    camera.checkCollisions   = true;
    camera.speed             = 0.1;
    camera.inertia           = 0.8;
    camera.angularSensibility= 5000;

    camera.keysUp            = [38]; // ^
    camera.keysDown          = [40]; // v
    camera.keysLeft          = [37]; // <-
    camera.keysRight         = [39]; // ->

    // jump
    let jumpSpeed            = NaN;
    const jumpDeceleration   = 0.015;
    const initialJumpSpeed   = 0.2;
    
    // detecting changes
    let lastPosition         = Vector.create(0, 0, 0);
    let lastReportedPosition = Vector.create(0, 0, 0);


    let railMoveMode         = new RailMoveMode(chunkStore, camera);
    

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // data
    ///////////////////////////////////////////////////////////////////////////////////////////////


    this.init = function(_id, _type, _name) {
        name     = _name;
        id       = _id;
        type     = _type;
        moveMode = MoveType.Walk;
    }


    this.setName = function(newName) {
        name = newName;
    }


    this.getName = function() {
        return name;
    }


    this.setId = function(newId) {
        assert(id==0);
        id = newId;
    }


    this.getId = function() {
        return id;
    }


    this.setType = function(newType) {
        type = newType;
    }


    this.isVisitor = function() {
        if( type == PlayerType.Unknown ) {
            return !isValidString(password);
        }
        return type == PlayerType.Visitor;
    }


    this.isCitizen = function() {
        if( type == PlayerType.Unknown ) {
            return isValidString(password);
        }
        return type == PlayerType.Citizen;
    }


    this.isAdministrator = function() {
        if( type == PlayerType.Unknown ) {
            return false;
        }
        return type == PlayerType.Administrator;
    }


    this.setCredentials = function(_name, _password) {
        name       = _name;
        password   = _password;
    }


    this.hasCredentials = function() {
        if( !name     ) return false;
        if( !password ) return false;
        return true;
    }

    

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // moving
    ///////////////////////////////////////////////////////////////////////////////////////////////

	this.activateControls = function() {
		camera.attachControl(document, true);
	}


	this.deactivateControls = function() {
		camera.detachControl(document);
    }    
    
    
    this.toogleMoveMode = function() {
        if(type == PlayerType.Visitor) {
            moveMode++;
            if(moveMode > MoveType.Run) moveMode = MoveType.Walk;
        }
        else if(type == PlayerType.Citizen) {
            moveMode++;
            if(moveMode > MoveType.Fly) moveMode = MoveType.Walk;
        }
        else if(type == PlayerType.Administrator) {
            moveMode++;
            if(moveMode > MoveType.Ghost) {
                if(moveMode > MoveType.Train) moveMode = MoveType.Walk;
                else if(isOnRail()) moveMode = MoveType.Train;
                     else moveMode = MoveType.Walk;
            }
        }        

        if(moveMode == MoveType.Walk) {
            camera.speed           = 0.1;
            camera.checkCollisions = true;

            railMoveMode.deactivate();

        }        
        if(moveMode == MoveType.Run) {
            camera.speed           = 0.25;
            camera.checkCollisions = true;
        }        
        else if(moveMode == MoveType.Fly) {
            camera.speed           = 0.5;
            camera.checkCollisions = true;
        }
        else if(moveMode == MoveType.Ghost) {
            camera.speed           = 2;
            camera.checkCollisions = false;
        }

        else if(moveMode == MoveType.Train) {
            camera.speed           = 0.5;
            camera.checkCollisions = true;
            
            railMoveMode.activate();
        }
    }


    this.getMoveModeDescription = function() {
        if(moveMode == MoveType.Walk)       return "walk";
        else if(moveMode == MoveType.Run)   return "run";
        else if(moveMode == MoveType.Fly)   return "fly";
        else if(moveMode == MoveType.Ghost) return "ghost";
        else if(moveMode == MoveType.Train) return "train";
        else                                return "unknown move mode " + moveMode;
        
    }

    
    this.sendMove = function(server) {
        if( ! Vector.equals(camera.position, lastReportedPosition) ) {
            Vector.copy(lastReportedPosition,  camera.position);
            server.requestMoveActor(camera.position, camera.rotation);
        }
    }


    this.hasPosition = function() {
        if( camera.position.x == 0 && camera.position.y == 0 && camera.position.z == 0 ) return false;
        return true;
    }


    this.getPosition = function() {
        return camera.position;
    }


    this.getRotation = function() {
        return camera.rotation;
    }


    this.setPosition = function(x, y, z) {
        if( isNaN(x) || isNaN(y) || isNaN(z) || x==null || y==null || z==null ) {
            x = 0;
            y = 0;
            z = 0;
        }
        else {
            x = Number(x);
            y = Number(y);
            z = Number(z);
        }
                
        camera.position.x    = x;
        camera.position.y    = y;
        camera.position.z    = z;

        lastPosition.x       = x;
        lastPosition.y       = y;
        lastPosition.z       = z;
    }

    
    this.jump = function() {
        if( canJump() && canMoveUpward() ) {
            jumpSpeed = initialJumpSpeed;
        }
    }


    function isJumping() {
        return !isNaN(jumpSpeed);
    }


    this.update = function() {
        if(moveMode === MoveType.Train && !isOnRail()) {
            self.toogleMoveMode();
        }

        if(moveMode === MoveType.Train) {
            let nextBlock = railMoveMode.move();
            if(nextBlock !== null) self.setPosition(nextBlock.x, nextBlock.y, nextBlock.z);
        }

        if( isOnLadder() ) {
            camera.ellipsoid = ladderEllipsoid;
        }
        else {
            camera.ellipsoid = walkEllipsoid;
        }

        // update graviti
        if( moveMode == MoveType.Fly || moveMode == MoveType.Ghost || moveMode == MoveType.Train) {
            if( camera.applyGravity )                 camera.applyGravity = false;
            if( camera.ellipsoid != walkEllipsoid )   camera.ellipsoid    = walkEllipsoid;
        }
        else if( isJumping() ) {
            if( camera.applyGravity )                 camera.applyGravity = false;
            if( camera.ellipsoid != walkEllipsoid )   camera.ellipsoid    = walkEllipsoid;
        }
        else if( isOnLadder() ) {
            if( camera.applyGravity )                 camera.applyGravity = false;            
            if( camera.ellipsoid != ladderEllipsoid ) camera.ellipsoid    = ladderEllipsoid;
        }
        else {
            if( !camera.applyGravity )                camera.applyGravity = true;                        
            if( camera.ellipsoid != walkEllipsoid)    camera.ellipsoid    = walkEllipsoid;
        }

        if( camera.applyGravity ) {
            camera._updatePosition(); 
        }

        // update jump
        if( isJumping() ) {
            if( canMoveUpward() ) {
                camera.update();
                camera.position.y += jumpSpeed;    
            }
            jumpSpeed -= jumpDeceleration;
            if(jumpSpeed < -0) {
                jumpSpeed = NaN;
            }
        }

        // update move
        camera.update();

        // can only go to another chunk if it is allready loaded
        if( ! Vector.equals(camera.position, lastPosition) ) {
            if( chunkStore.hasValidChunkEnvironment(camera.position) ) {
                Vector.copy(lastPosition,  camera.position);                       // accept move
            }
            else{
                Vector.copy(camera.position, lastPosition);                        // revert move     
            }     
        }            
    }


    function canJump() {
        if(moveMode == MoveType.Fly)                                return false;
        if(moveMode == MoveType.Ghost)                              return false;
        if(moveMode == MoveType.Train)                              return false;
        if( isJumping() )                                           return false;         // is allready jumping
        if( moveMode != MoveType.Walk && moveMode != MoveType.Run && moveMode) return false;
        return true;

        // let pos = Vector.roundToFloor(camera.position);
        // pos     = Vector.down(pos);
        // pos     = Vector.down(pos);
        // return chunkStore.isSolid(pos);
    }
    

    const upwardVector = new BABYLON.Vector3(0,1,0);

    function canMoveUpward() {
        const upwardRay = new BABYLON.Ray(camera.position, upwardVector, 1);
        const pickInfo  = viewport.pickWithRay(upwardRay);
        return !pickInfo.hit || pickInfo.distance > 0.4;        
    }


    this.isOccupying = function(blockPos) {
        const playerHeadBlock = Vector.roundToFloor(camera.position);
        const playerFeetBlock = Vector.down(playerHeadBlock);
        return Vector.equals(blockPos, playerHeadBlock) || Vector.equals(blockPos, playerFeetBlock);
    }


    function isOnLadder() {
        const blockPosHead  = Vector.roundToFloor(camera.position);
        const blockDataHead = chunkStore.getBlockData(blockPosHead); 
        const blockPosFeet  = Vector.down(blockPosHead);
        const blockDataFeet = chunkStore.getBlockData(blockPosFeet); 
        return BlockData.isLadder(blockDataHead) || BlockData.isLadder(blockDataFeet);
    }

    function isOnRail() {
        const blockPosHead       = Vector.roundToFloor(camera.position);
        const blockPosFeet       = Vector.down(blockPosHead);
        const blockPosUnderFeet  = Vector.down(blockPosFeet);
        const blockDataFeet      = chunkStore.getBlockData(blockPosFeet);
        const blockDataUnderFeet = chunkStore.getBlockData(blockPosUnderFeet);  
        

        if(BlockData.isRail(blockDataUnderFeet) === true) return true;
        else if(BlockData.isRail(blockDataFeet) === true) return true;
        return false;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // targeting
    ///////////////////////////////////////////////////////////////////////////////////////////////

    this.getTargetPoint = function() {
        const pickInfo = viewport.pickCenterInfo();
        if (pickInfo.hit && pickInfo.distance < Config.maxTargetDistance) {
            return pickInfo.pickedPoint;
        }
        else {
            return null;
        }
    }


    this.getTargetPos = function() {
        const pickInfo = viewport.pickCenterInfo();
        if(!pickInfo.hit) return null;
        if(pickInfo.distance > Config.maxTargetDistance) return null;
        const targetPos      = pickInfo.pickedPoint;
        const direction      = self.getDirection().scale(+0.01);
        const inTargetPos    = targetPos.add(direction);
        const blockPos       = Vector.roundToFloor(inTargetPos);
        return blockPos;
    }


    this.getTargetInfo = function() {
        const pickInfo = viewport.pickCenterInfo();
        if (pickInfo.hit && pickInfo.distance < Config.maxTargetDistance) {
            if(pickInfo.pickedMesh.actor != null) {
                return pickInfo.pickedMesh.actor.name;
            }
        }
        return '';
    }


    this.targetIsActor = function() {
        const pickInfo = viewport.pickCenterInfo();
        if (pickInfo.hit && pickInfo.distance < Config.maxTargetDistance) {
            return pickInfo.pickedMesh.actor != null;
        }
        else return false;
    }


    const directionVector    = new BABYLON.Vector3(0,0,1)

    this.getDirection = function() {
        return camera.getDirection( directionVector );
    }
}


function RailMoveMode(chunkStore, camera) {
    let lastRailPosition = undefined;
    let speed            = 0;
    let nextTarget       = undefined;
    let self             = this;

    ////////////////////////////////////////////////////////////////////////////
    //Remove after found issue
    ///////////////////////////////////////////////////////////////////////////

    this.move = function() {
        //Check if check nextTarget must load
        if(speed <= 0) return null;
        if(nextTarget === undefined) nextTarget = getNextTarget();
        let disNextTargetAbs = Vector.calculateDistanceAbsolute(camera.position, nextTarget);
        if(disNextTargetAbs.x < 0.15 && disNextTargetAbs.y < 0.15 && disNextTargetAbs.z < 0.15) nextTarget = getNextTarget();


        //move
        let newX          = camera.position.x;
        let newY          = camera.position.y;
        let newZ          = camera.position.z;
        let disNextTarget = Vector.calculateDistanceAbsolute(camera.position, nextTarget);
        let reachTargetIn = undefined;
        let speedY        = speed;

        if(disNextTarget.y > 0.15) {
            if(disNextTarget.x > 0.15) reachTargetIn = disNextTarget.x/speed;
            if(disNextTarget.z > 0.15) reachTargetIn = disNextTarget.z/speed;
            if(reachTargetIn != undefined) speedY    = disNextTarget.y/reachTargetIn;
        }

        if(disNextTarget.x > 0.15 && nextTarget.x > camera.position.x)  newX+=speed;
        if(disNextTarget.x > 0.15 && nextTarget.x < camera.position.x)  newX-=speed;

        if(disNextTarget.y > 0.15 && nextTarget.y > camera.position.y)  newY+=speedY;
        if(disNextTarget.y > 0.15 && nextTarget.y < camera.position.y)  newY-=speedY;

        if(disNextTarget.z > 0.15 && nextTarget.z > camera.position.z)  newZ+=speed;
        if(disNextTarget.z > 0.15 && nextTarget.z < camera.position.z)  newZ-=speed;

        return {x: newX, y: newY, z: newZ};
    }


    this.activate = function() {
        camera.keysUp          = []; 
        camera.keysDown        = [];

        document.addEventListener('keydown', self.speedUp);
        document.addEventListener('keydown', self.slowDown);
    }

    this.deactivate = function() {
        lastRailPosition = undefined;
        speed = 0;
        nextTarget = undefined;

        camera.keysUp            = [38]; // ^
        camera.keysDown          = [40]; // v

        document.removeEventListener('keydown', self.speedUp);
        document.removeEventListener('keydown', self.slowDown);
    }



    this.speedUp = function(event) {
        const keyCode = KeyCode.getFromEvent(event);
        if(keyCode === KeyCode.ArrUp && speed < 0.15) speed+=0.001;
    }

    this.slowDown = function(event) {
        const keyCode = KeyCode.getFromEvent(event);
        if(keyCode === KeyCode.ArrDown) speed-=0.01;
        if(speed < 0) speed = 0;
    }

    function getNextTarget() {
        const blockPosFeet       = Vector.down(Vector.roundToFloor(camera.position));
        const blockDataFeet      = chunkStore.getBlockData(blockPosFeet);
        let   blockPosRailJet    = blockPosFeet;
        let   blockDataRailJet   = chunkStore.getBlockData(blockPosRailJet);

        //checks wich is the rail block (the block in wich you stand(RailsUp) or one below)
        if(!BlockData.isRail(blockDataRailJet)) blockPosRailJet = Vector.down(blockPosRailJet);

        //get next block
        let nextBlock = getNextRailBlock(chunkStore, blockPosRailJet, lastRailPosition);
        
        //check if there is a next block
        if(nextBlock === null) return;

        //set lastRailPosition
        lastRailPosition = getCameraToRightPositionForARailBlock(blockPosRailJet, chunkStore); 

        //set new Position
        return nextBlock;
    }

    
    function getNextRailBlock(chunkStore, blockPosRailJet, lastRailPosition){
        let blockDataRailJet = chunkStore.getBlockData(blockPosRailJet);
        let blockType    = BlockData.getDefinitionWithoutState(blockDataRailJet);
        let blockStage   = BlockData.getState(blockDataRailJet);
        let option1 = Vector.clone(blockPosRailJet);
        let option2 = Vector.clone(blockPosRailJet);
    
    
        //define the two options for the next block
        if(blockType === Block.RailsLeftRight) {
            if(blockStage === 2) {
                option1 = Vector.back(option1);
                option2 = Vector.right(option2);
            }
    
            if(blockStage === 3) {
                option1 = Vector.forward(option1);
                option2 = Vector.right(option2);
            }
    
            if(blockStage === 4) {
                option1 = Vector.left(option1);
                option2 = Vector.forward(option2);
            }
    
            if(blockStage === 5) {
                option1 = Vector.back(option1);
                option2 = Vector.left(option2);
            }
        }
    
        if(blockType === Block.RailSwitch) {
            if(blockStage === 4) {
                option1 = Vector.back(option1);
                option2 = Vector.right(option2);
            }
    
            if(blockStage === 5) {
                option1 = Vector.forward(option1);
                option2 = Vector.right(option2);
            }
    
            if(blockStage === 6) {
                option1 = Vector.left(option1);
                option2 = Vector.forward(option2);
            }
    
            if(blockStage === 7) {
                option1 = Vector.back(option1);
                option2 = Vector.left(option2);
            }
        }
    
    
        if(blockType === Block.RailSwitch     && blockStage < 4 ||
           blockType === Block.RailsLeftRight && blockStage < 2 ||
           blockType === Block.RailsUp) {
                if(blockStage === 0 || blockStage === 2 || blockStage === 4 || blockStage === 6) {
                    option1 = Vector.left(option1);
                    option2 = Vector.right(option2);
                }
    
                if(blockStage === 1 || blockStage === 3 || blockStage === 5 || blockStage === 7) {
                    option1 = Vector.back(option1);
                    option2 = Vector.forward(option2);
                }
    
                //All Railsup block is on one side the next block one block deeper
                if(blockType === Block.RailsUp && blockStage < 4){
                    if(blockStage === 0 || blockStage === 1) option2 = Vector.down(option2);
                    if(blockStage === 2 || blockStage === 3) option1 = Vector.down(option1);
                }
        }
    
        //Check if the rail line changes on the y axes (with RailUp)
        let blockDataOption1 = chunkStore.getBlockData(option1);
        let blockDataOption2 = chunkStore.getBlockData(option2);

    
        if(BlockData.isRail(blockDataOption1) === false) option1 = Vector.up(option1);
        if(BlockData.isRail(blockDataOption2) === false) option2 = Vector.up(option2);
    
    
        //check if there is a rail block
        blockDataOption1 = chunkStore.getBlockData(option1);
        blockDataOption2 = chunkStore.getBlockData(option2);
    
        if(BlockData.isRail(blockDataOption1) === false) return null;
        if(BlockData.isRail(blockDataOption2) === false) return null;
    
        //set Camera Up
        option1 = getCameraToRightPositionForARailBlock(option1, chunkStore);
        option2 = getCameraToRightPositionForARailBlock(option2, chunkStore);
    
        //check witch is the next block and witch is the block before if last position is defined
        if(lastRailPosition !== undefined) {
    
            if(Vector.equals(lastRailPosition, option1)) return option2; 
            if(Vector.equals(lastRailPosition, option2)) return option1; 
        }
    
        return option1;
    }
    
    function getCameraToRightPositionForARailBlock(blockPos, chunkStore) {
        let blockData    = chunkStore.getBlockData(blockPos);
        let blockType    = BlockData.getDefinitionWithoutState(blockData);
        let blockStage   = BlockData.getState(blockData);
    
        if(blockType === Block.RailSwitch || blockType === Block.RailsLeftRight) {
            blockPos   = Vector.up(blockPos);
            blockPos   = Vector.up(blockPos);
            blockPos.x = blockPos.x + 0.5;
            blockPos.z = blockPos.z + 0.5;
            blockPos.y = blockPos.y + 0.3;
         }
    
         if(blockType === Block.RailsUp) {
            if(blockStage < 4){
                blockPos   = Vector.up(blockPos);
                blockPos.x = blockPos.x + 0.5;
                blockPos.z = blockPos.z + 0.5;
                blockPos.y = blockPos.y + 0.55; //0.3 + 0.25
            }
    
            if(blockStage >= 4){
                blockPos   = Vector.up(blockPos);
                blockPos.x = blockPos.x + 0.5;
                blockPos.z = blockPos.z + 0.5;
                blockPos.y = blockPos.y + 1.05; //0.3 + 0.75
            }
         }
    
        return blockPos;
    }
}

