'Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved';
'use strict';


const BehaviorInfo = new function() {

    const infoMap  = new Map();

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // access behavior info for block types
    ///////////////////////////////////////////////////////////////////////////////////////////////    

    
    this.canChange = function(blockData) {
        const blockDef  = BlockData.getDefinition(blockData);
        const info      = infoMap.get(blockDef);
        if(!info)                      return false;
        else                           return info.nextChangeVariant > 0;
    }


    this.getChangeBlock = function(blockData) {
        const blockDef  = BlockData.getDefinition(blockData);
        const info      = infoMap.get(blockDef);
        if(!info)                      return blockDef;
        if(info.nextChangeVariant > 0) return info.nextChangeVariant;
        else                           return blockDef;
    }


    this.canSwitch = function(blockData) {
        const blockDef  = BlockData.getDefinition(blockData);
        const info      = infoMap.get(blockDef);
        if(!info)                      return false;
        else                           return info.canSwitch;
    }


    this.getNextAttachBlock = function(blockData) {
        const blockDef  = BlockData.getDefinition(blockData);
        const info      = infoMap.get(blockDef);
        if(!info)                      return blockDef;
        if(info.nextAttachVariant > 0) return info.nextAttachVariant;
        else                           return blockDef;
    }


    this.addsWith = function(blockData, blockFace) {
        const blockDef  = BlockData.getDefinition(blockData);
        const info      = infoMap.get(blockDef);
        if(!info)                      return true;
        if(info.addSide > 0)           return info.addSide & blockFace;
        else                           return true;
    }


    this.removesWith = function(masterBlockData, attachedBlockData, blockFace) {
        if( BlockData.isSolid(masterBlockData) || (BlockData.isDoor(masterBlockData) && BlockData.isDoor(attachedBlockData))) {
            const blockDef  = BlockData.getDefinition(attachedBlockData);
            const info      = infoMap.get(blockDef);
            if(!info)                      return false;
            else                           return info.removeSide & blockFace;    
        }
        else {
            return false;
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // register behavior for blocks
    ///////////////////////////////////////////////////////////////////////////////////////////////    
    

    this.attachesAt = function(blockDefinition, attachSide) {
        setAttachSide(blockDefinition, attachSide);
    }


    this.variants = function(block, variantCount) {
        assert( variantCount >= 2 && variantCount <= 8 );
        for(var i=0; i < variantCount; i++) {
            const nextChangeVariant = i+1 < variantCount ? block + i + 1 : block;
            setNextChangeVariant(block+i, nextChangeVariant);
        }
    }


    this.variantsAttachAt = function(block, blockRange, attachSide) {
        assert( blockRange >= 1 && blockRange <= 8 );
        for(var i=0; i < blockRange; i++) {
            setAttachSide(block+i, attachSide);
        }
    }


    this.variantsCanSwitch = function(block, blockRange) {
        assert( blockRange >= 1 && blockRange <= 8 );
        for(var i=0; i < blockRange; i++) {
            setSwitch(block+i, true);
        }
    }


    this.variantsStickToAllSides = function(block) {
        setAttachSide(block+0, BlockFaces.Left);
        setAttachSide(block+1, BlockFaces.Back);
        setAttachSide(block+2, BlockFaces.Right);
        setAttachSide(block+3, BlockFaces.Front);
        setAttachSide(block+4, BlockFaces.Bottom);
        setAttachSide(block+5, BlockFaces.Top);

        setNextAttachVariant(block+0, block+1);
        setNextAttachVariant(block+1, block+2);
        setNextAttachVariant(block+2, block+3);
        setNextAttachVariant(block+3, block+4);
        setNextAttachVariant(block+4, block+5);
        setNextAttachVariant(block+5, block+0);
    }


    this.variantsStickToMantel = function(block) {
        setAttachSide(block+0, BlockFaces.Left);
        setAttachSide(block+1, BlockFaces.Back);
        setAttachSide(block+2, BlockFaces.Right);
        setAttachSide(block+3, BlockFaces.Front);

        setNextAttachVariant(block+0, block+1);
        setNextAttachVariant(block+1, block+2);
        setNextAttachVariant(block+2, block+3);
        setNextAttachVariant(block+3, block+0);
    }


    this.addGlassBehavior = function(block) {
        setAttachSide(block+0, BlockFaces.Bottom | BlockFaces.Top | BlockFaces.Back | BlockFaces.Front);
        setAttachSide(block+1, BlockFaces.Bottom | BlockFaces.Top | BlockFaces.Left | BlockFaces.Right);
        setAttachSide(block+2, BlockFaces.Bottom | BlockFaces.Top);
        setAttachSide(block+3, BlockFaces.Bottom | BlockFaces.Top);
        setAttachSide(block+4, BlockFaces.Bottom | BlockFaces.Top);
        setAttachSide(block+5, BlockFaces.Bottom | BlockFaces.Top);
        setAttachSide(block+6, BlockFaces.Bottom | BlockFaces.Top);
        setAttachSide(block+6, BlockFaces.Bottom | BlockFaces.Top);
        setAttachSide(block+7, BlockFaces.Left | BlockFaces.Right | BlockFaces.Back | BlockFaces.Front);

        setNextAttachVariant(block+0, block+1);
        setNextAttachVariant(block+1, block+0);

        setNextChangeVariant(block+0, block+1);
        setNextChangeVariant(block+1, block+2);
        setNextChangeVariant(block+2, block+3);
        setNextChangeVariant(block+3, block+4);
        setNextChangeVariant(block+4, block+5);
        setNextChangeVariant(block+5, block+6);
        setNextChangeVariant(block+6, block+7);
        setNextChangeVariant(block+7, block+0);
    }
    
    
    this.addStairBehavior = function(block) {
        setAttachSide(block+0, BlockFaces.Bottom);
        setAttachSide(block+1, BlockFaces.Bottom);
        setAttachSide(block+2, BlockFaces.Bottom);
        setAttachSide(block+3, BlockFaces.Bottom);
        setAttachSide(block+4, BlockFaces.Top);
        setAttachSide(block+5, BlockFaces.Top);
        setAttachSide(block+6, BlockFaces.Top);
        setAttachSide(block+7, BlockFaces.Top);

        setNextAttachVariant(block+0, block+4);
        setNextAttachVariant(block+1, block+4);
        setNextAttachVariant(block+2, block+4);
        setNextAttachVariant(block+3, block+4);
        setNextAttachVariant(block+4, block+0);
        setNextAttachVariant(block+5, block+0);
        setNextAttachVariant(block+6, block+0);
        setNextAttachVariant(block+7, block+0);

        setNextChangeVariant(block+0, block+1);
        setNextChangeVariant(block+1, block+2);
        setNextChangeVariant(block+2, block+3);
        setNextChangeVariant(block+3, block+0);

        setNextChangeVariant(block+4, block+5);
        setNextChangeVariant(block+5, block+6);
        setNextChangeVariant(block+6, block+7);
        setNextChangeVariant(block+7, block+4);
    }


    this.addDoorBehavior = function(lowerBlock, upperBlock) {

        setNextChangeVariant(lowerBlock+0, lowerBlock+1);
        setNextChangeVariant(lowerBlock+1, lowerBlock+2);
        setNextChangeVariant(lowerBlock+2, lowerBlock+3);
        setNextChangeVariant(lowerBlock+3, lowerBlock+4);
        setNextChangeVariant(lowerBlock+4, lowerBlock+5);
        setNextChangeVariant(lowerBlock+5, lowerBlock+6);
        setNextChangeVariant(lowerBlock+6, lowerBlock+7);
        setNextChangeVariant(lowerBlock+7, lowerBlock+0);
        
        setSwitch(lowerBlock+0, true);
        setSwitch(lowerBlock+1, true);
        setSwitch(lowerBlock+2, true);
        setSwitch(lowerBlock+3, true);
        setSwitch(lowerBlock+4, true);
        setSwitch(lowerBlock+5, true);
        setSwitch(lowerBlock+6, true);
        setSwitch(lowerBlock+7, true);

        setAttachSide(lowerBlock+0, BlockFaces.Bottom);
        setAttachSide(lowerBlock+1, BlockFaces.Bottom);
        setAttachSide(lowerBlock+2, BlockFaces.Bottom);
        setAttachSide(lowerBlock+3, BlockFaces.Bottom);
        setAttachSide(lowerBlock+4, BlockFaces.Bottom);
        setAttachSide(lowerBlock+5, BlockFaces.Bottom);
        setAttachSide(lowerBlock+6, BlockFaces.Bottom);
        setAttachSide(lowerBlock+7, BlockFaces.Bottom);
    }


    this.addTrabDoorBehavior = function(block) {
        setAttachSide(block+0, BlockFaces.Left);
        setAttachSide(block+1, BlockFaces.Back);
        setAttachSide(block+2, BlockFaces.Right);
        setAttachSide(block+3, BlockFaces.Front);
        setAttachSide(block+4, BlockFaces.Left);
        setAttachSide(block+5, BlockFaces.Back);
        setAttachSide(block+6, BlockFaces.Right);
        setAttachSide(block+7, BlockFaces.Front);

        setNextAttachVariant(block+0, block+1);
        setNextAttachVariant(block+1, block+2);
        setNextAttachVariant(block+2, block+3);
        setNextAttachVariant(block+3, block+0);

        setSwitch(block+0, true);
        setSwitch(block+1, true);
        setSwitch(block+2, true);
        setSwitch(block+3, true);
        setSwitch(block+4, true);
        setSwitch(block+5, true);
        setSwitch(block+6, true);
        setSwitch(block+7, true);        
    }


    this.addTorchBehavior = function(floorBlock, wallBlock) {
        setSwitch(floorBlock+0, true);
        setSwitch(floorBlock+1, true);
        setSwitch(wallBlock+0, true);
        setSwitch(wallBlock+1, true);
        setSwitch(wallBlock+2, true);
        setSwitch(wallBlock+3, true);
        setSwitch(wallBlock+4, true);
        setSwitch(wallBlock+5, true);
        setSwitch(wallBlock+6, true);
        setSwitch(wallBlock+7, true);        

        setAttachSide(floorBlock+0, BlockFaces.Bottom);
        setAttachSide(floorBlock+1, BlockFaces.Bottom);
        setAttachSide(wallBlock+0, BlockFaces.Left);
        setAttachSide(wallBlock+1, BlockFaces.Back);
        setAttachSide(wallBlock+2, BlockFaces.Right);
        setAttachSide(wallBlock+3, BlockFaces.Front);
        setAttachSide(wallBlock+4, BlockFaces.Left);
        setAttachSide(wallBlock+5, BlockFaces.Back);
        setAttachSide(wallBlock+6, BlockFaces.Right);
        setAttachSide(wallBlock+7, BlockFaces.Front);  
        
        setNextAttachVariant(floorBlock+0, wallBlock+1);
        setNextAttachVariant(wallBlock+0,  wallBlock+1);
        setNextAttachVariant(wallBlock+1,  wallBlock+2);
        setNextAttachVariant(wallBlock+2,  wallBlock+3);
        setNextAttachVariant(wallBlock+3,  wallBlock+0);        
    }


    this.addSlabBehavior = function(lowerBlock, upperBlock) {
        setAttachSide(lowerBlock, BlockFaces.Left | BlockFaces.Right | BlockFaces.Back | BlockFaces.Front | BlockFaces.Bottom);
        setAttachSide(upperBlock, BlockFaces.Left | BlockFaces.Right | BlockFaces.Back | BlockFaces.Front | BlockFaces.Top);        
        setNextAttachVariant(lowerBlock, upperBlock);
        setNextAttachVariant(upperBlock, lowerBlock);
        setNextChangeVariant(lowerBlock, upperBlock);
        setNextChangeVariant(upperBlock, lowerBlock);        
    }


    this.addLeverBehavior = function(mantelBlock, baseBlock) {
        setAttachSide(mantelBlock+0, BlockFaces.Left);
        setAttachSide(mantelBlock+1, BlockFaces.Left);
        setAttachSide(mantelBlock+2, BlockFaces.Back);
        setAttachSide(mantelBlock+3, BlockFaces.Back);
        setAttachSide(mantelBlock+4, BlockFaces.Right);
        setAttachSide(mantelBlock+5, BlockFaces.Right);
        setAttachSide(mantelBlock+6, BlockFaces.Front);
        setAttachSide(mantelBlock+7, BlockFaces.Front);

        setAttachSide(baseBlock+0, BlockFaces.Bottom);
        setAttachSide(baseBlock+1, BlockFaces.Bottom);
        setAttachSide(baseBlock+2, BlockFaces.Bottom);
        setAttachSide(baseBlock+3, BlockFaces.Bottom);
        setAttachSide(baseBlock+4, BlockFaces.Top);
        setAttachSide(baseBlock+5, BlockFaces.Top);
        setAttachSide(baseBlock+6, BlockFaces.Top);
        setAttachSide(baseBlock+7, BlockFaces.Top);

        setSwitch(mantelBlock+0, true);
        setSwitch(mantelBlock+1, true);
        setSwitch(mantelBlock+2, true);
        setSwitch(mantelBlock+3, true);
        setSwitch(mantelBlock+4, true);
        setSwitch(mantelBlock+5, true);
        setSwitch(mantelBlock+6, true);
        setSwitch(mantelBlock+7, true);        
        
        setSwitch(baseBlock+0, true);
        setSwitch(baseBlock+1, true);
        setSwitch(baseBlock+2, true);
        setSwitch(baseBlock+3, true);
        setSwitch(baseBlock+4, true);
        setSwitch(baseBlock+5, true);
        setSwitch(baseBlock+6, true);
        setSwitch(baseBlock+7, true);        
        
        setNextAttachVariant(baseBlock, baseBlock+4);
        setNextAttachVariant(baseBlock+4, mantelBlock);
        setNextAttachVariant(mantelBlock, mantelBlock+2);
        setNextAttachVariant(mantelBlock+2, mantelBlock+4);
        setNextAttachVariant(mantelBlock+4, mantelBlock+6);
        setNextAttachVariant(mantelBlock+6, baseBlock);

        setNextChangeVariant(baseBlock+0, baseBlock+2);
        setNextChangeVariant(baseBlock+2, baseBlock+0);
        setNextChangeVariant(baseBlock+1, baseBlock+3);
        setNextChangeVariant(baseBlock+3, baseBlock+1);
        setNextChangeVariant(baseBlock+4, baseBlock+6);
        setNextChangeVariant(baseBlock+6, baseBlock+4);
        setNextChangeVariant(baseBlock+5, baseBlock+7);
        setNextChangeVariant(baseBlock+7, baseBlock+5);
    }


    this.addButtonBehavior = function(mantelBlock, baseBlock) {
        setAttachSide(mantelBlock+0, BlockFaces.Left);
        setAttachSide(mantelBlock+1, BlockFaces.Left);
        setAttachSide(mantelBlock+2, BlockFaces.Back);
        setAttachSide(mantelBlock+3, BlockFaces.Back);
        setAttachSide(mantelBlock+4, BlockFaces.Right);
        setAttachSide(mantelBlock+5, BlockFaces.Right);
        setAttachSide(mantelBlock+6, BlockFaces.Front);
        setAttachSide(mantelBlock+7, BlockFaces.Front);

        setAttachSide(baseBlock+0, BlockFaces.Bottom);
        setAttachSide(baseBlock+1, BlockFaces.Bottom);
        setAttachSide(baseBlock+2, BlockFaces.Top);
        setAttachSide(baseBlock+3, BlockFaces.Top);

        setSwitch(baseBlock+0, true);
        setSwitch(baseBlock+1, true);
        setSwitch(baseBlock+2, true);
        setSwitch(baseBlock+3, true);
        
        setSwitch(mantelBlock+0, true);
        setSwitch(mantelBlock+1, true);
        setSwitch(mantelBlock+2, true);
        setSwitch(mantelBlock+3, true);
        setSwitch(mantelBlock+4, true);
        setSwitch(mantelBlock+5, true);
        setSwitch(mantelBlock+6, true);
        setSwitch(mantelBlock+7, true);        
        
        setNextAttachVariant(mantelBlock,   mantelBlock+2);
        setNextAttachVariant(mantelBlock+2, mantelBlock+4);
        setNextAttachVariant(mantelBlock+4, mantelBlock+6);
        setNextAttachVariant(mantelBlock+6, baseBlock);
        setNextAttachVariant(baseBlock,     baseBlock+2);
        setNextAttachVariant(baseBlock+2,   mantelBlock);
    }


    this.addPyramidBehavior = function(block) {
        setAttachSide(block+0, BlockFaces.Left, BlockFaces.All);
        setAttachSide(block+1, BlockFaces.Back, BlockFaces.All);
        setAttachSide(block+2, BlockFaces.Right, BlockFaces.All);
        setAttachSide(block+3, BlockFaces.Front, BlockFaces.All);
        setAttachSide(block+4, BlockFaces.Bottom, BlockFaces.All);
        setAttachSide(block+5, BlockFaces.Top, BlockFaces.All);

        setNextAttachVariant(block+0, block+1);
        setNextAttachVariant(block+1, block+2);
        setNextAttachVariant(block+2, block+3);
        setNextAttachVariant(block+3, block+4);
        setNextAttachVariant(block+4, block+5);
        setNextAttachVariant(block+5, block+0);

        setNextChangeVariant(block+0, block+1);
        setNextChangeVariant(block+1, block+2);
        setNextChangeVariant(block+2, block+3);
        setNextChangeVariant(block+3, block+4);
        setNextChangeVariant(block+4, block+5);
        setNextChangeVariant(block+5, block+0);        
    }


    this.addBannerBehavior = function(block) {
        setAttachSide(block+0, BlockFaces.Bottom);
        setAttachSide(block+1, BlockFaces.Bottom);
        setAttachSide(block+2, BlockFaces.Bottom);
        setAttachSide(block+3, BlockFaces.Bottom);
        setAttachSide(block+4, BlockFaces.Bottom);
        setAttachSide(block+5, BlockFaces.Bottom);
        setAttachSide(block+6, BlockFaces.Bottom);
        setAttachSide(block+7, BlockFaces.Bottom);

        setNextChangeVariant(block+0, block+1);
        setNextChangeVariant(block+1, block+2);
        setNextChangeVariant(block+2, block+3);
        setNextChangeVariant(block+3, block+4);
        setNextChangeVariant(block+4, block+5);
        setNextChangeVariant(block+5, block+6);
        setNextChangeVariant(block+6, block+7);
        setNextChangeVariant(block+7, block+0);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // set behavior
    ///////////////////////////////////////////////////////////////////////////////////////////////    

    
    function getInfo(block) {
        var info = infoMap.get(block);
        if(!info) {
            info = {};
            info.block = block;
            infoMap.set(block, info);
        }
        return info;
    }



    function setAttachSide(blockDefinition, attachSide, removeSide) {
        if( !removeSide ) removeSide = attachSide;
        const info                = getInfo(blockDefinition);
        info.addSide              = attachSide;
        info.removeSide           = removeSide;
    }

    
    function setNextAttachVariant(blockDefinition, nextAttachVariant) {
        const info                = getInfo(blockDefinition);
        info.nextAttachVariant    = nextAttachVariant;
    }

    
    function setNextChangeVariant(blockDefinition, nextChangeVariant) {
        const info                = getInfo(blockDefinition);
        info.nextChangeVariant    = nextChangeVariant;
    }


    function setSwitch(blockDefinition, canSwitch) {
        const info                = getInfo(blockDefinition);
        info.canSwitch            = canSwitch;
    }


}