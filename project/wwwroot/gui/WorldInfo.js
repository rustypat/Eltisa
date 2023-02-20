'use strict';


const Orientation = { Normal: 0,  Turn90: 1, Turn180: 2, Turn270: 3, Flip: 4, FlipAndTurn90: 5, FlipAndTurn180: 6, FlipAndTurn270: 7 };

Orientation.switchHorizontal = function(orientation) {
    if(orientation == this.Flip) return this.Normal;
    else return this.Flip;
}
Object.freeze(Orientation);



const WorldInfo = new function() {

    const atlasWidth         =  700;
    const atlasHeight        = 1750;
    const texturesPerRow     = 10;
    const textureWidth       = 70;
    const innerTextureWidth  = 64;
    const viewInfos          = [];
    const d                  = 0.1;   // door thickness
    
    const leftNormales       = createNormales(-1,0,0);
    const rightNormales      = createNormales( 1,0,0);
    const backNormales       = createNormales(0,0,-1);
    const frontNormales      = createNormales(0,0, 1);
    const bottomNormales     = createNormales(0,-1,0);
    const topNormales        = createNormales(0, 1,0);


    this.getViewInfo = function(blockData) {
        const blockDefinition = BlockData.getDefinition(blockData);
        const drawInfo = viewInfos[blockDefinition];
        if(drawInfo == null) {
            Log.error("unknown block material: "+ blockDefinition);
            return viewInfos[Block.UnknownBlock];
        }
        else {
            return drawInfo;
        }
    }
    

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // register how to represent solid blocks in view
    ///////////////////////////////////////////////////////////////////////////////////////////////    


    this.addBlock = function(block, leftTextureIndex, rightTextureIndex, backTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex,
                             leftOrientation, rightOrientation, backOrientation, frontOrientation, bottomOrientation, topOrientation) {
        viewInfos[block]     = createSolidBlockInfo(leftTextureIndex, rightTextureIndex, backTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex,
                                                         leftOrientation, rightOrientation, backOrientation, frontOrientation, bottomOrientation, topOrientation);
    }


    this.addBasicBlock = function(block, textureIndex, permeable) {
        const info      = createSolidBlockInfo(textureIndex, textureIndex, textureIndex, textureIndex, textureIndex, textureIndex);        
        if (permeable) {
            info.isTransparent = true;
            info.isPermeable   = true;            
        }
        viewInfos[block]     = info;
    }


    this.addVerticalBlock = function(block, sideTextureIndex, bottomTextureIndex, topTextureIndex, orientation) {
        if( !topTextureIndex ) topTextureIndex = bottomTextureIndex;
        viewInfos[block]     = createSolidBlockInfo(sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex, bottomTextureIndex, topTextureIndex,
                                                         Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, orientation, orientation);
    }


    this.addTurnableBlock = function(block, leftTextureIndex, rightTextureIndex, backTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex) {
        viewInfos[block+0]   = createSolidBlockInfo(leftTextureIndex, rightTextureIndex, backTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex,
                                                         Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);
        viewInfos[block+1]   = createSolidBlockInfo(frontTextureIndex, backTextureIndex, leftTextureIndex, rightTextureIndex, bottomTextureIndex, topTextureIndex,
                                                         Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn90, Orientation.Turn90);
        viewInfos[block+2]   = createSolidBlockInfo(rightTextureIndex, leftTextureIndex, frontTextureIndex, backTextureIndex, bottomTextureIndex, topTextureIndex,
                                                         Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn180, Orientation.Turn180);
        viewInfos[block+3]   = createSolidBlockInfo(backTextureIndex, frontTextureIndex, rightTextureIndex, leftTextureIndex, bottomTextureIndex, topTextureIndex,
                                                         Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn270, Orientation.Turn270);
    }


    this.addToppleableLog = function(block, sideTextureIndex, topTextureIndex) {
        viewInfos[block+0]   = createSolidBlockInfo(sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex);
        viewInfos[block+1]   = createSolidBlockInfo(sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex, topTextureIndex, topTextureIndex);
        viewInfos[block+2]   = createFrontFlipedBlockInfo(sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex, topTextureIndex, topTextureIndex);
        viewInfos[block+3]   = createRightFlipedBlockInfo(sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex, topTextureIndex, topTextureIndex);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // transparent blocks
    ///////////////////////////////////////////////////////////////////////////////////////////////    

    
    this.addInsetBlock = function(block, sideTextureIndex, bottomTextureIndex, topTextureIndex, sideInset, bottomInset, topInset) {
        viewInfos[block]     = createInsetBlockInfo(sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex, bottomTextureIndex, topTextureIndex,
                                        null, null, null, null, null, null,
                                        sideInset, sideInset, sideInset, sideInset, bottomInset, topInset
                                        );
    }


    this.addSmallBlock = function(block, sideTextureIndex, bottomTextureIndex, topTextureIndex, width, height, attachFace) {
        const sideMargin     = (1-width) / 2;
        const topMargin      = 1-height;
        const bottomMargin   = 0;
        if(attachFace == BlockFaces.Bottom) {
            viewInfos[block] = createSmallBlockInfo(sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex, bottomTextureIndex, topTextureIndex,
                                        null, null, null, null, null, null,
                                        sideMargin, sideMargin, sideMargin, sideMargin, bottomMargin, topMargin );
        }
        else if(attachFace == BlockFaces.Top) {
            viewInfos[block] = createSmallBlockInfo(sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex, topTextureIndex, bottomTextureIndex,
                                        null, null, null, null, null, null,
                                        sideMargin, sideMargin, sideMargin, sideMargin, topMargin, bottomMargin );
        }
        else if(attachFace == BlockFaces.Left) {
            viewInfos[block] = createSmallBlockInfo(bottomTextureIndex, topTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex,
                                        null, null, null, null, null, null,
                                        bottomMargin, topMargin, sideMargin, sideMargin, sideMargin, sideMargin );
        }
        else if(attachFace == BlockFaces.Right) {
            viewInfos[block] = createSmallBlockInfo(topTextureIndex, bottomTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex,
                                        null, null, null, null, null, null,
                                        topMargin, bottomMargin, sideMargin, sideMargin, sideMargin, sideMargin );
        }
        else if(attachFace == BlockFaces.Back) {
            viewInfos[block] = createSmallBlockInfo(sideTextureIndex, sideTextureIndex, bottomTextureIndex, topTextureIndex, sideTextureIndex, sideTextureIndex,
                                        null, null, null, null, null, null,
                                        sideMargin, sideMargin, bottomMargin, topMargin, sideMargin, sideMargin );
        }
        else if(attachFace == BlockFaces.Front) {
            viewInfos[block] = createSmallBlockInfo(sideTextureIndex, sideTextureIndex, topTextureIndex, bottomTextureIndex, sideTextureIndex, sideTextureIndex,
                                        null, null, null, null, null, null,
                                        sideMargin, sideMargin, topMargin, bottomMargin, sideMargin, sideMargin );
        }
        else fail("invalid attach face");

    }


    this.addDecorator = function(block, textureIndex, face) {
        viewInfos[block]     = createSingleSideInfo(textureIndex, face);
    }


    this.addDecoratorForAllSides = function(block, textureIndex) {
        viewInfos[block+0]   = createSingleSideInfo(textureIndex, BlockFaces.Left);
        viewInfos[block+1]   = createSingleSideInfo(textureIndex, BlockFaces.Back);
        viewInfos[block+2]   = createSingleSideInfo(textureIndex, BlockFaces.Right);
        viewInfos[block+3]   = createSingleSideInfo(textureIndex, BlockFaces.Front);
        viewInfos[block+4]   = createSingleSideInfo(textureIndex, BlockFaces.Bottom);
        viewInfos[block+5]   = createSingleSideInfo(textureIndex, BlockFaces.Top);
    }


    this.addDecoratorForMantel = function(block, textureIndex) {
        viewInfos[block+0]   = createSingleSideInfo(textureIndex, BlockFaces.Left);
        viewInfos[block+1]   = createSingleSideInfo(textureIndex, BlockFaces.Back);
        viewInfos[block+2]   = createSingleSideInfo(textureIndex, BlockFaces.Right);
        viewInfos[block+3]   = createSingleSideInfo(textureIndex, BlockFaces.Front);
    }


    this.addStair = function(block, textureIndex, sideTextureIndex) {
        viewInfos[block+0]   = createStairInfo(textureIndex, textureIndex, sideTextureIndex, textureIndex, textureIndex, BlockFaces.Left);        
        viewInfos[block+1]   = createStairInfo(textureIndex, textureIndex, sideTextureIndex, textureIndex, textureIndex, BlockFaces.Back);        
        viewInfos[block+2]   = createStairInfo(textureIndex, textureIndex, sideTextureIndex, textureIndex, textureIndex, BlockFaces.Right);        
        viewInfos[block+3]   = createStairInfo(textureIndex, textureIndex, sideTextureIndex, textureIndex, textureIndex, BlockFaces.Front); 
        viewInfos[block+4]   = createReverseStairInfo(textureIndex, textureIndex, sideTextureIndex, textureIndex, textureIndex, BlockFaces.Left);        
        viewInfos[block+5]   = createReverseStairInfo(textureIndex, textureIndex, sideTextureIndex, textureIndex, textureIndex, BlockFaces.Back);        
        viewInfos[block+6]   = createReverseStairInfo(textureIndex, textureIndex, sideTextureIndex, textureIndex, textureIndex, BlockFaces.Right);        
        viewInfos[block+7]   = createReverseStairInfo(textureIndex, textureIndex, sideTextureIndex, textureIndex, textureIndex, BlockFaces.Front);                        
    }


    this.addDoor = function(block, frontTextureIndex, borderTextureIndex, borderTextureSubIndex) {
        viewInfos[block+0]   = createLeftDoorInfo( frontTextureIndex, borderTextureIndex, borderTextureSubIndex);
        viewInfos[block+1]   = createBackDoorInfo( frontTextureIndex, borderTextureIndex, borderTextureSubIndex);
        viewInfos[block+2]   = createRightDoorInfo(frontTextureIndex, borderTextureIndex, borderTextureSubIndex);
        viewInfos[block+3]   = createFrontDoorInfo(frontTextureIndex, borderTextureIndex, borderTextureSubIndex);
        viewInfos[block+4]   = createLeftDoorInfo( frontTextureIndex, borderTextureIndex, borderTextureSubIndex, Orientation.Flip);
        viewInfos[block+5]   = createBackDoorInfo( frontTextureIndex, borderTextureIndex, borderTextureSubIndex, Orientation.Flip);
        viewInfos[block+6]   = createRightDoorInfo(frontTextureIndex, borderTextureIndex, borderTextureSubIndex, Orientation.Flip);
        viewInfos[block+7]   = createFrontDoorInfo(frontTextureIndex, borderTextureIndex, borderTextureSubIndex, Orientation.Flip);            
    }


    this.addCross = function(block, textureIndex, radius, height, permeable, oneAxeOnly) {
        viewInfos[block]     = createCrossInfo(textureIndex, radius, radius, radius, radius, height, permeable, oneAxeOnly);
    }


    this.addDiagonalCross = function(block, textureIndex, radius, height, permeable) {
        viewInfos[block]     = createDiagonalCrossInfo(textureIndex, radius, height, permeable);
    }


    this.addParallelPlanes = function(block, textureIndex, height, permeable) {
        viewInfos[block]     = createParallelPlanesInfo(textureIndex, height, permeable);
    }


    this.addLowerHalfBlock = function(block, textureIndex) {
        viewInfos[block]     = createLowerHalfBlockInfo(textureIndex, textureIndex, textureIndex, textureIndex, textureIndex, textureIndex, Orientation.Turn90);
    }


    this.addUpperHalfBlock = function(block, textureIndex) {
        viewInfos[block]     = createUpperHalfBlockInfo(textureIndex, textureIndex, textureIndex, textureIndex, textureIndex, textureIndex, Orientation.Turn90);
    }


    this.addTurnableHalfBlock = function(block, leftTextureIndex, backTextureIndex, rightTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex) {
        viewInfos[block+0]   = createLowerHalfBlockInfo(leftTextureIndex, backTextureIndex, rightTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex, Orientation.Normal);
        viewInfos[block+1]   = createLowerHalfBlockInfo(leftTextureIndex, backTextureIndex, rightTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex, Orientation.Turn90);
        viewInfos[block+2]   = createLowerHalfBlockInfo(leftTextureIndex, backTextureIndex, rightTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex, Orientation.Turn180);
        viewInfos[block+3]   = createLowerHalfBlockInfo(leftTextureIndex, backTextureIndex, rightTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex, Orientation.Turn270);            
    }


    this.addTable = function(block, sideTextureIndex, bottomTextureIndex, topTextureIndex) {
        viewInfos[block]     = createTableInfo(sideTextureIndex, bottomTextureIndex, topTextureIndex);                
    }


    this.addTurnableChair = function(block, sideTextureIndex, backTextureIndex, frontTextureIndex, topTextureIndex) {
        viewInfos[block+0]   = createChairInfo(sideTextureIndex, backTextureIndex, frontTextureIndex, topTextureIndex, Orientation.Normal);        
        viewInfos[block+1]   = createChairInfo(sideTextureIndex, backTextureIndex, frontTextureIndex, topTextureIndex, Orientation.Turn90);        
        viewInfos[block+2]   = createChairInfo(sideTextureIndex, backTextureIndex, frontTextureIndex, topTextureIndex, Orientation.Turn180);        
        viewInfos[block+3]   = createChairInfo(sideTextureIndex, backTextureIndex, frontTextureIndex, topTextureIndex, Orientation.Turn270);        
    }


    this.addFlippablePlane = function(block, frontTextureIndex, backTextureIndex) {
        viewInfos[block+0]   = createPlaneInfo(frontTextureIndex, backTextureIndex, Orientation.Normal);
        viewInfos[block+1]   = createPlaneInfo(frontTextureIndex, backTextureIndex, Orientation.Turn90);   
    }


    this.addTurnablePlane = function(block, frontTextureIndex, backTextureIndex) {
        viewInfos[block+0]   = createPlaneInfo(frontTextureIndex, backTextureIndex, Orientation.Normal);
        viewInfos[block+1]   = createPlaneInfo(frontTextureIndex, backTextureIndex, Orientation.Turn90);   
        viewInfos[block+2]   = createPlaneInfo(frontTextureIndex, backTextureIndex, Orientation.Turn180);   
        viewInfos[block+3]   = createPlaneInfo(frontTextureIndex, backTextureIndex, Orientation.Turn270);   
    }


    this.addCenterPlane = function(block, textureIndex, isPermeable) {
        viewInfos[block]     = createPlaneInfo(textureIndex, textureIndex, Orientation.Normal, isPermeable);
    }


    this.addSidePlane = function(block, textureIndex, isPermeable) {
        viewInfos[block+0]   = createSidePlaneInfo(textureIndex, textureIndex, BlockFaces.Left, isPermeable);
        viewInfos[block+1]   = createSidePlaneInfo(textureIndex, textureIndex, BlockFaces.Back, isPermeable);
        viewInfos[block+2]   = createSidePlaneInfo(textureIndex, textureIndex, BlockFaces.Right, isPermeable);
        viewInfos[block+3]   = createSidePlaneInfo(textureIndex, textureIndex, BlockFaces.Front, isPermeable);
    }


    this.addFence = function(block, textureIndex, cornerHangover) {
        viewInfos[block+0]   = createPlaneInfo(textureIndex, textureIndex, Orientation.Normal);
        viewInfos[block+1]   = createPlaneInfo(textureIndex, textureIndex, Orientation.Turn90);   
        viewInfos[block+2]   = createCrossInfo(textureIndex, 0.5, 0.5, cornerHangover, cornerHangover, 1);   
        viewInfos[block+3]   = createCrossInfo(textureIndex, cornerHangover, 0.5, 0.5, cornerHangover, 1);   
        viewInfos[block+4]   = createCrossInfo(textureIndex, cornerHangover, cornerHangover, 0.5, 0.5, 1);   
        viewInfos[block+5]   = createCrossInfo(textureIndex, 0.5, cornerHangover, cornerHangover, 0.5, 1);   
        viewInfos[block+6]   = createCrossInfo(textureIndex, 0.5, 0.5, 0.5, 0.5, 1);   
        viewInfos[block+7]   = createCrossInfo(textureIndex, cornerHangover, cornerHangover, cornerHangover, cornerHangover, 1);   
    }


    this.addFenceSpecial = function(block, textureIndex, cornerHangover) {
        viewInfos[block+0]   = createCrossInfo(textureIndex, cornerHangover, 0.5, 0.5, 0.5, 1);   
        viewInfos[block+1]   = createCrossInfo(textureIndex, 0.5, cornerHangover, 0.5, 0.5, 1);   
        viewInfos[block+2]   = createCrossInfo(textureIndex, 0.5, 0.5, cornerHangover, 0.5, 1);   
        viewInfos[block+3]   = createCrossInfo(textureIndex, 0.5, 0.5, 0.5, cornerHangover, 1);   
        viewInfos[block+4]   = createCrossInfo(textureIndex, 0.5, cornerHangover, cornerHangover, cornerHangover, 1);   
        viewInfos[block+5]   = createCrossInfo(textureIndex, cornerHangover, 0.5, cornerHangover, cornerHangover, 1);   
        viewInfos[block+6]   = createCrossInfo(textureIndex, cornerHangover, cornerHangover, 0.5, cornerHangover, 1);   
        viewInfos[block+7]   = createCrossInfo(textureIndex, cornerHangover, cornerHangover, cornerHangover, 0.5, 1);   
    }


    this.addGlass = function(block, textureIndex, cornerHangover) {
        viewInfos[block+0]    = createPlaneInfo(textureIndex, textureIndex, Orientation.Normal);
        viewInfos[block+1]    = createPlaneInfo(textureIndex, textureIndex, Orientation.Turn90);   
        viewInfos[block+2]    = createCrossInfo(textureIndex, 0.5, 0.5, cornerHangover, cornerHangover, 1);   
        viewInfos[block+3]    = createCrossInfo(textureIndex, cornerHangover, 0.5, 0.5, cornerHangover, 1);   
        viewInfos[block+4]    = createCrossInfo(textureIndex, cornerHangover, cornerHangover, 0.5, 0.5, 1);   
        viewInfos[block+5]    = createCrossInfo(textureIndex, 0.5, cornerHangover, cornerHangover, 0.5, 1);   
        viewInfos[block+6]    = createCrossInfo(textureIndex, 0.5, 0.5, 0.5, 0.5, 1);   
        viewInfos[block+7]    = createHorizontalPlaneInfo(textureIndex);   
    }


    this.addWallTorch = function(block, textureIndex, textureWallIndex) {
        viewInfos[block+0]   = createWallTorchInfo(textureIndex, textureWallIndex, BlockFaces.Left);
        viewInfos[block+1]   = createWallTorchInfo(textureIndex, textureWallIndex, BlockFaces.Back);
        viewInfos[block+2]   = createWallTorchInfo(textureIndex, textureWallIndex, BlockFaces.Right);
        viewInfos[block+3]   = createWallTorchInfo(textureIndex, textureWallIndex, BlockFaces.Front);
    }

    this.addFlippableOpenGate = function(block, textureIndex) {
        viewInfos[block+0]   = createGateOpenInfo(textureIndex, Orientation.Normal);        
        viewInfos[block+1]   = createGateOpenInfo(textureIndex, Orientation.Turn90);        
    }


    this.addTurnableSide = function(block, textureIndex, sideFace) {
        // rotation of texture is not yet implemented
        viewInfos[block+0]   = createSingleSideInfo(textureIndex, sideFace);
        viewInfos[block+1]   = createSingleSideInfo(textureIndex, sideFace);
        viewInfos[block+2]   = createSingleSideInfo(textureIndex, sideFace);
        viewInfos[block+3]   = createSingleSideInfo(textureIndex, sideFace);
    }


    this.addTurnableWedge = function(block, topTextureIndex, sideTextureIndex, bottomTextureIndex, frontTextureIndex) {
        viewInfos[block+0]   = createWedgeInfo(topTextureIndex, sideTextureIndex, bottomTextureIndex, frontTextureIndex, BlockFaces.Left);          
        viewInfos[block+1]   = createWedgeInfo(topTextureIndex, sideTextureIndex, bottomTextureIndex, frontTextureIndex, BlockFaces.Back);          
        viewInfos[block+2]   = createWedgeInfo(topTextureIndex, sideTextureIndex, bottomTextureIndex, frontTextureIndex, BlockFaces.Right);          
        viewInfos[block+3]   = createWedgeInfo(topTextureIndex, sideTextureIndex, bottomTextureIndex, frontTextureIndex, BlockFaces.Front);          
    }


    this.addTurnableHighWedge = function(block, topTextureIndex, sideTextureIndex, bottomTextureIndex, backTextureIndex, frontTextureIndex) {
        viewInfos[block+0]   = createHighWedgeInfo(topTextureIndex, sideTextureIndex, bottomTextureIndex, backTextureIndex, frontTextureIndex, BlockFaces.Left);          
        viewInfos[block+1]   = createHighWedgeInfo(topTextureIndex, sideTextureIndex, bottomTextureIndex, backTextureIndex, frontTextureIndex, BlockFaces.Back);          
        viewInfos[block+2]   = createHighWedgeInfo(topTextureIndex, sideTextureIndex, bottomTextureIndex, backTextureIndex, frontTextureIndex, BlockFaces.Right);          
        viewInfos[block+3]   = createHighWedgeInfo(topTextureIndex, sideTextureIndex, bottomTextureIndex, backTextureIndex, frontTextureIndex, BlockFaces.Front);
    }


    this.addRotatableWeb = function(block, textureIndex) {
        viewInfos[block+0]   = createWebInfo(textureIndex, BlockFaces.Left);          
        viewInfos[block+1]   = createWebInfo(textureIndex, BlockFaces.Back);          
        viewInfos[block+2]   = createWebInfo(textureIndex, BlockFaces.Right);          
        viewInfos[block+3]   = createWebInfo(textureIndex, BlockFaces.Front);          
        viewInfos[block+4]   = createWebInfo(textureIndex, BlockFaces.Bottom);          
        viewInfos[block+5]   = createWebInfo(textureIndex, BlockFaces.Top);  
    }


    this.addGrapevine = function(block, textureIndex) {
        viewInfos[block]     = createWebInfo(textureIndex, BlockFaces.Bottom);          
    }


    this.addLeverBase = function(block, baseTextureIndex, textureIndex) {
        viewInfos[block]     = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Bottom, BlockFaces.Back);          
        viewInfos[block+1]   = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Bottom, BlockFaces.Front);          
        viewInfos[block+2]   = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Bottom, BlockFaces.Left);          
        viewInfos[block+3]   = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Bottom, BlockFaces.Right);          
        viewInfos[block+4]   = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Top, BlockFaces.Back);          
        viewInfos[block+5]   = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Top, BlockFaces.Front);          
        viewInfos[block+6]   = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Top, BlockFaces.Left);          
        viewInfos[block+7]   = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Top, BlockFaces.Right);          
    }


    this.addLeverMantel = function(block, baseTextureIndex, textureIndex) {
        viewInfos[block]     = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Left,  BlockFaces.Bottom);          
        viewInfos[block+1]   = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Left,  BlockFaces.Top);          
        viewInfos[block+2]   = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Back,  BlockFaces.Bottom);          
        viewInfos[block+3]   = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Back,  BlockFaces.Top);          
        viewInfos[block+4]   = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Right, BlockFaces.Bottom);          
        viewInfos[block+5]   = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Right, BlockFaces.Top);          
        viewInfos[block+6]   = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Front, BlockFaces.Bottom);          
        viewInfos[block+7]   = createLeverInfo(baseTextureIndex, textureIndex, 0.3, BlockFaces.Front, BlockFaces.Top);          
    }


    this.addPyramide = function(block, textureIndex) {
        viewInfos[block]     = createPyramideInfo(textureIndex, BlockFaces.Left);          
        viewInfos[block+1]   = createPyramideInfo(textureIndex, BlockFaces.Back);          
        viewInfos[block+2]   = createPyramideInfo(textureIndex, BlockFaces.Right);          
        viewInfos[block+3]   = createPyramideInfo(textureIndex, BlockFaces.Front);          
        viewInfos[block+4]   = createPyramideInfo(textureIndex, BlockFaces.Bottom);          
        viewInfos[block+5]   = createPyramideInfo(textureIndex, BlockFaces.Top);                  
    }


    this.addBanner = function(block, frontTextureIndex, backTextureIndex, radius, height) {
        viewInfos[block]     = createBannerInfo(frontTextureIndex, backTextureIndex, BlockFaces.Left, null,             radius, height);          
        viewInfos[block+1]   = createBannerInfo(frontTextureIndex, backTextureIndex, BlockFaces.Left, BlockFaces.Back,  radius, height);          
        viewInfos[block+2]   = createBannerInfo(frontTextureIndex, backTextureIndex, BlockFaces.Back, null,             radius, height);          
        viewInfos[block+3]   = createBannerInfo(frontTextureIndex, backTextureIndex, BlockFaces.Back, BlockFaces.Right, radius, height);          
        viewInfos[block+4]   = createBannerInfo(frontTextureIndex, backTextureIndex, BlockFaces.Right, null,            radius, height);          
        viewInfos[block+5]   = createBannerInfo(frontTextureIndex, backTextureIndex, BlockFaces.Right, BlockFaces.Front,radius, height);          
        viewInfos[block+6]   = createBannerInfo(frontTextureIndex, backTextureIndex, BlockFaces.Front, null,            radius, height);          
        viewInfos[block+7]   = createBannerInfo(frontTextureIndex, backTextureIndex, BlockFaces.Front, BlockFaces.Left, radius, height);          
    }


    this.addPath = function(block, bottomTextureIndex, sideTextureIndex, topTextureIndex) {
        viewInfos[block]     = createPathInfo(bottomTextureIndex, sideTextureIndex, topTextureIndex);          
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // create single block webgl descriptions
    ///////////////////////////////////////////////////////////////////////////////////////////////    
    

    function createBlockInfo(allSideTextureIndex) {
        return createSolidBlockInfo(allSideTextureIndex, allSideTextureIndex, allSideTextureIndex, allSideTextureIndex, allSideTextureIndex, allSideTextureIndex);
    }
    

    function createVerticalBlockInfo(sideTextureIndex, topTextureIndex, bottomTextureIndex) {
        return createSolidBlockInfo(sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex, bottomTextureIndex, topTextureIndex);
    }


    function createTopBlockInfo(sideTextureIndex, topTextureIndex, topTextureOrientation) {
        return createSolidBlockInfo(sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex, sideTextureIndex, topTextureIndex,
            Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, topTextureOrientation);
}


    function createRightFlipedBlockInfo(leftTextureIndex, rightTextureIndex, backTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex) {
        return createSolidBlockInfo(bottomTextureIndex, topTextureIndex, backTextureIndex, frontTextureIndex, rightTextureIndex, leftTextureIndex,
                                    Orientation.Normal, Orientation.Normal, Orientation.Turn270, Orientation.Turn90, Orientation.Turn270, Orientation.Turn90);
    }


    function createFrontFlipedBlockInfo(leftTextureIndex, rightTextureIndex, backTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex) {
        return createSolidBlockInfo(leftTextureIndex, rightTextureIndex, topTextureIndex, bottomTextureIndex, backTextureIndex, frontTextureIndex,
                                    Orientation.Turn90, Orientation.Turn270, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);
    }


    function createSolidBlockInfo(leftTextureIndex, rightTextureIndex, backTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex,
        leftOrientation, rightOrientation, backOrientation, frontOrientation, bottomOrientation, topOrientation) {
        const info           = createInfo();
        info.hasBlockSides   = true;
        info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,1,0,  0,1,1), leftNormales, createSquareTexture(leftTextureIndex,   leftOrientation));
        info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,1,1,  1,1,0), rightNormales, createSquareTexture(rightTextureIndex,  rightOrientation));
        info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,1,0,  0,1,0), backNormales, createSquareTexture(backTextureIndex,   backOrientation));
        info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,1,1,  1,1,1), frontNormales, createSquareTexture(frontTextureIndex,  frontOrientation));
        info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,  0,0,1,  1,0,1), bottomNormales, createSquareTexture(bottomTextureIndex, bottomOrientation));
        info.topRectangle    = createRectangle( createCorners(0,1,0,  1,1,0,  1,1,1,  0,1,1), topNormales, createSquareTexture(topTextureIndex,    topOrientation));
        return info;
    }


    function createInsetBlockInfo(leftTextureIndex, rightTextureIndex, backTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex,
        leftOrientation, rightOrientation, backOrientation, frontOrientation, bottomOrientation, topOrientation, 
        leftInset, rightInset, backInset, frontInset, bottomInset, topInset) {
        
        const l = leftInset;
        const r = 1-rightInset;
        const b = backInset;
        const f = 1-frontInset;
        const o = bottomInset;
        const t = 1-topInset;

        const info           = createInfo();
        let i=0;
        const rectangles     = [];
        if(l > 0) rectangles[i++]     = createRectangle( createCorners(l,0,1,  l,0,0,  l,1,0,  l,1,1), leftNormales, createSquareTexture(leftTextureIndex,   leftOrientation));
        else      info.leftRectangle  = createRectangle( createCorners(l,0,1,  l,0,0,  l,1,0,  l,1,1), leftNormales, createSquareTexture(leftTextureIndex,   leftOrientation));
        if(r < 1) rectangles[i++]     = createRectangle( createCorners(r,0,0,  r,0,1,  r,1,1,  r,1,0), rightNormales, createSquareTexture(rightTextureIndex,  rightOrientation));
        else      info.rightRectangle = createRectangle( createCorners(r,0,0,  r,0,1,  r,1,1,  r,1,0), rightNormales, createSquareTexture(rightTextureIndex,  rightOrientation));
        if(b > 0) rectangles[i++]     = createRectangle( createCorners(0,0,b,  1,0,b,  1,1,b,  0,1,b), backNormales, createSquareTexture(backTextureIndex,   backOrientation));
        else      info.backRectangle  = createRectangle( createCorners(0,0,b,  1,0,b,  1,1,b,  0,1,b), backNormales, createSquareTexture(backTextureIndex,   backOrientation));
        if(f < 1) rectangles[i++]     = createRectangle( createCorners(1,0,f,  0,0,f,  0,1,f,  1,1,f), frontNormales, createSquareTexture(frontTextureIndex,  frontOrientation));
        else      info.frontRectangle = createRectangle( createCorners(1,0,f,  0,0,f,  0,1,f,  1,1,f), frontNormales, createSquareTexture(frontTextureIndex,  frontOrientation));
        if(o > 0) rectangles[i++]     = createRectangle( createCorners(1,o,0,  0,o,0,  0,o,1,  1,o,1), bottomNormales, createSquareTexture(bottomTextureIndex, bottomOrientation));
        else      info.bottomRectangle= createRectangle( createCorners(1,o,0,  0,o,0,  0,o,1,  1,o,1), bottomNormales, createSquareTexture(bottomTextureIndex, bottomOrientation));
        if(t < 1) rectangles[i++]     = createRectangle( createCorners(0,t,0,  1,t,0,  1,t,1,  0,t,1), topNormales, createSquareTexture(topTextureIndex,    topOrientation));
        else      info.topRectangle   = createRectangle( createCorners(0,t,0,  1,t,0,  1,t,1,  0,t,1), topNormales, createSquareTexture(topTextureIndex,    topOrientation));
        
        info.innerRectangles = combineRectangles(rectangles);
        if(i < 6) info.hasBlockSides   = true;
        info.isTransparent   = true;
        return info;
    }


    function createSmallBlockInfo(leftTextureIndex, rightTextureIndex, backTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex,
        leftOrientation, rightOrientation, backOrientation, frontOrientation, bottomOrientation, topOrientation, 
        leftMargin, rightMargin, backMargin, frontMargin, bottomMargin, topMargin) {
        
        const l = leftMargin;
        const r = 1-rightMargin;
        const b = backMargin;
        const f = 1-frontMargin;
        const o = bottomMargin;
        const t = 1-topMargin;

        const info           = createInfo();
        let i=0;
        const rectangles     = [];
        if( l != 0 ) rectangles[i++]     = createRectangle( createCorners(l,o,f,  l,o,b,  l,t,b,  l,t,f), leftNormales, createSquareTexture(leftTextureIndex,   leftOrientation));
        else         info.leftRectangle  = createRectangle( createCorners(l,o,f,  l,o,b,  l,t,b,  l,t,f), leftNormales, createSquareTexture(leftTextureIndex,   leftOrientation));
        if( r != 1 ) rectangles[i++]     = createRectangle( createCorners(r,o,b,  r,o,f,  r,t,f,  r,t,b), rightNormales, createSquareTexture(rightTextureIndex,  rightOrientation));
        else         info.rightRectangle = createRectangle( createCorners(r,o,b,  r,o,f,  r,t,f,  r,t,b), rightNormales, createSquareTexture(rightTextureIndex,  rightOrientation));
        if( b != 0 ) rectangles[i++]     = createRectangle( createCorners(l,o,b,  r,o,b,  r,t,b,  l,t,b), backNormales, createSquareTexture(backTextureIndex,   backOrientation));
        else         info.backRectangle  = createRectangle( createCorners(l,o,b,  r,o,b,  r,t,b,  l,t,b), backNormales, createSquareTexture(backTextureIndex,   backOrientation));
        if( f != 1 ) rectangles[i++]     = createRectangle( createCorners(r,o,f,  l,o,f,  l,t,f,  r,t,f), frontNormales, createSquareTexture(frontTextureIndex,  frontOrientation));
        else         info.frontRectangle = createRectangle( createCorners(r,o,f,  l,o,f,  l,t,f,  r,t,f), frontNormales, createSquareTexture(frontTextureIndex,  frontOrientation));
        if( o != 0 ) rectangles[i++]     = createRectangle( createCorners(r,o,b,  l,o,b,  l,o,f,  r,o,f), bottomNormales, createSquareTexture(bottomTextureIndex, bottomOrientation));
        else         info.bottomRectangle= createRectangle( createCorners(r,o,b,  l,o,b,  l,o,f,  r,o,f), bottomNormales, createSquareTexture(bottomTextureIndex, bottomOrientation));
        if( t != 1 ) rectangles[i++]     = createRectangle( createCorners(l,t,b,  r,t,b,  r,t,f,  l,t,f), topNormales, createSquareTexture(topTextureIndex,    topOrientation));
        else         info.topRectangle   = createRectangle( createCorners(l,t,b,  r,t,b,  r,t,f,  l,t,f), topNormales, createSquareTexture(topTextureIndex,    topOrientation));
        
        info.innerRectangles = combineRectangles(rectangles);
        if(i < 6) info.hasBlockSides   = true;
        info.isTransparent   = true;
        return info;
    }


    function createReverseStairInfo(frontTextureIndex, topTextureIndex, sideTextureIndex, backTextureIndex, bottomTextureIndex, face) {
        const rectangles     = [];
        const info           = createInfo();
        if(face == BlockFaces.Left) {
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,1,0,  0,1,1), leftNormales, createSquareTexture(backTextureIndex));
            info.rightRectangle  = createRectangle( createCorners(1,0.5,0,  1,0.5,1,  1,1,1,  1,1,0), rightNormales, createBottomHalfeTexture(frontTextureIndex));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,1,0,  0,1,0), backNormales, createSquareTexture(sideTextureIndex, Orientation.Turn180));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,1,1,  1,1,1), frontNormales, createSquareTexture(sideTextureIndex, Orientation.FlipAndTurn180));
            info.bottomRectangle = createRectangle( createCorners(0.5,0,0,  0,0,0,  0,0,1,  0.5,0,1), bottomNormales, createTopHalfeTexture(topTextureIndex, Orientation.Turn90));
            info.topRectangle    = createRectangle( createCorners(0,1,0,  1,1,0,  1,1,1,  0,1,1), topNormales, createSquareTexture(bottomTextureIndex));
            rectangles[0]        = createRectangle( createCorners(1,0.5,0,  0.5,0.5,0,  0.5,0.5,1,  1,0.5,1), bottomNormales, createTopHalfeTexture(topTextureIndex, Orientation.Turn90));
            rectangles[1]        = createRectangle( createCorners(0.5,0,0,  0.5,0,1,  0.5,0.5,1,  0.5,0.5,0), rightNormales,  createBottomHalfeTexture(frontTextureIndex));
        }
        if(face == BlockFaces.Right) {
            info.leftRectangle   = createRectangle( createCorners(0,0.5,1,  0,0.5,0,  0,1,0,  0,1,1), leftNormales, createBottomHalfeTexture(frontTextureIndex));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,1,1,  1,1,0), rightNormales, createSquareTexture(backTextureIndex));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,1,0,  0,1,0), backNormales, createSquareTexture(sideTextureIndex, Orientation.FlipAndTurn180));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,1,1,  1,1,1), frontNormales, createSquareTexture(sideTextureIndex, Orientation.Turn180));
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0.5,0,0,  0.5,0,1,  1,0,1), bottomNormales, createTopHalfeTexture(topTextureIndex, Orientation.Turn90));
            info.topRectangle    = createRectangle( createCorners(0,1,0,  1,1,0,  1,1,1,  0,1,1), topNormales, createSquareTexture(bottomTextureIndex));
            rectangles[0]        = createRectangle( createCorners(0.5,0.5,0,  0,0.5,0,  0,0.5,1,  0.5,0.5,1), bottomNormales, createTopHalfeTexture(topTextureIndex, Orientation.Turn90));
            rectangles[1]        = createRectangle( createCorners(0.5,0,1,  0.5,0,0,  0.5,0.5,0,  0.5,0.5,1), leftNormales,  createBottomHalfeTexture(frontTextureIndex));
        }
        if(face == BlockFaces.Back) {
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,1,0,  0,1,1), leftNormales, createSquareTexture(sideTextureIndex, Orientation.FlipAndTurn180));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,1,1,  1,1,0), rightNormales, createSquareTexture(sideTextureIndex, Orientation.Turn180));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,1,0,  0,1,0), backNormales, createSquareTexture(backTextureIndex));
            info.frontRectangle  = createRectangle( createCorners(1,0.5,1,  0,0.5,1,  0,1,1,  1,1,1), frontNormales, createBottomHalfeTexture(frontTextureIndex));
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,  0,0,0.5,  1,0,0.5), bottomNormales, createTopHalfeTexture(topTextureIndex));
            info.topRectangle    = createRectangle( createCorners(0,1,0,  1,1,0,  1,1,1,  0,1,1), topNormales, createSquareTexture(bottomTextureIndex));
            rectangles[0]        = createRectangle( createCorners(1,0.5,0.5,  0,0.5,0.5,  0,0.5,1,  1,0.5,1), bottomNormales, createTopHalfeTexture(topTextureIndex));
            rectangles[1]        = createRectangle( createCorners(1,0,0.5,  0,0,0.5,  0,0.5,0.5,  1,0.5,0.5), frontNormales, createBottomHalfeTexture(frontTextureIndex));
        }
        if(face == BlockFaces.Front) {
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,1,0,  0,1,1), leftNormales, createSquareTexture(sideTextureIndex, Orientation.Turn180));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,1,1,  1,1,0), rightNormales, createSquareTexture(sideTextureIndex, Orientation.FlipAndTurn180));
            info.backRectangle   = createRectangle( createCorners(0,0.5,0,  1,0.5,0,  1,1,0,  0,1,0), backNormales, createBottomHalfeTexture(frontTextureIndex));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,1,1,  1,1,1), frontNormales, createSquareTexture(backTextureIndex));
            info.bottomRectangle = createRectangle( createCorners(1,0,0.5,  0,0,0.5,  0,0,1,  1,0,1), bottomNormales, createTopHalfeTexture(topTextureIndex));
            info.topRectangle    = createRectangle( createCorners(0,1,0,  1,1,0,  1,1,1,  0,1,1), topNormales, createSquareTexture(topTextureIndex));
            rectangles[0]        = createRectangle( createCorners(1,0.5,0,  0,0.5,0,  0,0.5,0.5,  1,0.5,0.5), bottomNormales, createTopHalfeTexture(topTextureIndex));
            rectangles[1]        = createRectangle( createCorners(0,0,0.5,  1,0,0.5,  1,0.5,0.5,  0,0.5,0.5), backNormales, createBottomHalfeTexture(frontTextureIndex));
        }

        info.innerRectangles = combineRectangles(rectangles);
        info.isTransparent   = true;
        info.hasBlockSides   = true;
        return info;
    }


    function createStairInfo(frontTextureIndex, topTextureIndex, sideTextureIndex, backTextureIndex, bottomTextureIndex, face) {
        const rectangles     = [];
        const info           = createInfo();
        if(face == BlockFaces.Left) {
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,1,0,  0,1,1), leftNormales, createSquareTexture(backTextureIndex));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,0.5,1,  1,0.5,0), rightNormales, createBottomHalfeTexture(frontTextureIndex));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,1,0,  0,1,0), backNormales, createSquareTexture(sideTextureIndex, Orientation.Flip));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,1,1,  1,1,1), frontNormales, createSquareTexture(sideTextureIndex, Orientation.Normal));
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,  0,0,1,  1,0,1), bottomNormales, createSquareTexture(bottomTextureIndex));
            info.topRectangle    = createRectangle( createCorners(0,1,0,  0.5,1,0,  0.5,1,1,  0,1,1), topNormales, createTopHalfeTexture(topTextureIndex, Orientation.Turn90));
            rectangles[0]        = createRectangle( createCorners(0.5,0.5,0,  1,0.5,0,  1,0.5,1,  0.5,0.5,1), topNormales, createTopHalfeTexture(topTextureIndex, Orientation.Turn90));
            rectangles[1]        = createRectangle( createCorners(0.5,0.5,0,  0.5,0.5,1,  0.5,1,1,  0.5,1,0), rightNormales,  createBottomHalfeTexture(frontTextureIndex));
        }
        if(face == BlockFaces.Right) {
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,0.5,0,  0,0.5,1), leftNormales, createBottomHalfeTexture(frontTextureIndex));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,1,1,  1,1,0), rightNormales, createSquareTexture(backTextureIndex));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,1,0,  0,1,0), backNormales, createSquareTexture(sideTextureIndex,   Orientation.Normal));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,1,1,  1,1,1), frontNormales, createSquareTexture(sideTextureIndex,  Orientation.Flip));
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,  0,0,1,  1,0,1), bottomNormales, createSquareTexture(bottomTextureIndex));
            info.topRectangle    = createRectangle( createCorners(0.5,1,0,  1,1,0,  1,1,1,  0.5,1,1), topNormales, createTopHalfeTexture(topTextureIndex, Orientation.Turn90));
            rectangles[0]        = createRectangle( createCorners(0,0.5,0,  0.5,0.5,0,  0.5,0.5,1,  0,0.5,1), topNormales, createTopHalfeTexture(topTextureIndex, Orientation.Turn90));
            rectangles[1]        = createRectangle( createCorners(0.5,0.5,1,  0.5,0.5,0,  0.5,1,0,  0.5,1,1), leftNormales, createBottomHalfeTexture(frontTextureIndex));
        }
        if(face == BlockFaces.Back) {
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,1,0,  0,1,1), leftNormales, createSquareTexture(sideTextureIndex, Orientation.Normal));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,1,1,  1,1,0), rightNormales, createSquareTexture(sideTextureIndex, Orientation.Flip));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,1,0,  0,1,0), backNormales, createSquareTexture(backTextureIndex));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,0.5,1,  1,0.5,1), frontNormales, createBottomHalfeTexture(frontTextureIndex));
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,  0,0,1,  1,0,1), bottomNormales, createSquareTexture(bottomTextureIndex));
            info.topRectangle    = createRectangle( createCorners(0,1,0,  1,1,0,  1,1,0.5,  0,1,0.5), topNormales, createTopHalfeTexture(topTextureIndex));
            rectangles[0]        = createRectangle( createCorners(0,0.5,0.5,  1,0.5,0.5,  1,0.5,1,  0,0.5,1), topNormales, createTopHalfeTexture(topTextureIndex));
            rectangles[1]        = createRectangle( createCorners(1,0.5,0.5,  0,0.5,0.5,  0,1,0.5,  1,1,0.5), frontNormales, createBottomHalfeTexture(frontTextureIndex));
        }
        if(face == BlockFaces.Front) {
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,1,0,  0,1,1), leftNormales, createSquareTexture(sideTextureIndex, Orientation.Flip));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,1,1,  1,1,0), rightNormales, createSquareTexture(sideTextureIndex, Orientation.Normal));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,0.5,0,  0,0.5,0), backNormales, createBottomHalfeTexture(frontTextureIndex));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,1,1,  1,1,1), frontNormales, createSquareTexture(backTextureIndex));
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,  0,0,1,  1,0,1), bottomNormales, createSquareTexture(bottomTextureIndex));
            info.topRectangle    = createRectangle( createCorners(0,1,0.5,  1,1,0.5,  1,1,1,  0,1,1), topNormales, createTopHalfeTexture(topTextureIndex));
            rectangles[0]        = createRectangle( createCorners(0,0.5,0,  1,0.5,0,  1,0.5,0.5,  0,0.5,0.5), topNormales, createTopHalfeTexture(topTextureIndex));
            rectangles[1]        = createRectangle( createCorners(0,0.5,0.5,  1,0.5,0.5,  1,1,0.5,  0,1,0.5), backNormales, createBottomHalfeTexture(frontTextureIndex));
        }

        info.innerRectangles = combineRectangles(rectangles);
        info.isTransparent   = true;
        info.hasBlockSides   = true;
        return info;
    }


    function createWebInfo(textureIndex, face) {
        const rectangles= [];
        if(face == BlockFaces.Left) {
            rectangles[0]   = createRectangle( createCorners(0,0,0,  0.7,1,0,  1,1,1,  0,0.3,1), createNormales(-1, 1,-1), createSquareTexture(textureIndex));
            rectangles[1]   = createRectangle( createCorners(0.7,1,0,  0,0,0,  0,0.3,1,  1,1,1), createNormales(1,-1,1), createSquareTexture(textureIndex, Orientation.Flip));
        }
        if(face == BlockFaces.Right) {
            rectangles[0]   = createRectangle( createCorners(0,1,0,  1,0.3,0,  1,0,1,  0.3,1,1), createNormales(-1, 1,-1), createSquareTexture(textureIndex));
            rectangles[1]   = createRectangle( createCorners(1,0.3,0,  0,1,0,  0.3,1,1,  1,0,1), createNormales(1,-1,1), createSquareTexture(textureIndex, Orientation.Flip));
        }
        if(face == BlockFaces.Back) {
            rectangles[0]   = createRectangle( createCorners(0,0,0,  1,0.3,0,  1,1,1,  0,1,0.7), createNormales(-1, 1,-1), createSquareTexture(textureIndex));
            rectangles[1]   = createRectangle( createCorners(1,0.3,0,  0,0,0,  0,1,0.7,  1,1,1), createNormales(1,-1,1), createSquareTexture(textureIndex, Orientation.Flip));
        }
        if(face == BlockFaces.Front) {
            rectangles[0]   = createRectangle( createCorners(0,1,0,  1,1,0.3,  1,0,1,  0,0.3,1), createNormales(-1, 1,-1), createSquareTexture(textureIndex));
            rectangles[1]   = createRectangle( createCorners(1,1,0.3,  0,1,0,  0,0.3,1,  1,0,1), createNormales(1,-1,1), createSquareTexture(textureIndex, Orientation.Flip));
        }
        if(face == BlockFaces.Bottom) {
            rectangles[0]   = createRectangle( createCorners(0,0,0.3,  1,0,0.5,  1,1,0.7,  0,1,0.6), createNormales(-1, 1,-1), createSquareTexture(textureIndex));
            rectangles[1]   = createRectangle( createCorners(1,0,0.5,  0,0,0.3,  0,1,0.6,  1,1,0.7), createNormales(1,-1,1), createSquareTexture(textureIndex, Orientation.Flip));
        }
        if(face == BlockFaces.Top) {
            rectangles[0]   = createRectangle( createCorners(0.7,0,1,  0.3,0,0,  0.3,1,0,  0.7,1,1), createNormales(-1, 1,-1), createSquareTexture(textureIndex));
            rectangles[1]   = createRectangle( createCorners(0.3,0,0,  0.7,0,1,  0.7,1,1,  0.3,1,0), createNormales(1,-1,1), createSquareTexture(textureIndex, Orientation.Flip));
        }
        
        
        const info           = createInfo();
        info.innerRectangles = combineRectangles(rectangles);
        info.isTransparent   = true;
        info.isPermeable     = true;        
        return info;
    }


    function createWedgeInfo(topTextureIndex, sideTextureIndex, bottomTextureIndex, frontTextureIndex, face) {
        const info           = createInfo();
        if(face == BlockFaces.Left) {
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,    0,0,1,    1,0,1), bottomNormales, createSquareTexture(bottomTextureIndex));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,0.5,0,  0,0.5,0), backNormales, createBottomHalfeTexture(sideTextureIndex,   Orientation.Flip));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,0.5,1,  1,0.5,1), frontNormales, createBottomHalfeTexture(sideTextureIndex,  Orientation.Normal));
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,0.5,0,  0,0.5,1), leftNormales, createBottomHalfeTexture(frontTextureIndex));
            info.innerRectangles = createRectangle( createCorners(0,0.5,0,  1,0,0,  1,0,1,  0,0.5,1), createNormales(0.5, 1,0), createSquareTexture(topTextureIndex, Orientation.Turn90));
        }
        else if(face == BlockFaces.Right) {
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,    0,0,1,    1,0,1), bottomNormales, createSquareTexture(bottomTextureIndex));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,0.5,0,  0,0.5,0), backNormales, createBottomHalfeTexture(sideTextureIndex,   Orientation.Normal));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,0.5,1,  1,0.5,1), frontNormales, createBottomHalfeTexture(sideTextureIndex,  Orientation.Flip));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,0.5,1,  1,0.5,0), rightNormales, createBottomHalfeTexture(frontTextureIndex));
            info.innerRectangles = createRectangle( createCorners(0,0,0,  1,0.5,0,  1,0.5,1,  0,0,1), createNormales(-0.5, 1,0), createSquareTexture(topTextureIndex, Orientation.Turn90));
        }
        else if(face == BlockFaces.Back) {
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,    0,0,1,    1,0,1), bottomNormales, createSquareTexture(bottomTextureIndex));
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,0.5,0,  0,0.5,1), leftNormales, createBottomHalfeTexture(sideTextureIndex,   Orientation.Normal));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,0.5,1,  1,0.5,0), rightNormales, createBottomHalfeTexture(sideTextureIndex,  Orientation.Flip));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,0.5,0,  0,0.5,0), backNormales, createBottomHalfeTexture(frontTextureIndex));
            info.innerRectangles = createRectangle( createCorners(0,0.5,0,  1,0.5,0,  1,0,1,  0,0,1), createNormales(0, 1,0.5), createSquareTexture(topTextureIndex, Orientation.Normal));
        }
        else if(face == BlockFaces.Front) {
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,    0,0,1,    1,0,1), bottomNormales, createSquareTexture(bottomTextureIndex));
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,0.5,0,  0,0.5,1), leftNormales, createBottomHalfeTexture(sideTextureIndex,   Orientation.Flip));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,0.5,1,  1,0.5,0), rightNormales, createBottomHalfeTexture(sideTextureIndex,  Orientation.Normal));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,0.5,1,  1,0.5,1), frontNormales, createBottomHalfeTexture(frontTextureIndex));
            info.innerRectangles = createRectangle( createCorners(0,0,0,  1,0,0,  1,0.5,1,  0,0.5,1), createNormales(0, 1,-0.5), createSquareTexture(topTextureIndex, Orientation.Normal));
        }

        info.isTransparent   = true;
        info.hasBlockSides   = true;
        return info;
    }


    function createHighWedgeInfo(topTextureIndex, sideTextureIndex, bottomTextureIndex, backTextureIndex, frontTextureIndex, face) {
        const info           = createInfo();
        if(face == BlockFaces.Left) {
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,  0,0,1,  1,0,1), bottomNormales, createSquareTexture(bottomTextureIndex));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,1,0,  0,1,0), backNormales, createSquareTexture(sideTextureIndex,   Orientation.Flip));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,1,1,  1,1,1), frontNormales, createSquareTexture(sideTextureIndex,  Orientation.Normal));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,0.5,1,  1,0.5,0), rightNormales, createBottomHalfeTexture(backTextureIndex));
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,1,0,  0,1,1), leftNormales, createSquareTexture(frontTextureIndex));
            info.innerRectangles = createRectangle( createCorners(0,1,0,  1,0.5,0,  1,0.5,1,  0,1,1), createNormales(0.5, 1,0), createSquareTexture(topTextureIndex, Orientation.Turn90));
        }
        else if(face == BlockFaces.Right) {
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,  0,0,1,  1,0,1), bottomNormales, createSquareTexture(bottomTextureIndex));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,1,0,  0,1,0), backNormales, createSquareTexture(sideTextureIndex,   Orientation.Normal));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,1,1,  1,1,1), frontNormales, createSquareTexture(sideTextureIndex,  Orientation.Flip));
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,0.5,0,  0,0.5,1), leftNormales, createBottomHalfeTexture(backTextureIndex));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,1,1,  1,1,0), rightNormales, createSquareTexture(frontTextureIndex));
            info.innerRectangles = createRectangle( createCorners(0,0.5,0,  1,1,0,  1,1,1,  0,0.5,1), createNormales(-0.5, 1,0), createSquareTexture(topTextureIndex, Orientation.Turn90));
        }
        else if(face == BlockFaces.Back) {
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,  0,0,1,  1,0,1), bottomNormales, createSquareTexture(bottomTextureIndex));
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,1,0,  0,1,1), leftNormales, createSquareTexture(sideTextureIndex,   Orientation.Normal));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,1,1,  1,1,0), rightNormales, createSquareTexture(sideTextureIndex,  Orientation.Flip));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,0.5,1,  1,0.5,1), frontNormales, createBottomHalfeTexture(backTextureIndex));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,1,0,  0,1,0), backNormales, createSquareTexture(frontTextureIndex));
            info.innerRectangles = createRectangle( createCorners(0,1,0,  1,1,0,  1,0.5,1,  0,0.5,1), createNormales(0, 1,0.5), createSquareTexture(topTextureIndex, Orientation.Normal));
        }
        else if(face == BlockFaces.Front) {
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,  0,0,1,  1,0,1), bottomNormales, createSquareTexture(bottomTextureIndex));
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,1,0,  0,1,1), leftNormales, createSquareTexture(sideTextureIndex,   Orientation.Flip));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,1,1,  1,1,0), rightNormales, createSquareTexture(sideTextureIndex,  Orientation.Normal));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,0.5,0,  0,0.5,0), backNormales, createBottomHalfeTexture(backTextureIndex));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,1,1,  1,1,1), frontNormales, createSquareTexture(frontTextureIndex));
            info.innerRectangles = createRectangle( createCorners(0,0.5,0,  1,0.5,0,  1,1,1,  0,1,1), createNormales(0, 1,-0.5), createSquareTexture(topTextureIndex, Orientation.Normal));
        }

        info.isTransparent   = true;
        info.hasBlockSides   = true;
        return info;
    }

    function createWallTorchInfo(textureIndex, textureWallIndex, face) {
        const h            = 0.85;
        const d            = 0.36;
        const r            = 0.18;
        const f            = 0.5-r;
        const t            = 0.5+r;
        const rectangles   = [];        
        if(face == BlockFaces.Left) {
            rectangles[0]      = createRectangle( createCorners(r,0,t,  r,0,f,  r,h,f,  r,h,t), leftNormales, createFlowerTexture(textureIndex, Orientation.Flip, r, h));
            rectangles[1]      = createRectangle( createCorners(r,0,f,  r,0,t,  r,h,t,  r,h,f), rightNormales, createFlowerTexture(textureIndex, Orientation.Normal, r, h));
            rectangles[2]      = createRectangle( createCorners(0,0,0.5,  d,0,0.5,  d,h,0.5,  0,h,0.5), backNormales, createFlowerTexture(textureWallIndex, Orientation.Normal, r, h));
            rectangles[3]      = createRectangle( createCorners(d,0,0.5,  0,0,0.5,  0,h,0.5,  d,h,0.5), frontNormales, createFlowerTexture(textureWallIndex, Orientation.Flip, r, h));    
        }
        else if(face == BlockFaces.Right) {
            rectangles[0]      = createRectangle( createCorners(1-r,0,t,  1-r,0,f,  1-r,h,f,  1-r,h,t), leftNormales, createFlowerTexture(textureIndex, Orientation.Flip, r, h));
            rectangles[1]      = createRectangle( createCorners(1-r,0,f,  1-r,0,t,  1-r,h,t,  1-r,h,f), rightNormales, createFlowerTexture(textureIndex, Orientation.Normal, r, h));
            rectangles[2]      = createRectangle( createCorners(1-d,0,0.5,  1,0,0.5,  1,h,0.5,  1-d,h,0.5), backNormales, createFlowerTexture(textureWallIndex, Orientation.Flip, r, h));
            rectangles[3]      = createRectangle( createCorners(1,0,0.5,  1-d,0,0.5,  1-d,h,0.5,  1,h,0.5), frontNormales, createFlowerTexture(textureWallIndex, Orientation.Normal, r, h));    
        }
        else if(face == BlockFaces.Back) {
            rectangles[0]      = createRectangle( createCorners(0.5,0,d,  0.5,0,0,  0.5,h,0,  0.5,h,d), leftNormales, createFlowerTexture(textureWallIndex, Orientation.Flip, r, h));
            rectangles[1]      = createRectangle( createCorners(0.5,0,0,  0.5,0,d,  0.5,h,d,  0.5,h,0), rightNormales, createFlowerTexture(textureWallIndex, Orientation.Normal, r, h));
            rectangles[2]      = createRectangle( createCorners(f,0,r,  t,0,r,  t,h,r,  f,h,r), backNormales, createFlowerTexture(textureIndex, Orientation.Flip, r, h));
            rectangles[3]      = createRectangle( createCorners(t,0,r,  f,0,r,  f,h,r,  t,h,r), frontNormales, createFlowerTexture(textureIndex, Orientation.Normal, r, h));    
        }
        else if(face == BlockFaces.Front) {
            rectangles[0]      = createRectangle( createCorners(0.5,0,1,  0.5,0,1-d,  0.5,h,1-d,  0.5,h,1), leftNormales, createFlowerTexture(textureWallIndex, Orientation.Normal, r, h));
            rectangles[1]      = createRectangle( createCorners(0.5,0,1-d,  0.5,0,1,  0.5,h,1,  0.5,h,1-d), rightNormales, createFlowerTexture(textureWallIndex, Orientation.Flip, r, h));
            rectangles[2]      = createRectangle( createCorners(f,0,1-r,  t,0,1-r,  t,h,1-r,  f,h,1-r), backNormales, createFlowerTexture(textureIndex, Orientation.Flip, r, h));
            rectangles[3]      = createRectangle( createCorners(t,0,1-r,  f,0,1-r,  f,h,1-r,  t,h,1-r), frontNormales, createFlowerTexture(textureIndex, Orientation.Normal, r, h));    
        }

        const info           = createInfo();
        info.innerRectangles = combineRectangles(rectangles);
        info.isTransparent   = true;
        return info;
    }


    function createSingleSideInfo(textureIndex, face) {
        const info           = createInfo();
        info.isTransparent   = true;
        info.hasBlockSides   = true;
        if(face == BlockFaces.Left) {
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,1,0,  0,1,1), leftNormales, createSquareTexture(textureIndex,  Orientation.Flip));
            info.innerRectangles = createRectangle( createCorners(0.01,0,0,  0.01,0,1,  0.01,1,1,  0.01,1,0), rightNormales, createSquareTexture(textureIndex));
        }
        else if(face == BlockFaces.Right) {
            info.innerRectangles = createRectangle( createCorners(0.99,0,1,  0.99,0,0,  0.99,1,0,  0.99,1,1), leftNormales, createSquareTexture(textureIndex));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,1,1,  1,1,0), rightNormales, createSquareTexture(textureIndex,  Orientation.Flip));
        }
        else if(face == BlockFaces.Back) {
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,1,0,  0,1,0), backNormales, createSquareTexture(textureIndex,   Orientation.Flip));
            info.innerRectangles = createRectangle( createCorners(1,0,0.01,  0,0,0.01,  0,1,0.01,  1,1,0.01), frontNormales, createSquareTexture(textureIndex));
            }
        else if(face == BlockFaces.Front) {
            info.innerRectangles = createRectangle( createCorners(0,0,0.99,  1,0,0.99,  1,1,0.99,  0,1,0.99), backNormales, createSquareTexture(textureIndex));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,1,1,  1,1,1), frontNormales, createSquareTexture(textureIndex,   Orientation.Flip));
            }
        else if(face == BlockFaces.Bottom) {
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,  0,0,1,  1,0,1), bottomNormales, createSquareTexture(textureIndex));
            info.innerRectangles = createRectangle( createCorners(0,0.01,0,  1,0.01,0,  1,0.01,1,  0,0.01,1), topNormales, createSquareTexture(textureIndex,   Orientation.Flip));
            }
        else if(face == BlockFaces.Top) {
            info.innerRectangles = createRectangle( createCorners(1,0.99,0,  0,0.99,0,  0,0.99,1,  1,0.99,1), bottomNormales, createSquareTexture(textureIndex));
            info.topRectangle    = createRectangle( createCorners(0,1,0,  1,1,0,  1,1,1,  0,1,1), topNormales, createSquareTexture(textureIndex,   Orientation.Flip));
            }
        else {
            fail("unknown face " + face);
        }

        return info;
    }


    function createPlaneInfo(frontTextureIndex, backTextureIndex, orientation, isPermeable) {
        const rectangles      = [];
        if(orientation == Orientation.Turn270) {
            rectangles[0]   = createRectangle( createCorners(0,0,0.499,  1,0,0.499,  1,1,0.499,  0,1,0.499), backNormales, createSquareTexture(backTextureIndex,  Orientation.Normal));
            rectangles[1]   = createRectangle( createCorners(1,0,0.501,  0,0,0.501,  0,1,0.501,  1,1,0.501), frontNormales, createSquareTexture(frontTextureIndex,  Orientation.Flip));    
        }
        else if(orientation == Orientation.Turn180) {
            rectangles[0]   = createRectangle( createCorners(0.499,0,1,  0.499,0,0,  0.499,1,0,  0.499,1,1), leftNormales, createSquareTexture(backTextureIndex,  Orientation.Normal));
            rectangles[1]   = createRectangle( createCorners(0.501,0,0,  0.501,0,1,  0.501,1,1,  0.501,1,0), rightNormales, createSquareTexture(frontTextureIndex,  Orientation.Flip));
        }
        else if(orientation == Orientation.Turn90) {
            rectangles[0]   = createRectangle( createCorners(0,0,0.499,  1,0,0.499,  1,1,0.499,  0,1,0.499), backNormales, createSquareTexture(frontTextureIndex,  Orientation.Normal));
            rectangles[1]   = createRectangle( createCorners(1,0,0.501,  0,0,0.501,  0,1,0.501,  1,1,0.501), frontNormales, createSquareTexture(backTextureIndex,  Orientation.Flip));    
        }
        else {
            rectangles[0]   = createRectangle( createCorners(0.499,0,1,  0.499,0,0,  0.499,1,0,  0.499,1,1), leftNormales, createSquareTexture(frontTextureIndex,  Orientation.Normal));
            rectangles[1]   = createRectangle( createCorners(0.501,0,0,  0.501,0,1,  0.501,1,1,  0.501,1,0), rightNormales, createSquareTexture(backTextureIndex,  Orientation.Flip));
        }

        const info           = createInfo();
        info.innerRectangles = combineRectangles(rectangles);
        info.isTransparent   = true;
        if(isPermeable) info.isPermeable = true;
        return info;
    }


    function createSidePlaneInfo(frontTextureIndex, backTextureIndex, face, isPermeable) {
        const w = 0.5;
        const v = 0.5;
        const rectangles      = [];
        if( face == BlockFaces.Left ) {
            rectangles[0]   = createRectangle( createCorners(0,0,0.499,  w,0,0.499,  w,1,0.499,  0,1,0.499), backNormales, createLeftHalfeTexture(backTextureIndex,  Orientation.Normal));
            rectangles[1]   = createRectangle( createCorners(w,0,0.501,  0,0,0.501,  0,1,0.501,  w,1,0.501), frontNormales, createLeftHalfeTexture(frontTextureIndex,  Orientation.Flip));    
        }
        else if( face == BlockFaces.Back ) {
            rectangles[0]   = createRectangle( createCorners(0.499,0,w,  0.499,0,0,  0.499,1,0,  0.499,1,w), leftNormales, createLeftHalfeTexture(backTextureIndex,  Orientation.Flip));
            rectangles[1]   = createRectangle( createCorners(0.501,0,0,  0.501,0,w,  0.501,1,w,  0.501,1,0), rightNormales, createLeftHalfeTexture(frontTextureIndex,  Orientation.Normal));
        }
        else if( face == BlockFaces.Right ) {
            rectangles[0]   = createRectangle( createCorners(v,0,0.499,  1,0,0.499,  1,1,0.499,  v,1,0.499), backNormales, createLeftHalfeTexture(frontTextureIndex,  Orientation.Flip));
            rectangles[1]   = createRectangle( createCorners(1,0,0.501,  v,0,0.501,  v,1,0.501,  1,1,0.501), frontNormales, createLeftHalfeTexture(backTextureIndex,  Orientation.Normal));    
        }
        else if( face == BlockFaces.Front ) {
            rectangles[0]   = createRectangle( createCorners(0.499,0,1,  0.499,0,v,  0.499,1,v,  0.499,1,1), leftNormales, createLeftHalfeTexture(frontTextureIndex,  Orientation.Normal));
            rectangles[1]   = createRectangle( createCorners(0.501,0,v,  0.501,0,1,  0.501,1,1,  0.501,1,v), rightNormales, createLeftHalfeTexture(backTextureIndex,  Orientation.Flip));
        }
        else fail("invalid face value " + face); 

        const info           = createInfo();
        info.innerRectangles = combineRectangles(rectangles);
        info.isTransparent   = true;
        if(isPermeable) info.isPermeable = true;
        return info;
    }


    function createHorizontalPlaneInfo(textureIndex) {
        const rectangles     = [];
        rectangles[0]        = createRectangle( createCorners(1,0.499,0,  0,0.499,0,  0,0.499,1,  1,0.499,1), bottomNormales, createSquareTexture(textureIndex));
        rectangles[1]        = createRectangle( createCorners(0,0.501,0,  1,0.501,0,  1,0.501,1,  0,0.501,1), topNormales, createSquareTexture(textureIndex,   Orientation.Flip));

        const info           = createInfo();
        info.innerRectangles = combineRectangles(rectangles);
        info.isTransparent   = true;
        return info;
    }


    function createGateOpenInfo(textureIndex, orientation) {
        const info           = createInfo();
        const rectangles     = [];
        if(orientation == Orientation.Turn90) {
            info.leftRectangle  = createRectangle( createCorners(0,0,1,       0,0,0.5,    0,1,0.5,    0,1,1),      leftNormales, createLeftHalfeTexture(textureIndex,  Orientation.Flip));
            rectangles[0]       = createRectangle( createCorners(0.01,0,0.5,  0.01,0,1,   0.01,1,1,   0.01,1,0.5), rightNormales, createLeftHalfeTexture(textureIndex,  Orientation.Normal));
            rectangles[1]       = createRectangle( createCorners(0.99,0,1,    0.99,0,0.5, 0.99,1,0.5, 0.99,1,1),   leftNormales, createRightHalfeTexture(textureIndex, Orientation.Normal));
            info.rightRectangle = createRectangle( createCorners(1,0,0.5,     1,0,1,      1,1,1,      1,1,0.5),    rightNormales, createRightHalfeTexture(textureIndex, Orientation.Flip));
        }
        else {
            info.backRectangle  = createRectangle( createCorners(0.5,0,0,    1,0,0,      1,1,0,      0.5,1,0),    backNormales, createRightHalfeTexture(textureIndex,   Orientation.Flip));
            rectangles[0]       = createRectangle( createCorners(1,0,0.01,   0.5,0,0.01, 0.5,1,0.01, 1,1,0.01),   frontNormales, createRightHalfeTexture(textureIndex,   Orientation.Normal));    
            rectangles[1]       = createRectangle( createCorners(0.5,0,0.99, 1,0,0.99,   1,1,0.99,   0.5,1,0.99), backNormales, createLeftHalfeTexture(textureIndex,  Orientation.Normal));
            info.frontRectangle = createRectangle( createCorners(1,0,1,      0.5,0,1,    0.5,1,1,    1,1,1),      frontNormales, createLeftHalfeTexture(textureIndex,  Orientation.Flip));    
        }

        info.innerRectangles = combineRectangles(rectangles);
        info.isTransparent   = true;
        info.hasBlockSides   = true;
        return info;
    }


    function createTableInfo(sideTextureIndex, bottomTextureIndex, topTextureIndex) {
        const rectangles     = [];
        const info           = createInfo();
        info.hasBlockSides   = true;
        
        info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,1,0,  0,1,1), leftNormales, createSquareTexture(sideTextureIndex));
        rectangles[0]        = createRectangle( createCorners(0.89,0,1,  0.89,0,0,  0.89,1,0,  0.89,1,1), leftNormales, createSquareTexture(sideTextureIndex));

        info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,1,1,  1,1,0), rightNormales, createSquareTexture(sideTextureIndex));
        rectangles[1]        = createRectangle( createCorners(0.11,0,0,  0.11,0,1,  0.11,1,1, 0.11,1,0), rightNormales, createSquareTexture(sideTextureIndex));
        
        info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,1,0,  0,1,0), backNormales, createSquareTexture(sideTextureIndex));
        rectangles[2]        = createRectangle( createCorners(0,0,0.89,  1,0,0.89,  1,1,0.89,  0,1,0.89), backNormales, createSquareTexture(sideTextureIndex));
        
        info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,1,1,  1,1,1), frontNormales, createSquareTexture(sideTextureIndex));
        rectangles[3]        = createRectangle( createCorners(1,0,0.11,  0,0,0.11,  0,1,0.11,  1,1,0.11), frontNormales, createSquareTexture(sideTextureIndex));
        
        info.topRectangle    = createRectangle( createCorners(0,1,0,  1,1,0,  1,1,1,  0,1,1), topNormales, createSquareTexture(topTextureIndex));
        rectangles[4]        = createRectangle( createCorners(1,0.9,0,  0,0.9,0,  0,0.9,1,  1,0.9,1), bottomNormales, createSquareTexture(bottomTextureIndex));
        
        info.innerRectangles = combineRectangles(rectangles);
        info.isTransparent   = true;
        return info;
    }


    function createChairInfo(sideTextureIndex, backTextureIndex, frontTextureIndex, topTextureIndex, orientation) {
        const rectangles      = [];
        
        let leftIndex, leftInnerIndex;
        let leftOrientation, leftInnerOrientation;
        let rightIndex, rightInnerIndex;
        let rightOrientation, rightInnerOrientation;
        let backIndex, backInnerIndex;
        let backOrientation, backInnerOrientation;
        let frontIndex, frontInnerIndex;
        let frontOrientation, frontInnerOrientation;
        let topIndex, bottomIndex;
        let topOrientation, bottomOrientation;

        if(orientation == Orientation.Normal) {
            leftIndex       = backTextureIndex;     leftOrientation       = Orientation.Normal;
            leftInnerIndex  = backTextureIndex;     leftInnerOrientation  = Orientation.Normal;
            rightIndex      = frontTextureIndex;    rightOrientation      = Orientation.Normal;
            rightInnerIndex = frontTextureIndex;    rightInnerOrientation = Orientation.Normal;
            backIndex       = sideTextureIndex;     backOrientation       = Orientation.Normal;
            backInnerIndex  = sideTextureIndex;     backInnerOrientation  = Orientation.Flip;
            frontIndex      = sideTextureIndex;     frontOrientation      = Orientation.Flip;
            frontInnerIndex = sideTextureIndex;     frontInnerOrientation = Orientation.Normal;
            topIndex        = topTextureIndex;      topOrientation        = Orientation.Normal;
            bottomIndex     = topTextureIndex;      bottomOrientation     = Orientation.Normal;
            rectangles[10]  = createRectangle( createCorners(0.110,1,0.110,  0.215,1,0.110,  0.215,1,0.890,  0.110,1,0.890), topNormales, createSquareTexture(topTextureIndex,    topOrientation));        
        }
        else if(orientation == Orientation.Turn90) {
            leftIndex       = sideTextureIndex;     leftOrientation       = Orientation.Flip;
            leftInnerIndex  = sideTextureIndex;     leftInnerOrientation  = Orientation.Normal;
            rightIndex      = sideTextureIndex;     rightOrientation      = Orientation.Normal;
            rightInnerIndex = sideTextureIndex;     rightInnerOrientation = Orientation.Flip;
            backIndex       = backTextureIndex;     backOrientation       = Orientation.Normal;
            backInnerIndex  = backTextureIndex;     backInnerOrientation  = Orientation.Normal;
            frontIndex      = frontTextureIndex;    frontOrientation      = Orientation.Normal;
            frontInnerIndex = frontTextureIndex;    frontInnerOrientation = Orientation.Normal;
            topIndex        = topTextureIndex;      topOrientation        = Orientation.Normal;
            bottomIndex     = topTextureIndex;      bottomOrientation     = Orientation.Normal;
            rectangles[10]  = createRectangle( createCorners(0.110,1,0.110,  0.890,1,0.110,  0.890,1,0.215,  0.110,1,0.215), topNormales, createSquareTexture(topTextureIndex,    topOrientation));        
        }
        else if(orientation == Orientation.Turn180) {
            leftIndex       = frontTextureIndex;    leftOrientation       = Orientation.Normal;
            leftInnerIndex  = frontTextureIndex;    leftInnerOrientation  = Orientation.Normal;
            rightIndex      = backTextureIndex;     rightOrientation      = Orientation.Normal;
            rightInnerIndex = backTextureIndex;     rightInnerOrientation = Orientation.Normal;
            backIndex       = sideTextureIndex;     backOrientation       = Orientation.Flip;
            backInnerIndex  = sideTextureIndex;     backInnerOrientation  = Orientation.Normal;
            frontIndex      = sideTextureIndex;     frontOrientation      = Orientation.Normal;
            frontInnerIndex = sideTextureIndex;     frontInnerOrientation = Orientation.Flip;
            topIndex        = topTextureIndex;      topOrientation        = Orientation.Normal;
            bottomIndex     = topTextureIndex;      bottomOrientation     = Orientation.Normal;
            rectangles[10]  = createRectangle( createCorners(0.790,1,0.110,  0.890,1,0.110,  0.890,1,0.890,  0.790,1,0.890), topNormales, createSquareTexture(topTextureIndex,    topOrientation));        
        }
        else if(orientation == Orientation.Turn270) {
            leftIndex       = sideTextureIndex;     leftOrientation       = Orientation.Normal;
            leftInnerIndex  = sideTextureIndex;     leftInnerOrientation  = Orientation.Flip;
            rightIndex      = sideTextureIndex;     rightOrientation      = Orientation.Flip;
            rightInnerIndex = sideTextureIndex;     rightInnerOrientation = Orientation.Normal;
            backIndex       = frontTextureIndex;    backOrientation       = Orientation.Normal;
            backInnerIndex  = frontTextureIndex;    backInnerOrientation  = Orientation.Normal;
            frontIndex      = backTextureIndex;     frontOrientation      = Orientation.Normal;
            frontInnerIndex = backTextureIndex;     frontInnerOrientation = Orientation.Normal;
            topIndex        = topTextureIndex;      topOrientation        = Orientation.Normal;
            bottomIndex     = topTextureIndex;      bottomOrientation     = Orientation.Normal;
            rectangles[10]  = createRectangle( createCorners(0.110,1,0.790,  0.890,1,0.790,  0.890,1,0.890,  0.110,1,0.890), topNormales, createSquareTexture(topTextureIndex,    topOrientation));        
        }

        rectangles[0]   = createRectangle( createCorners(0.110,0,1,  0.110,0,0,  0.110,1,0,  0.110,1,1), leftNormales, createSquareTexture(leftIndex,       leftOrientation));
        rectangles[1]   = createRectangle( createCorners(0.215,0,0,  0.215,0,1,  0.215,1,1,  0.215,1,0), rightNormales, createSquareTexture(leftInnerIndex,  leftInnerOrientation));
        
        rectangles[2]   = createRectangle( createCorners(0.790,0,1,  0.790,0,0,  0.790,1,0,  0.790,1,1), leftNormales, createSquareTexture(rightInnerIndex, rightInnerOrientation));
        rectangles[3]   = createRectangle( createCorners(0.890,0,0,  0.890,0,1,  0.890,1,1,  0.890,1,0), rightNormales, createSquareTexture(rightIndex,      rightOrientation));

        rectangles[4]   = createRectangle( createCorners(0,0,0.110,  1,0,0.110,  1,1,0.110,  0,1,0.110), backNormales, createSquareTexture(backIndex,       backOrientation));
        rectangles[5]   = createRectangle( createCorners(1,0,0.215,  0,0,0.215,  0,1,0.215,  1,1,0.215), frontNormales, createSquareTexture(backInnerIndex,  backInnerOrientation));
        
        rectangles[6]   = createRectangle( createCorners(0,0,0.790,  1,0,0.790,  1,1,0.790,  0,1,0.790), backNormales, createSquareTexture(frontInnerIndex, frontInnerOrientation));
        rectangles[7]   = createRectangle( createCorners(1,0,0.890,  0,0,0.890,  0,1,0.890,  1,1,0.890), frontNormales, createSquareTexture(frontIndex,      frontOrientation));
        
        rectangles[8]   = createRectangle( createCorners(0.890,0.390,0.110,  0.110,0.390,0.110,  0.110,0.390,0.890,  0.890,0.390,0.890), bottomNormales, createSquareTexture(bottomIndex, bottomOrientation));
        rectangles[9]   = createRectangle( createCorners(0.110,0.500,0.110,  0.890,0.500,0.110,  0.890,0.500,0.890,  0.110,0.500,0.890), topNormales, createSquareTexture(topIndex,    topOrientation));                

        const info           = createInfo();
        info.isTransparent   = true;
        info.innerRectangles = combineRectangles(rectangles);
        return info;
    }


    function createLowerHalfBlockInfo(leftTextureIndex, backTextureIndex, rightTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex, orientation) {
        let leftIndex, rightIndex, backIndex, frontIndex, bottomIndex, topIndex;
        let leftOrientation, rightOrientation, backOrientation, frontOrientation, bottomOrientation, topOrientation;
        if(orientation == Orientation.Normal)  {  // head to the right
            leftIndex   = leftTextureIndex;    leftOrientation  = Orientation.Normal;
            backIndex   = backTextureIndex;    backOrientation  = Orientation.Normal;
            rightIndex  = rightTextureIndex;   rightOrientation = Orientation.Flip;
            frontIndex  = frontTextureIndex;   frontOrientation = Orientation.Flip;
            bottomIndex = bottomTextureIndex;  bottomOrientation = Orientation.Normal;
            topIndex    = topTextureIndex;     topOrientation    = Orientation.Normal;
        }
        else if(orientation == Orientation.Turn90)  {  
            leftIndex   = backTextureIndex;    leftOrientation  = Orientation.Normal;
            backIndex   = rightTextureIndex;   rightOrientation = Orientation.Flip;
            rightIndex  = frontTextureIndex;   backOrientation  = Orientation.Flip;
            frontIndex  = leftTextureIndex;    frontOrientation = Orientation.Normal;
            bottomIndex = bottomTextureIndex;  bottomOrientation = Orientation.Turn270;
            topIndex    = topTextureIndex;     topOrientation    = Orientation.Turn270;
        }
        else if(orientation == Orientation.Turn180)  { 
            leftIndex   = rightTextureIndex;   leftOrientation  = Orientation.Flip;
            backIndex   = frontTextureIndex;   rightOrientation = Orientation.Normal;
            rightIndex  = leftTextureIndex;    backOrientation  = Orientation.Flip;
            frontIndex  = backTextureIndex;    frontOrientation = Orientation.Normal;
            bottomIndex = bottomTextureIndex;  bottomOrientation = Orientation.Turn180;
            topIndex    = topTextureIndex;     topOrientation    = Orientation.Turn180;
        }
        else if(orientation == Orientation.Turn270)  {  
            leftIndex   = frontTextureIndex;   leftOrientation  = Orientation.Flip;
            backIndex   = leftTextureIndex;    rightOrientation = Orientation.Normal;
            rightIndex  = backTextureIndex;    backOrientation  = Orientation.Normal;
            frontIndex  = rightTextureIndex;   frontOrientation = Orientation.Flip;
            bottomIndex = bottomTextureIndex;  bottomOrientation = Orientation.Turn90;
            topIndex    = topTextureIndex;     topOrientation    = Orientation.Turn90;
        }

        const rectangles     = [];
        const info           = createInfo();
        info.isTransparent   = true;
        info.hasBlockSides   = true;
        info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,0.5,0,  0,0.5,1), leftNormales, createRectangleTexture(leftIndex,   leftOrientation, 0, 0, 0, 32));
        info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,0.5,1,  1,0.5,0), rightNormales, createRectangleTexture(rightIndex,  rightOrientation, 0, 0, 0, 32));
        info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,0.5,0,  0,0.5,0), backNormales, createRectangleTexture(backIndex,   backOrientation, 0, 0, 0, 32));
        info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,0.5,1,  1,0.5,1), frontNormales, createRectangleTexture(frontIndex,  frontOrientation, 0, 0, 0, 32));
        info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,  0,0,1,    1,0,1  ), bottomNormales,  createSquareTexture(bottomIndex, bottomOrientation));

        info.innerRectangles = createRectangle( createCorners(0,0.5,0,  1,0.5,0,  1,0.5,1,  0,0.5,1), topNormales,      createSquareTexture(topIndex,    topOrientation));
        return info;
    }


    function createUpperHalfBlockInfo(leftTextureIndex, backTextureIndex, rightTextureIndex, frontTextureIndex, bottomTextureIndex, topTextureIndex, orientation) {
        let leftIndex, rightIndex, backIndex, frontIndex, bottomIndex, topIndex;
        let leftOrientation, rightOrientation, backOrientation, frontOrientation, bottomOrientation, topOrientation;
        if(orientation == Orientation.Normal)  {  // head to the right
            leftIndex  = backTextureIndex;    leftOrientation  = Orientation.Normal;
            rightIndex = frontTextureIndex;   rightOrientation = Orientation.Normal;
            backIndex  = rightTextureIndex;   backOrientation  = Orientation.Normal;
            frontIndex = leftTextureIndex;    frontOrientation = Orientation.Flip;
            bottomIndex = bottomTextureIndex; bottomOrientation = Orientation.Normal;
            topIndex    = topTextureIndex;    topOrientation    = Orientation.Normal;
        }
        else if(orientation == Orientation.Turn90)  {  
            leftIndex  = leftTextureIndex;    leftOrientation  = Orientation.Flip;
            rightIndex = rightTextureIndex;   rightOrientation = Orientation.Normal;
            backIndex  = backTextureIndex;    backOrientation  = Orientation.Normal;
            frontIndex = frontTextureIndex;   frontOrientation = Orientation.Normal;
            bottomIndex = bottomTextureIndex; bottomOrientation = Orientation.Turn90;
            topIndex    = topTextureIndex;    topOrientation    = Orientation.Turn90;
        }
        else if(orientation == Orientation.Turn180)  { 
            leftIndex  = frontTextureIndex;   leftOrientation  = Orientation.Normal;
            rightIndex = backTextureIndex;    rightOrientation = Orientation.Normal;
            backIndex  = leftTextureIndex;    backOrientation  = Orientation.Flip;
            frontIndex = rightTextureIndex;   frontOrientation = Orientation.Normal;
            bottomIndex = bottomTextureIndex; bottomOrientation = Orientation.Turn180;
            topIndex    = topTextureIndex;    topOrientation    = Orientation.Turn180;
        }
        else if(orientation == Orientation.Turn270)  {  
            leftIndex  = rightTextureIndex;   leftOrientation  = Orientation.Normal;
            rightIndex = leftTextureIndex;    rightOrientation = Orientation.Flip;
            backIndex  = frontTextureIndex;   backOrientation  = Orientation.Normal;
            frontIndex = backTextureIndex;    frontOrientation = Orientation.Normal;
            bottomIndex = bottomTextureIndex; bottomOrientation = Orientation.Turn270;
            topIndex    = topTextureIndex;    topOrientation    = Orientation.Turn270;
        }

        const info           = createInfo();
        info.isTransparent   = true;
        info.hasBlockSides   = true;
        info.leftRectangle   = createRectangle( createCorners(0,0.5,1,  0,0.5,0,  0,1,0,   0,1,1), leftNormales, createRectangleTexture(leftIndex,   leftOrientation, 0, 0, 0, 32));
        info.rightRectangle  = createRectangle( createCorners(1,0.5,0,  1,0.5,1,  1,1,1,   1,1,0), rightNormales, createRectangleTexture(rightIndex,  rightOrientation, 0, 0, 0, 32));
        info.backRectangle   = createRectangle( createCorners(0,0.5,0,  1,0.5,0,  1,1,0,   0,1,0), backNormales, createRectangleTexture(backIndex,   backOrientation, 0, 0, 0, 32));
        info.frontRectangle  = createRectangle( createCorners(1,0.5,1,  0,0.5,1,  0,1,1,   1,1,1), frontNormales, createRectangleTexture(frontIndex,  frontOrientation, 0, 0, 0, 32));
        info.topRectangle    = createRectangle( createCorners(0,1,0,    1,1,0,    1,1,1,   0,1,1), topNormales,   createSquareTexture(topIndex,    topOrientation));
        info.innerRectangles = createRectangle( createCorners(1,0.5,0,  0,0.5,0,  0,0.5,1, 1,0.5,1), bottomNormales, createSquareTexture(bottomIndex, bottomOrientation));

        return info;
    }


    function createLeftDoorInfo(frontTextureIndex, borderTextureIndex, borderTextureSubIndex, orientation) {
        const frontSideOrientation = orientation;
        const backSideOrientation  = Orientation.switchHorizontal(orientation);
        
        const info           = createInfo();
        info.isTransparent   = true;
        info.hasBlockSides   = true;
        const rectangles     = [];
        rectangles[0]        = createRectangle( createCorners(0,0,1,  0,0,0,  0,2,0,  0,2,1), leftNormales, createDoubleHeightTexture(frontTextureIndex, frontSideOrientation));
        rectangles[1]        = createRectangle( createCorners(d,0,0,  d,0,1,  d,2,1,  d,2,0), rightNormales, createDoubleHeightTexture(frontTextureIndex, backSideOrientation));
        rectangles[2]        = createRectangle( createCorners(0,0,0,  d,0,0,  d,2,0,  0,2,0), backNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));
        rectangles[3]        = createRectangle( createCorners(d,0,1,  0,0,1,  0,2,1,  d,2,1), frontNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));
        info.bottomRectangle = createRectangle( createCorners(d,0,0,  0,0,0,  0,0,1,  d,0,1), bottomNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));
        info.topRectangle    = createRectangle( createCorners(0,2,0,  d,2,0,  d,2,1,  0,2,1), topNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));

        info.innerRectangles = combineRectangles(rectangles);
        return info;
    }


    function createRightDoorInfo(frontTextureIndex, borderTextureIndex, borderTextureSubIndex, orientation) {
        const frontSideOrientation = Orientation.switchHorizontal(orientation); 
        const backSideOrientation  = orientation;        

        const info           = createInfo();
        info.isTransparent   = true;
        info.hasBlockSides   = true;
        const rectangles     = [];
        rectangles[0]        = createRectangle( createCorners(1-d,0,1,  1-d,0,0,  1-d,2,0,  1-d,2,1), leftNormales, createDoubleHeightTexture(frontTextureIndex, frontSideOrientation));
        rectangles[1]        = createRectangle( createCorners(1,  0,0,  1,  0,1,  1,  2,1,  1,  2,0), rightNormales, createDoubleHeightTexture(frontTextureIndex, backSideOrientation));
        rectangles[2]        = createRectangle( createCorners(1-d,0,0,  1,  0,0,  1,  2,0,  1-d,2,0), backNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));
        rectangles[3]        = createRectangle( createCorners(1,  0,1,  1-d,0,1,  1-d,2,1,  1,  2,1), frontNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));        
        info.bottomRectangle = createRectangle( createCorners(1,  0,0,  1-d,0,0,  1-d,0,1,  1,  0,1), bottomNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));
        info.topRectangle    = createRectangle( createCorners(1-d,2,0,  1,  2,0,  1,  2,1,  1-d,2,1), topNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));

        info.innerRectangles = combineRectangles(rectangles);
        return info;
    }


    function createBackDoorInfo(frontTextureIndex, borderTextureIndex, borderTextureSubIndex, orientation) {
        const frontSideOrientation = orientation;
        const backSideOrientation = Orientation.switchHorizontal(orientation);

        const info           = createInfo();
        info.isTransparent   = true;
        info.hasBlockSides   = true;
        const rectangles     = [];
        rectangles[0]        = createRectangle( createCorners(0,0,d,  0,0,0,  0,2,0,  0,2,d), leftNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));
        rectangles[1]        = createRectangle( createCorners(1,0,0,  1,0,d,  1,2,d,  1,2,0), rightNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));        
        rectangles[2]        = createRectangle( createCorners(0,0,0,  1,0,0,  1,2,0,  0,2,0), backNormales, createDoubleHeightTexture(frontTextureIndex, frontSideOrientation));
        rectangles[3]        = createRectangle( createCorners(1,0,d,  0,0,d,  0,2,d,  1,2,d), frontNormales, createDoubleHeightTexture(frontTextureIndex, backSideOrientation));
        info.bottomRectangle = createRectangle( createCorners(0,0,0,  0,0,d,  1,0,d,  1,0,0), bottomNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));
        info.topRectangle    = createRectangle( createCorners(0,2,d,  0,2,0,  1,2,0,  1,2,d), topNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));

        info.innerRectangles = combineRectangles(rectangles);
        return info;
    }
    

    function createFrontDoorInfo(frontTextureIndex, borderTextureIndex, borderTextureSubIndex, orientation) {
        const frontSideOrientation = Orientation.switchHorizontal(orientation); 
        const backSideOrientation  = orientation;        

        const info           = createInfo();
        info.isTransparent   = true;
        info.hasBlockSides   = true;
        const rectangles     = [];
        rectangles[0]        = createRectangle( createCorners(0,0,1,    0,0,1-d,  0,2,1-d,  0,2,1),   leftNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));
        rectangles[1]        = createRectangle( createCorners(1,0,1-d,  1,0,1,    1,2,1,    1,2,1-d), rightNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));
        rectangles[2]        = createRectangle( createCorners(0,0,1-d,  1,0,1-d,  1,2,1-d,  0,2,1-d), backNormales, createDoubleHeightTexture(frontTextureIndex, frontSideOrientation));
        rectangles[3]        = createRectangle( createCorners(1,0,1,    0,0,1,    0,2,1,    1,2,1),   frontNormales, createDoubleHeightTexture(frontTextureIndex, backSideOrientation));
        info.bottomRectangle = createRectangle( createCorners(0,0,1-d,  0,0,1,    1,0,1,    1,0,1-d), bottomNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));
        info.topRectangle    = createRectangle( createCorners(0,2,1,    0,2,1-d,  1,2,1-d,  1,2,1),   topNormales, createBorderTexture(borderTextureIndex, borderTextureSubIndex));        

        info.innerRectangles = combineRectangles(rectangles);
        return info;
    }
    

    function createCrossInfo(textureIndex, radiusLeft, radiusBack, radiusRight, radiusFront, height, permeable, oneAxeOnly) {

        const marginLeft     = 0.5 - radiusLeft;
        const marginRight    = 0.5 - radiusRight;
        const marginBack     = 0.5 - radiusBack;
        const marginFront    = 0.5 - radiusFront;
        const marginBottom   = 0;        
        const marginTop      = 1-height;

        const x0             = 0.5 - radiusLeft;
        const x1             = 0.5 + radiusRight;
        const y0             = 0;
        const y1             = height;
        const z0             = 0.5 - radiusBack;
        const z1             = 0.5 + radiusFront
        
        const rectangles     = [];        
        rectangles[0]        = createRectangle( createCorners(0.501,y0,z0,  0.501,y0,z1,  0.501,y1,z1,  0.501,y1,z0), rightNormales, createTruncatedTexture(textureIndex, Orientation.Normal, marginBack, marginFront, marginBottom, marginTop));
        rectangles[1]        = createRectangle( createCorners(0.499,y0,z1,  0.499,y0,z0,  0.499,y1,z0,  0.499,y1,z1), leftNormales,  createTruncatedTexture(textureIndex, Orientation.Flip,   marginBack, marginFront, marginBottom, marginTop));
        if( !oneAxeOnly ) {
            rectangles[2]    = createRectangle( createCorners(x0,y0,0.499,  x1,y0,0.499,  x1,y1,0.499,  x0,y1,0.499), backNormales,  createTruncatedTexture(textureIndex, Orientation.Normal, marginLeft, marginRight, marginBottom, marginTop));
            rectangles[3]    = createRectangle( createCorners(x1,y0,0.501,  x0,y0,0.501,  x0,y1,0.501,  x1,y1,0.501), frontNormales, createTruncatedTexture(textureIndex, Orientation.Flip,   marginLeft, marginRight, marginBottom, marginTop));
        }

        const info           = createInfo();
        info.isPermeable     = permeable;
        info.isTransparent   = true;
        info.innerRectangles = combineRectangles(rectangles);
        return info;
    }


    function createDiagonalCrossInfo(textureIndex, radius, height, permeable) {
        if(!radius) radius   = 0.5;
        if(!height) height   = 1;

        const x0             = 0.5 - radius;
        const x1             = 0.5 + radius
        const y0             = 0;
        const y1             = height;
        const z0             = 0.5 - radius
        const z1             = 0.5 + radius
        
        const rectangles     = [];        
        rectangles[0]        = createRectangle( createCorners(x1,y0,z0,  x0,y0,z1,  x0,y1,z1,  x1,y1,z0), createNormales( 1,0,1),  createFlowerTexture(textureIndex, Orientation.Normal, radius, height));
        rectangles[1]        = createRectangle( createCorners(x0,y0,z1,  x1,y0,z0,  x1,y1,z0,  x0,y1,z1), createNormales(-1,0,-1), createFlowerTexture(textureIndex, Orientation.Flip,   radius, height));
        rectangles[2]        = createRectangle( createCorners(x0,y0,z0,  x1,y0,z1,  x1,y1,z1,  x0,y1,z0), createNormales(1,0,-1),  createFlowerTexture(textureIndex, Orientation.Normal, radius, height));
        rectangles[3]        = createRectangle( createCorners(x1,y0,z1,  x0,y0,z0,  x0,y1,z0,  x1,y1,z1), createNormales(-1,0, 1), createFlowerTexture(textureIndex, Orientation.Flip,   radius, height));

        const info           = createInfo();
        info.isPermeable     = permeable;
        info.isTransparent   = true;
        info.innerRectangles = combineRectangles(rectangles);
        return info;
    }


    function createParallelPlanesInfo(textureIndex, height, permeable) {
        if(!height) height   = 1;

        const y0             = 0;
        const y1             = height;
        
        const rectangles     = [];        
        rectangles[0]        = createRectangle( createCorners(0.3,y0,0,  0.3,y0,1,  0.3,y1,1,  0.3,y1,0), rightNormales, createFlowerTexture(textureIndex, Orientation.Normal,         0.5, height));
        rectangles[1]        = createRectangle( createCorners(0.3,y0,1,  0.3,y0,0,  0.3,y1,0,  0.3,y1,1), leftNormales, createFlowerTexture(textureIndex, Orientation.Flip, 0.5, height));
        rectangles[2]        = createRectangle( createCorners(0.7,y0,0,  0.7,y0,1,  0.7,y1,1,  0.7,y1,0), rightNormales, createFlowerTexture(textureIndex, Orientation.Normal,         0.5, height));
        rectangles[3]        = createRectangle( createCorners(0.7,y0,1,  0.7,y0,0,  0.7,y1,0,  0.7,y1,1), leftNormales, createFlowerTexture(textureIndex, Orientation.Flip, 0.5, height));

        const info           = createInfo();
        info.innerRectangles = combineRectangles(rectangles);
        info.isTransparent   = true;        
        info.isPermeable     = permeable;
        return info;
    }


    function createLeverInfo(baseTextureIndex, textureIndex, radius, baseFace, leverFace) {
        const l  = 0.5 - radius;
        const r  = 0.5 + radius;
        const o  = 1 - 2*radius;
        const t  = 2*radius;
        const c  = 0.499;
        const z  = 0.501

        let orientationA;
        let orientationB;

        const rectangles     = [];        
        const info           = createInfo();
        if( baseFace == BlockFaces.Bottom && isOneOf(leverFace, BlockFaces.Back, BlockFaces.Front )) {
            if( leverFace==BlockFaces.Back) { orientationA=Orientation.Normal; orientationB=Orientation.Flip; }
            else                            { orientationB=Orientation.Normal; orientationA=Orientation.Flip; }
            rectangles[0] = createRectangle( createCorners(l,0.01,l,  r,0.01,l,  r,0.01,r,  l,0.01,r), topNormales, createSquareTexture(baseTextureIndex,   Orientation.Normal));
            rectangles[1] = createRectangle( createCorners(c,0,r,  c,0,l,  c,t,l,  c,t,r), leftNormales, createSquareTexture(textureIndex, orientationA));
            rectangles[2] = createRectangle( createCorners(z,0,l,  z,0,r,  z,t,r,  z,t,l), rightNormales, createSquareTexture(textureIndex, orientationB));
        }
        else if( baseFace == BlockFaces.Bottom && isOneOf(leverFace, BlockFaces.Left, BlockFaces.Right )) {
            if( leverFace==BlockFaces.Left) { orientationA=Orientation.Normal; orientationB=Orientation.Flip; }
            else                            { orientationB=Orientation.Normal; orientationA=Orientation.Flip; }
            rectangles[0] = createRectangle( createCorners(l,0.01,l,  r,0.01,l,  r,0.01,r,  l,0.01,r), topNormales, createSquareTexture(baseTextureIndex,   Orientation.Turn90));
            rectangles[1] = createRectangle( createCorners(l,0,c,  r,0,c,  r,t,c,  l,t,c), backNormales, createSquareTexture(textureIndex, orientationA));
            rectangles[2] = createRectangle( createCorners(r,0,z,  l,0,z,  l,t,z,  r,t,z), frontNormales, createSquareTexture(textureIndex, orientationB));
        }
        else if( baseFace == BlockFaces.Top && isOneOf(leverFace, BlockFaces.Back, BlockFaces.Front )) {
            if( leverFace==BlockFaces.Back) { orientationA=Orientation.Turn180; orientationB=Orientation.FlipAndTurn180; }
            else                            { orientationB=Orientation.Turn180; orientationA=Orientation.FlipAndTurn180; }
            rectangles[0] = createRectangle( createCorners(r,0.99,l,  l,0.99,l,  l,0.99,r,  r,0.99,r), bottomNormales, createSquareTexture(baseTextureIndex, Orientation.Normal));
            rectangles[1] = createRectangle( createCorners(c,o,r,  c,o,l,  c,1,l,  c,1,r), leftNormales, createSquareTexture(textureIndex, orientationA));
            rectangles[2] = createRectangle( createCorners(z,o,l,  z,o,r,  z,1,r,  z,1,l), rightNormales, createSquareTexture(textureIndex, orientationB));
        }
        else if( baseFace == BlockFaces.Top && isOneOf(leverFace, BlockFaces.Left, BlockFaces.Right )) {
            if( leverFace==BlockFaces.Left) { orientationA=Orientation.Turn180; orientationB=Orientation.FlipAndTurn180; }
            else                            { orientationB=Orientation.Turn180; orientationA=Orientation.FlipAndTurn180; }
            rectangles[0] = createRectangle( createCorners(r,0.99,l,  l,0.99,l,  l,0.99,r,  r,0.99,r), bottomNormales, createSquareTexture(baseTextureIndex, Orientation.Turn90));
            rectangles[1] = createRectangle( createCorners(l,o,c,  r,o,c,  r,1,c,  l,1,c), backNormales, createSquareTexture(textureIndex, orientationA));
            rectangles[2] = createRectangle( createCorners(r,o,z,  l,o,z,  l,1,z,  r,1,z), frontNormales, createSquareTexture(textureIndex, orientationB));
        }
        else if(baseFace == BlockFaces.Left) {
            if( leverFace==BlockFaces.Bottom) { orientationA=Orientation.FlipAndTurn270; orientationB=Orientation.Turn90; }
            else                              { orientationA=Orientation.Turn270;        orientationB=Orientation.FlipAndTurn90; }
            rectangles[0] = createRectangle( createCorners(0.01,l,l,  0.01,l,r,  0.01,r,r,  0.01,r,l), rightNormales, createSquareTexture(baseTextureIndex,  Orientation.Normal));
            rectangles[1] = createRectangle( createCorners(0,l,c,  t,l,c,  t,r,c,  0,r,c), backNormales, createSquareTexture(textureIndex, orientationA));
            rectangles[2] = createRectangle( createCorners(t,l,z,  0,l,z,  0,r,z,  t,r,z), frontNormales, createSquareTexture(textureIndex, orientationB));
        }
        else if(baseFace == BlockFaces.Right) {
            if( leverFace==BlockFaces.Bottom) { orientationA=Orientation.Turn90;         orientationB=Orientation.FlipAndTurn270; }
            else                              { orientationA=Orientation.FlipAndTurn90;  orientationB=Orientation.Turn270; }
            rectangles[0] = createRectangle( createCorners(0.99,l,r,  0.99,l,l,  0.99,r,l,  0.99,r,r), leftNormales, createSquareTexture(baseTextureIndex,   Orientation.Normal));
            rectangles[1] = createRectangle( createCorners(o,l,c,  1,l,c,  1,r,c,  o,r,c), backNormales, createSquareTexture(textureIndex, orientationA));
            rectangles[2] = createRectangle( createCorners(1,l,z,  o,l,z,  o,r,z,  1,r,z), frontNormales, createSquareTexture(textureIndex, orientationB));
        }
        else if(baseFace == BlockFaces.Back) {
            if( leverFace==BlockFaces.Bottom) { orientationA=Orientation.Turn90;         orientationB=Orientation.FlipAndTurn270; }
            else                              { orientationA=Orientation.FlipAndTurn90;  orientationB=Orientation.Turn270; }
            rectangles[0] = createRectangle( createCorners(r,l,0.01,  l,l,0.01,  l,r,0.01,  r,r,0.01), frontNormales, createSquareTexture(baseTextureIndex,  Orientation.Normal));
            rectangles[1] = createRectangle( createCorners(c,l,t,  c,l,0,  c,r,0,  c,r,t), leftNormales, createSquareTexture(textureIndex, orientationA));
            rectangles[2] = createRectangle( createCorners(z,l,0,  z,l,t,  z,r,t,  z,r,0), rightNormales, createSquareTexture(textureIndex, orientationB));
        }
        else if(baseFace == BlockFaces.Front) {
            if( leverFace==BlockFaces.Bottom) { orientationA=Orientation.FlipAndTurn270; orientationB=Orientation.Turn90; }
            else                              { orientationA=Orientation.Turn270;        orientationB=Orientation.FlipAndTurn90; }
            rectangles[0] = createRectangle( createCorners(l,l,0.99,  r,l,0.99,  r,r,0.99,  l,r,0.99), backNormales, createSquareTexture(baseTextureIndex,  Orientation.Normal));
            rectangles[1] = createRectangle( createCorners(c,l,1,  c,l,o,  c,r,o,  c,r,1), leftNormales, createSquareTexture(textureIndex, orientationA));
            rectangles[2] = createRectangle( createCorners(z,l,o,  z,l,1,  z,r,1,  z,r,o), rightNormales, createSquareTexture(textureIndex, orientationB));
        }

        info.innerRectangles = combineRectangles(rectangles);
        info.isTransparent   = true;
        return info;
    }


    function createPyramideInfo(textureIndex, face) {
        // TODO: correct normales for triangles
        const rectangles     = [];        
        const info           = createInfo();
        if(face == BlockFaces.Left) {
            rectangles[0]        = createRectangle( createCorners(0,0,0,   0,0,1,  1,0.5,0.5,  0,1,0), rightNormales, createSquareTexture(textureIndex));
            rectangles[1]        = createRectangle( createCorners(1,0.5,0.5,  0,0,1,  0,1,1,   0,1,0), rightNormales, createSquareTexture(textureIndex, Orientation.FlipAndTurn90));
            info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,1,0,  0,1,1), leftNormales, createSquareTexture(textureIndex));
        }
        else if(face == BlockFaces.Right) {
            rectangles[0]        = createRectangle( createCorners(1,0,1,  1,0,0,  0,0.5,0.5,  1,1,1), leftNormales, createSquareTexture(textureIndex));
            rectangles[1]        = createRectangle( createCorners(0,0.5,0.5,  1,0,0,  1,1,0,  1,1,1), leftNormales, createSquareTexture(textureIndex, Orientation.FlipAndTurn90));
            info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,1,1,  1,1,0), rightNormales, createSquareTexture(textureIndex));
        }
        else if(face == BlockFaces.Back) {
            rectangles[0]        = createRectangle( createCorners(0.5,0.5,1,  0,0,0,  0,1,0,  1,1,0), frontNormales, createSquareTexture(textureIndex));
            rectangles[1]        = createRectangle( createCorners(1,0,0,  0,0,0,  0.5,0.5,1,  1,1,0), frontNormales, createSquareTexture(textureIndex, Orientation.FlipAndTurn90));
            info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,1,0,  0,1,0), backNormales, createSquareTexture(textureIndex));
        }
        else if(face == BlockFaces.Front) {
            rectangles[0]        = createRectangle( createCorners(0,0,1,  1,0,1,  0.5,0.5,0,  0,1,1), backNormales, createSquareTexture(textureIndex));
            rectangles[1]        = createRectangle( createCorners(0.5,0.5,0,  1,0,1,  1,1,1,  0,1,1), backNormales, createSquareTexture(textureIndex, Orientation.FlipAndTurn90));
            info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,1,1,  1,1,1), frontNormales, createSquareTexture(textureIndex));
        }
        else if(face == BlockFaces.Bottom) {
            rectangles[0]        = createRectangle( createCorners(0,0,0,  1,0,0,  0.5,1,0.5,  0,0,1), topNormales, createSquareTexture(textureIndex));
            rectangles[1]        = createRectangle( createCorners(0.5,1,0.5,  1,0,0,  1,0,1,  0,0,1), topNormales, createSquareTexture(textureIndex, Orientation.FlipAndTurn90));
            info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,  0,0,1,  1,0,1), bottomNormales, createSquareTexture(textureIndex));
        }
        else if(face == BlockFaces.Top) {
            rectangles[0]        = createRectangle( createCorners(0.5,0,0.5,  0,1,0,  0,1,1,  1,1,1), bottomNormales, createSquareTexture(textureIndex));
            rectangles[1]        = createRectangle( createCorners(1,1,0,  0,1,0,  0.5,0,0.5,  1,1,1), bottomNormales, createSquareTexture(textureIndex, Orientation.FlipAndTurn90));
            info.topRectangle    = createRectangle( createCorners(0,1,0,  1,1,0,  1,1,1,  0,1,1), topNormales, createSquareTexture(textureIndex));
        }
        else {
            fail("unknown face " + face);
        }

        info.innerRectangles = combineRectangles(rectangles);
        info.isTransparent   = true;
        info.hasBlockSides   = true;
        return info;
        
    }


    function createBannerInfo(frontTextureIndex, backTextureIndex, faceDirection, secondaryFaceDirection, radius, height) {
        const rectangles     = [];        
        const info           = createInfo();
        const l              = 0.5 - radius;     // left
        const r              = 0.5 + radius;     // right
        const t              = height;           // top
        const c              = 0.499;            // center left
        const z              = 0.501;            // center right

        const rd             = Math.sqrt(radius*radius/2);
        const d              = 0.5 - rd - 0.001;            // diagonal left
        const e              = 0.5 - rd + 0.001;            // diagonal left

        const f              = 0.5 + rd - 0.001;            // diagonal right
        const g              = 0.5 + rd + 0.001;            // diagonal right

        let frontTexture;
        let backTexture;
        if( height > 1 && radius > 0.5 ) {
            frontTexture = createDoubleSquareTexture(frontTextureIndex);
            backTexture  = createDoubleSquareTexture(backTextureIndex, Orientation.Flip);
        }
        else if( height > 1 ) {
            frontTexture = createDoubleHeightTexture(frontTextureIndex);
            backTexture  = createDoubleHeightTexture(backTextureIndex, Orientation.Flip);
        }
        else {
            frontTexture = createSquareTexture(frontTextureIndex);
            backTexture  = createSquareTexture(backTextureIndex, Orientation.Flip);
        }

        if( faceDirection == BlockFaces.Left && !secondaryFaceDirection ) {
            rectangles[0]        = createRectangle( createCorners(c,0,r,  c,0,l,  c,t,l,  c,t,r), leftNormales, frontTexture);
            rectangles[1]        = createRectangle( createCorners(z,0,l,  z,0,r,  z,t,r,  z,t,l), rightNormales, backTexture);
        }
        else if( faceDirection == BlockFaces.Left && secondaryFaceDirection == BlockFaces.Back ) {
            rectangles[0]        = createRectangle( createCorners(d,0,f,  f,0,d,  f,t,d,  d,t,f), createNormales(-1,0,-1), frontTexture);
            rectangles[1]        = createRectangle( createCorners(g,0,e,  e,0,g,  e,t,g,  g,t,e), createNormales(1,0,1), backTexture);
        }
        else if( faceDirection == BlockFaces.Back && !secondaryFaceDirection ) {
            rectangles[0]        = createRectangle( createCorners(r,0,z,  l,0,z,  l,t,z,  r,t,z), frontNormales, backTexture);
            rectangles[1]        = createRectangle( createCorners(l,0,c,  r,0,c,  r,t,c,  l,t,c), backNormales, frontTexture);
        }
        else if( faceDirection == BlockFaces.Back && secondaryFaceDirection == BlockFaces.Right ) {
            rectangles[0]        = createRectangle( createCorners(f,0,g,  d,0,e,  d,t,e,  f,t,g), createNormales(-1,0,1), backTexture);
            rectangles[1]        = createRectangle( createCorners(e,0,d,  g,0,f,  g,t,f,  e,t,d), createNormales(1,0,-1), frontTexture);
        }
        else if( faceDirection == BlockFaces.Right && !secondaryFaceDirection ) {
            rectangles[0]        = createRectangle( createCorners(c,0,r,  c,0,l,  c,t,l,  c,t,r), leftNormales, backTexture);
            rectangles[1]        = createRectangle( createCorners(z,0,l,  z,0,r,  z,t,r,  z,t,l), rightNormales, frontTexture);
        }
        else if( faceDirection == BlockFaces.Right && secondaryFaceDirection == BlockFaces.Front ) {
            rectangles[0]        = createRectangle( createCorners(d,0,f,  f,0,d,  f,t,d,  d,t,f), createNormales(-1,0,-1), backTexture);
            rectangles[1]        = createRectangle( createCorners(g,0,e,  e,0,g,  e,t,g,  g,t,e), createNormales(1,0,1), frontTexture);
        }
        else if( faceDirection == BlockFaces.Front && !secondaryFaceDirection ) {
            rectangles[0]        = createRectangle( createCorners(r,0,z,  l,0,z,  l,t,z,  r,t,z), frontNormales, frontTexture);
            rectangles[1]        = createRectangle( createCorners(l,0,c,  r,0,c,  r,t,c,  l,t,c), backNormales, backTexture);
        }
        else if( faceDirection == BlockFaces.Front && secondaryFaceDirection == BlockFaces.Left ) {
            rectangles[0]        = createRectangle( createCorners(f,0,g,  d,0,e,  d,t,e,  f,t,g), createNormales(-1,0,1), frontTexture);
            rectangles[1]        = createRectangle( createCorners(e,0,d,  g,0,f,  g,t,f,  e,t,d), createNormales(1,0,-1), backTexture);
        }
        else {
            fail("unknown direction for banner block");
        }

        info.innerRectangles = combineRectangles(rectangles);
        info.isTransparent   = true;
        info.hasBlockSides   = true;
        return info;        
    }


    function createPathInfo(bottomTextureIndex, sideTextureIndex, topTextureIndex) {
        const h              = 0.8;
        const info           = createInfo();
        info.hasBlockSides   = true;
        info.isTransparent   = true;
        info.leftRectangle   = createRectangle( createCorners(0,0,1,  0,0,0,  0,h,0,  0,h,1), leftNormales, createSquareTexture(sideTextureIndex));
        info.rightRectangle  = createRectangle( createCorners(1,0,0,  1,0,1,  1,h,1,  1,h,0), rightNormales, createSquareTexture(sideTextureIndex));
        info.backRectangle   = createRectangle( createCorners(0,0,0,  1,0,0,  1,h,0,  0,h,0), backNormales, createSquareTexture(sideTextureIndex));
        info.frontRectangle  = createRectangle( createCorners(1,0,1,  0,0,1,  0,h,1,  1,h,1), frontNormales, createSquareTexture(sideTextureIndex));
        info.bottomRectangle = createRectangle( createCorners(1,0,0,  0,0,0,  0,0,1,  1,0,1), bottomNormales, createSquareTexture(bottomTextureIndex));
        info.innerRectangles = createRectangle( createCorners(0,h,0,  1,h,0,  1,h,1,  0,h,1), topNormales, createSquareTexture(topTextureIndex));
        return info;        
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // create textures
    ///////////////////////////////////////////////////////////////////////////////////////////////    


    function createSquareTexture(textureIndex, orientation) {
        return createRectangleTexture(textureIndex, orientation);
    }


    function createLeftHalfeTexture(textureIndex, orientation) {
        return createRectangleTexture(textureIndex, orientation, 0, 32, 0, 0);
    }


    function createRightHalfeTexture(textureIndex, orientation) {
        return createRectangleTexture(textureIndex, orientation, 32, 0, 0, 0);
    }


    function createBottomHalfeTexture(textureIndex, orientation) {
        return createRectangleTexture(textureIndex, orientation, 0, 0, 0, 32);
    }


    function createTopHalfeTexture(textureIndex, orientation) {
        return createRectangleTexture(textureIndex, orientation, 0, 0, 32, 0);
    }


    function createDoubleHeightTexture(textureIndex, orientation) {
        return createRectangleTexture(textureIndex, orientation, 0, 0, 0, -64);        
    }


    function createDoubleSquareTexture(textureIndex, orientation) {
        return createRectangleTexture(textureIndex, orientation, 0, -64, 0, -64);        
    }


    function createBorderTexture(textureIndex, subIndex) {
        assert(subIndex >= 0 && subIndex < 4);
        const borderWidth    = 16;
        const marginLeft     = subIndex * borderWidth + 5;
        const marginRight    = 64 - (marginLeft + 6);
        const marginBottom   = 0;
        const marginTop      = 0;
        assert(marginLeft + marginRight < 64);
        return createRectangleTexture(textureIndex, Orientation.Normal, marginLeft, marginRight, marginBottom, marginTop);
    }


    function createFlowerTexture(textureIndex, orientation, radius, height) {
        const marginLeft     = (0.5-radius) * innerTextureWidth;
        const marginRight    = (0.5-radius) * innerTextureWidth;
        const marginBottom   = 0;
        const marginTop      = (1-height) * innerTextureWidth;
        assert(marginLeft + marginRight < innerTextureWidth);
        assert(marginBottom + marginTop < innerTextureWidth);
        return createRectangleTexture(textureIndex, orientation, marginLeft, marginRight, marginBottom, marginTop);
    }        


    function createTruncatedTexture(textureIndex, orientation, marginLeft, marginRight, marginBottom, marginTop) {
        marginLeft     = marginLeft   * innerTextureWidth;
        marginRight    = marginRight  * innerTextureWidth;
        marginBottom   = marginBottom * innerTextureWidth;
        marginTop      = marginTop    * innerTextureWidth;
        assert(marginLeft + marginRight < innerTextureWidth);
        assert(marginBottom + marginTop < innerTextureWidth);
        return createRectangleTexture(textureIndex, orientation, marginLeft, marginRight, marginBottom, marginTop);
    }        


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // create webgl view info
    ///////////////////////////////////////////////////////////////////////////////////////////////
    

    function createInfo() {
        const info           = {};
        info.leftRectangle   = null;
        info.rightRectangle  = null;
        info.backRectangle   = null;
        info.frontRectangle  = null;
        info.bottomRectangle = null;
        info.topRectangle    = null;
        info.innerRectangles = null;
        info.isTransparent   = false;
        info.isPermeable     = false;        
        return info;
    }

    
    function createRectangle(rectangleCorners, normalePoints, textureCorners) {
        const rectangle                = {};
        rectangle.numberOfRectangles   = 1;
        rectangle.points               = rectangleCorners;
        rectangle.normals              = normalePoints;
        rectangle.texture              = textureCorners;
        return rectangle;
    }


    function combineRectangles(rectangles) {
        const rectangle                = {};
        rectangle.numberOfRectangles   = rectangles.length;
        rectangle.points               = new Float32Array(12 * rectangle.numberOfRectangles);
        rectangle.normals              = new Float32Array(12 * rectangle.numberOfRectangles);
        rectangle.texture              = new Float32Array(8 * rectangle.numberOfRectangles);
        for(let i=0; i < rectangles.length; i++) {
            const r = rectangles[i];
            rectangle.points.set(r.points, i*12);
            rectangle.normals.set(r.normals, i*12);
            rectangle.texture.set(r.texture, i*8);
        }
        return rectangle;
    }


    function createCorners(x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        const points = new Float32Array(12);
        points[0] = x0;  points[1]  = y0;  points[2]  = z0;  
        points[3] = x1;  points[4]  = y1;  points[5]  = z1;  
        points[6] = x2;  points[7]  = y2;  points[8]  = z2;  
        points[9] = x3;  points[10] = y3;  points[11] = z3;  
        return points;
    }
    

    function createNormales(xn, yn, zn) {
        const normales = new Float32Array(12);
        normales[0] = xn;  normales[1]  = yn;  normales[2]  = zn;  
        normales[3] = xn;  normales[4]  = yn;  normales[5]  = zn;  
        normales[6] = xn;  normales[7]  = yn;  normales[8]  = zn;  
        normales[9] = xn;  normales[10] = yn;  normales[11] = zn;  
        return normales;
    }


    function createRectangleTexture(textureIndex, orientation, marginLeft, marginRight, marginBottom, marginTop) {
        assert(textureIndex >= 0 && textureIndex < 10*25);
        const posX           = textureIndex % texturesPerRow;
        const posY           = Math.floor(textureIndex / texturesPerRow);

        if(!marginLeft)   marginLeft   = 0;
        if(!marginRight)  marginRight  = 0;
        if(!marginBottom) marginBottom = 0;
        if(!marginTop)    marginTop    = 0;
        
        const u0 = (posX * textureWidth + 3 + marginLeft                ) / atlasWidth;
        const u1 = (posX * textureWidth + textureWidth - 3 - marginRight) / atlasWidth;
        const v0 = (posY * textureWidth + 3 + marginBottom              ) / atlasHeight;
        const v1 = (posY * textureWidth + textureWidth - 3 - marginTop  ) / atlasHeight;

        assert( u0 < u1 );
        assert( v0 < v1 );
        assert( u0 >= 0 && u0 < atlasWidth);
        assert( u1 >= 0 && u1 < atlasWidth);
        assert( v0 >= 0 && v0 < atlasHeight);
        assert( v1 >= 0 && v1 < atlasHeight);
        
        const texturePos = new Float32Array(8);
        if(orientation == Orientation.Turn90) {
            texturePos[0] = u0;  texturePos[1] = v1;
            texturePos[2] = u0;  texturePos[3] = v0;
            texturePos[4] = u1;  texturePos[5] = v0;
            texturePos[6] = u1;  texturePos[7] = v1;
        }
        else if(orientation == Orientation.Turn180) {
            texturePos[0] = u1;  texturePos[1] = v1;
            texturePos[2] = u0;  texturePos[3] = v1;
            texturePos[4] = u0;  texturePos[5] = v0;
            texturePos[6] = u1;  texturePos[7] = v0;
        }
        else if(orientation == Orientation.Turn270) {
            texturePos[0] = u1;  texturePos[1] = v0;
            texturePos[2] = u1;  texturePos[3] = v1;
            texturePos[4] = u0;  texturePos[5] = v1;
            texturePos[6] = u0;  texturePos[7] = v0;
        }
        else if(orientation == Orientation.Flip) {
            texturePos[0] = u1;  texturePos[1] = v0;
            texturePos[2] = u0;  texturePos[3] = v0;
            texturePos[4] = u0;  texturePos[5] = v1;
            texturePos[6] = u1;  texturePos[7] = v1;
        }
        else if(orientation == Orientation.FlipAndTurn90) {
            texturePos[0] = u1;  texturePos[1] = v1;
            texturePos[2] = u1;  texturePos[3] = v0;
            texturePos[4] = u0;  texturePos[5] = v0;
            texturePos[6] = u0;  texturePos[7] = v1;
        }
        else if(orientation == Orientation.FlipAndTurn180) {
            texturePos[0] = u0;  texturePos[1] = v1;
            texturePos[2] = u1;  texturePos[3] = v1;
            texturePos[4] = u1;  texturePos[5] = v0;
            texturePos[6] = u0;  texturePos[7] = v0;
        }
        else if(orientation == Orientation.FlipAndTurn270) {
            texturePos[0] = u0;  texturePos[1] = v0;
            texturePos[2] = u0;  texturePos[3] = v1;
            texturePos[4] = u1;  texturePos[5] = v1;
            texturePos[6] = u1;  texturePos[7] = v0;
        }
        else {
            texturePos[0] = u0;  texturePos[1] = v0;
            texturePos[2] = u1;  texturePos[3] = v0;
            texturePos[4] = u1;  texturePos[5] = v1;
            texturePos[6] = u0;  texturePos[7] = v1;
        }
        return texturePos;
    }


};