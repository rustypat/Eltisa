'use strict';


function Player(viewport, chunkStore) {

    const PlayerType         = { Unknown: 0, Visitor: 1, Citizen: 2, Administrator:4};
    const MoveType           = { Walk: 0, Run: 1, Train: 2, Fly: 3, Ghost: 4}
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
        setMoveModeToWalk();
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
            if(moveMode === MoveType.Train) {
                if(isOnRail()) moveMode = MoveType.Train;
                else moveMode++;
            }
            if(moveMode > MoveType.Train) moveMode = MoveType.Walk;
        }
        else if(type == PlayerType.Citizen) {
            moveMode++;
            if(moveMode === MoveType.Train) {
                if(isOnRail()) moveMode = MoveType.Train;
                else moveMode++;
            }
            if(moveMode > MoveType.Fly) moveMode = MoveType.Walk;
        }
        else if(type == PlayerType.Administrator) {
            moveMode++;
            if(moveMode === MoveType.Train) {
                if(isOnRail()) moveMode = MoveType.Train;
                else moveMode++;
            }
            if(moveMode > MoveType.Ghost) moveMode = MoveType.Walk;
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

            railMoveMode.deactivate();
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

    function setMoveModeToWalk() {
        if(moveMode == MoveType.Train) railMoveMode.deactivate();
        camera.speed           = 0.1;
        camera.checkCollisions = true;
        moveMode = MoveType.Walk;
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
            if(nextBlock) self.setPosition(nextBlock.x, nextBlock.y, nextBlock.z);
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


    this.getTargetPlayerName = function() {
        const pickInfo = viewport.pickCenterInfo();
        if (pickInfo.hit && pickInfo.distance < Config.maxTargetDistance) {
            if(pickInfo.pickedMesh.actor != null) {
                return pickInfo.pickedMesh.actor.name;
            }
        }
        return "";
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
    let self       = this;
    let nextTarget = null;
    let speed      = 0;
    let lastRailBlock;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Tools
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.activate = function() {
        camera.keysUp          = []; 
        camera.keysDown        = [];

        document.addEventListener('keydown', self.speedUp);
        document.addEventListener('keydown', self.slowDown);
    }

    this.deactivate = function() {
        lastRailBlock            = undefined;
        nextTarget               = null;
        speed                    = 0;

        camera.keysUp            = [38]; // ^
        camera.keysDown          = [40]; // v

        document.removeEventListener('keydown', self.speedUp);
        document.removeEventListener('keydown', self.slowDown);
    }



    this.speedUp = function(event) {
        if(KeyCode.getFromEvent(event) === KeyCode.ArrUp && speed < 0.25) speed+=0.001;
    }

    this.slowDown = function(event) {
        if(KeyCode.getFromEvent(event) === KeyCode.ArrDown) speed-=0.01;
        if(speed < 0)                                       speed = 0;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Move
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.move = function() {
        if(speed === 0)   return null;        //Check if the player moves
        if(!nextTarget) setNextRailBlock();   //Check if a new target must load
        
        //Check if there is no nextTarget
        if(nextTarget === null) {
            speed = 0;
            return;
        }

        //Check if a new target must load
        let disNextTargetAbs = Vector.calculateDistanceAbsolute(camera.position, nextTarget);
        if(disNextTargetAbs.x < 0.15 && disNextTargetAbs.y < 0.15 && disNextTargetAbs.z < 0.15) setNextRailBlock();

        //Check if there is no nextTarget
        if(nextTarget === null) {
            speed = 0;
            return;
        }
        
        //move
        let newX          = camera.position.x;
        let newY          = camera.position.y;
        let newZ          = camera.position.z;
        let disNextTarget = Vector.calculateDistanceAbsolute(camera.position, nextTarget);
        let reachTargetIn = undefined;
        let speedY        = speed;

        //define speedY
        if(disNextTarget.y > 0) {
            if(disNextTarget.x > 0)        reachTargetIn = disNextTarget.x/speed;
            else if(disNextTarget.z > 0)   reachTargetIn = disNextTarget.z/speed;
            if(reachTargetIn != undefined) speedY        = disNextTarget.y/reachTargetIn;
        }


        //x
        if(     nextTarget.x > camera.position.x && newX+speed < nextTarget.x) newX+=speed;
        else if(nextTarget.x < camera.position.x && newX-speed > nextTarget.x) newX-=speed;
        else                                                                   newX = nextTarget.x;

        //y
        if(     nextTarget.y > camera.position.y && newY+speedY < nextTarget.y) newY+=speedY;
        else if(nextTarget.y < camera.position.y && newY-speedY > nextTarget.y) newY-=speedY;
        else                                                                    newY = nextTarget.y;

        //z
        if(     nextTarget.z > camera.position.z && newZ+speed < nextTarget.z) newZ+=speed;
        else if(nextTarget.z < camera.position.z && newZ-speed > nextTarget.z) newZ-=speed;
        else                                                                   newZ = nextTarget.z;

    

        return {x: newX, y: newY, z: newZ};
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Get next Block
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function setNextRailBlock() {
        let posRailJet    = Vector.down(Vector.roundToFloor(camera.position));
        let dataRailJet   = chunkStore.getBlockData(posRailJet);

        //checks wich is the rail block (the block in wich you stand(RailsUp) or one below)
        if(!BlockData.isRail(dataRailJet)) posRailJet = Vector.down(posRailJet);

        //get possible block, select, and check
        let possibilities  = getPossibleNextRailBlock(posRailJet);
        let optionToReturn = selectNextBlockFromTwoOption(possibilities.option1, possibilities.option2, lastRailBlock, posRailJet);

        if(optionToReturn === null)                  {nextTarget = null; return;}
        if(!checkIfBlockIsOkAsTarget(optionToReturn)) nextTarget = null;
        else                                          nextTarget = optionToReturn;

        if(nextTarget === null) return;

        //set Things
        nextTarget = getCameraToRightPositionForARailBlock(nextTarget);
        lastRailBlock = posRailJet;
    }

    
    function getPossibleNextRailBlock(posRailJet){
        let dataRailJet  = chunkStore.getBlockData(posRailJet);
        let blockType    = BlockData.getDefinitionWithoutState(dataRailJet);
        let blockStage   = BlockData.getState(dataRailJet);
        let option1      = Vector.clone(posRailJet);
        let option2      = Vector.clone(posRailJet);
    
    
        //define the two options for the next block
        if(blockType === Block.RailsLeftRight || blockType === Block.RailSwitch && blockStage >=4) {
            
            //A rail curve and a railsswitch have the same curves, but the blockstage of the switch curves is 2 higher
            let blockStageUseHere = blockStage;
            if(blockType == Block.RailSwitch) blockStageUseHere = blockStage -2;

            if(blockStageUseHere === 2) {
                option1 = Vector.back(option1);
                option2 = Vector.right(option2);
            }
    
            if(blockStageUseHere === 3) {
                option1 = Vector.forward(option1);
                option2 = Vector.right(option2);
            }
    
            if(blockStageUseHere === 4) {
                option1 = Vector.left(option1);
                option2 = Vector.forward(option2);
            }
    
            if(blockStageUseHere === 5) {
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
        let blockDataUpOption1 = chunkStore.getBlockData(Vector.up(option1));
        let blockDataUpOption2 = chunkStore.getBlockData(Vector.up(option2));

        if(BlockData.isRail(blockDataUpOption1)) option1 = Vector.up(option1);
        if(BlockData.isRail(blockDataUpOption2)) option2 = Vector.up(option2);

        return {option1: option1, option2: option2};
    }
    
    function getCameraToRightPositionForARailBlock(blockPos) {
        let blockData    = chunkStore.getBlockData(blockPos);
        let blockType    = BlockData.getDefinitionWithoutState(blockData);
        let blockStage   = BlockData.getState(blockData);
    
        //The same for all
        blockPos   = Vector.up(blockPos);
        blockPos   = Vector.up(blockPos);
        blockPos.x = blockPos.x + 0.5;
        blockPos.z = blockPos.z + 0.5;
        blockPos.y = blockPos.y + 0.3;

        if(blockType === Block.RailsUp) {
            if(blockStage < 4)  blockPos.y = blockPos.y - 0.75;
            if(blockStage >= 4) blockPos.y = blockPos.y - 0.25;
         }
    
        return blockPos;
    }

    function selectNextBlockFromTwoOption(option1, option2, lastRailBlock, posRailJet) {
        let dataRailJet  = chunkStore.getBlockData(posRailJet);
        let blockType    = BlockData.getDefinitionWithoutState(dataRailJet);
        let blockStage   = BlockData.getState(dataRailJet);

        //If there is a last Rail block, take the next and this
        if(lastRailBlock !== undefined) {
            if(     Vector.equals(lastRailBlock, option1)) return option2; 
            else if(Vector.equals(lastRailBlock, option2)) return option1;
            else if(blockType === Block.RailSwitch) {
                if(blockStage === 2 || blockStage === 3 || blockStage === 5 || blockStage === 6 || blockStage === 7) return option1;
                if(blockStage === 0 || blockStage === 1 || blockStage === 4)                                         return option2;
            }
            return null; 
        }
    
        //If not a last Position is definded, take the block in that  
        let rotationY = camera.rotation.y % (Math.PI*2);
        let posJetRound = Vector.roundToFloor(camera.position);
        posJetRound.x += 0.5;
        posJetRound.z += 0.5;
        

        if(rotationY > (Math.PI + Math.PI/4*3) || rotationY < (Math.PI / 4)) {
            let jetFor = Vector.forward(posRailJet);
            if(Vector.equalsXZ(jetFor, option1)) return option1;
            if(Vector.equalsXZ(jetFor, option2)) return option2;
        }

        if(rotationY > (Math.PI / 4) && rotationY < (Math.PI /4 * 3)) {
            let jetRight = Vector.right(posRailJet);
            if(Vector.equalsXZ(jetRight, option1)) return option1;
            if(Vector.equalsXZ(jetRight, option2)) return option2;
        }

        if(rotationY > (Math.PI / 4 * 3) && rotationY < (Math.PI + Math.PI/4)) {
            let jetBack = Vector.back(posRailJet);
            if(Vector.equalsXZ(jetBack, option1)) return option1;
            if(Vector.equalsXZ(jetBack, option2)) return option2;
        }

        if(rotationY > (Math.PI + Math.PI/4) && rotationY < (Math.PI + Math.PI/4*3)) {
            let jetLeft = Vector.left(posRailJet);
            if(Vector.equalsXZ(jetLeft, option1)) return option1;
            if(Vector.equalsXZ(jetLeft, option2)) return option2;
        }

        return null;
    }

    function checkIfBlockIsOkAsTarget(position) {
        //check if there is block in the way
        if(!BlockData.isNoBlock(chunkStore.getBlockData(Vector.up(position))))            return false;
        if(!BlockData.isNoBlock(chunkStore.getBlockData(Vector.up(Vector.up(position))))) return false;

        //check if block is a Railblock
        if(!BlockData.isRail(chunkStore.getBlockData(position))) return false;

        return true;
    }
}

