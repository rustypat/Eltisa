'use strict';


const  BlockFaces = { Left:1, Right:2, Back:4, Front:8, Bottom:16, Top:32, None: 0, All:63 }
Object.freeze(BlockFaces);


const Block = {

    // category 0: landscape    
    NoBlock:            0,
    UnknownBlock:       1,

    Rock:               8,
    Gravel:             8+1,
    Grit:               8+2,     
    Lava:               8+3,  
    LavaPink:           8+4,  
    LavaBrown:          8+5,  
    GravelGreen:        8+6,
    
    Stone:              16,            // stone
    Stone_1:            16+1,          // granit
    Stone_2:            16+2,          // diorit
    Stone_3:            16+3,          // andesit
    Stone_4:            16+4,          // obsidian
    Stone_5:            16+5,          // coal

    Sand:               24,            // white sand
    Sand_1:             24+1,          // white sand stones
    Sand_2:             24+2,          // red sand 
    Sand_3:             24+3,          // red sand stones
    Sand_4:             24+4,          // yellos sand stones
    
    Dirt:               32,
    Dirt_1:             32+1,
    Dirt_2:             32+2,
    Dirt_3:             32+3,          // raw clay
    Dirt_4:             32+4,          // Farmland dry
    Dirt_5:             32+5,          // contaminated dirt
    
    Clay_White:         40+0,
    Clay_Orange:        40+1,
    Clay_Magenta:       40+2,
    Clay_LightBlue:     40+3,
    Clay_Yellow:        40+4,
    Clay_Lime:          40+5,
    Clay_Pink:          40+6,
    Clay_Gray:          40+7,

    Water:              48,
    Ice:                48+1,
    Snow:               48+2,
    Waterlily:          48+3,

    GrassBlock:         56,

    Clay_LightGray:     64+0,  
    Clay_Cyan:          64+1,  
    Clay_Purple:        64+2,  
    Clay_Blue:          64+3,  
    Clay_Brown:         64+4,  
    Clay_Green:         64+5,  
    Clay_Red:           64+6,  
    Clay_Black:         64+7,  

    Leaves:             72,            // acacia
    Leaves_1:           72+1,          // jungle
    Leaves_2:           72+2,          // spruce
    
    Ore:                80,            // gold
    Ore_1:              80+1,          // iron
    Ore_2:              80+2,          // coal
    Ore_3:              80+3,          // lapis lazuli
    Ore_4:              80+4,          // diamant
    Ore_5:              80+5,          // red stone
    Ore_6:              80+6,          // quartz red stone
    
    // log states:      0:     no cut sides, 1:     cut sides up-down, 2:     cut sides lef-right, 3:     cut sides back-front
    Log_1:              88,            // acacia
    Log_2:              96,            // big oak
    Log_3:              104,           // birch
    Log_4:              112,           // jungle
    Log_5:              120,           // oak
    Log_6:              128,           // spruce


    // category 1:      plants and things
    JackOLantern:       512,
    JackOLantern_On:    512+1,
    Melon:              520,
    Pumpkin:            520+1,

    Drawer:             528,
    TableStone:         528+1,
    TableIron:          528+2,
    Shelf:              536,

    Box:                544,           // acacia wood
    Box_1:              544+1,
    Box_2:              544+2,         // birch wood
    Box_3:              544+3,         // jungle wood
    Box_4:              544+4,         // tnt
    Box_5:              544+5,         // chest
    
    Gem:                552,           // lapis
    Gem_1:              552+1,         // red stone
    Gem_2:              552+2,
    Gem_3:              552+3,         // diamant
    Gem_4:              552+4,         // emerald
    Gem_5:              552+5,         //  light stone

    Sponge:             560,
    Sponge_1:           560+1,
    Hayblock:           560+2,
    Ironblock:          560+3,
    Goldblock:          560+4,
    Cage:               560+5,
    
    Radio:              568,
    Radio_1:            568+1,
    Radio_2:            568+2,
    Radio_3:            568+3,

    Lamp:               576,
    Lamp_On:            576+1,

    Felt_White:         584+0,
    Felt_Orange:        584+1,  
    Felt_Magenta:       584+2,  
    Felt_LightBlue:     584+3,  
    Felt_Yellow:        584+4,  
    Felt_Lime:          584+5,  
    Felt_Pink:          584+6,  
    Felt_Gray:          584+7,  
    
    ArrowVertical:      592,
    ArrowLateral:       600,
    ArrowLongitudinal:  608,

    Disco:              616,

    Ghost:              624,    
    Ghost_1:            624+1,

    Mystic_Plant:       632,
    Mystic_Flower:      632+1,

    Stove:              640,
    
    Felt_LightGray:     648+0,  
    Felt_Cyan:          648+1,  
    Felt_Purple:        648+2,  
    Felt_Blue:          648+3,  
    Felt_Brown:         648+4,  
    Felt_Green:         648+5,  
    Felt_Red:           648+6,  
    Felt_Black:         648+7,  

    RailsLeftRight:     656,  
    RailsBackFront:     656+1,  
    RailsLeftBack:      656+2,  
    RailsBackRight:     656+3,  
    RailsRightFront:    656+4,        
    RailsFrontLeft:     656+5,
    RailGrit:           656+6,   

    RailSwitch:         664,
    RailSwitch_Switched:664+4,

    Portal:             672,
    Music:              680,
    Tetris:             688,
    
    Glass_White:        696+0,
    Glass_Orange:       696+1,  
    Glass_Magenta:      696+2,  
    Glass_LightBlue:    696+3,  
    Glass_Yellow:       696+4,  
    Glass_Lime:         696+5,  
    Glass_Pink:         696+6,  
    Glass_Gray:         696+7,  
    
    Glass_LightGray:    704+0,  
    Glass_Cyan:         704+1,  
    Glass_Purple:       704+2,  
    Glass_Blue:         704+3,  
    Glass_Brown:        704+4,  
    Glass_Green:        704+5,  
    Glass_Red:          704+6,  
    Glass_Black:        704+7,  

    Caldron:            712,
    Caldron_On:         712+1,

    Tresor:             720,

    WindowBlock:        728,
    WindowBlock_1:      728+1,

    // category 2:      buildings
    Wall:               1024,
    Wall_1:             1024+1,        // brick
    Wall_2:             1024+2,        // cobblestone
    Wall_3:             1024+3,        // cobblestone mossy
    Wall_4:             1024+4,        // mossy
    Wall_5:             1024+5,        // sandstone wall
    Wall_6:             1024+6,        // small brick wall
    Wall_7:             1024+7,        // big slab brick wall
    
    Wall_8:             1032,          // red brick wall
    Wall_9:             1032+1,        // purple brick wall
    Wall_10:            1032+2,        // prisma brick wall
    Wall_11:            1032+3,        // tile wall
    Wall_12:            1032+4,        // cracked wall
    Wall_13:            1032+5,        // carved wall

    Ashlar:             1040,          // Stein Quader
    Ashlar_1:           1040+1,        // Granit Quader
    Ashlar_2:           1040+2,        // Diorit
    Ashlar_3:           1040+3,        // Andesit
    Ashlar_4:           1040+4,        // Quarz
    Ashlar_5:           1040+5,        // Sandstein Quader
    Ashlar_6:           1040+6,        // Roter Sandstein Quader
    Pillar:             1048,

    Oracle:             1056,
    OracleUsed:         1056+1,
    
    Carved:             1064,
    Carved_1:           1064+1,
    Carved_2:           1064+2,
    Carved_3:           1064+3,    
    Carved_4:           1064+4,    

    Furnace:            1072,          // off, on
    Furnace_On:         1072+1,

    
    // category 8+9:      transparent things
    Window:             4096,          // back-front, left-right
    
                                       // door order: facing left attached front, facing back attached left, facing right attached back, facing front attached right
    Door1:              4104,          // wood raw
    Door2:              4112,          // wood polished
    Door3:              4120,          // iron
    Door4:              4128,          // wood japan
    Door5:              4136,          // wood bars

    Grass:              4184,
    Fern:               4184+1,
    DryBush:            4184+2,
    Mushroom_1:         4184+3,        // mushroom brown
    Mushroom_2:         4184+4,        // mushroom red
    Wheat:              4184+5,
    Grain:              4184+6,
    Sapling:            4184+7,
    
    Flower:             4192,
    Flower_1:           4192+1,
    Flower_2:           4192+2,        // flower yellow
    Flower_3:           4192+3,
    Flower_4:           4192+4,        // flower red
    Flower_5:           4192+5,
    Flower_6:           4192+6,
    Flower_7:           4192+7,
    
    Carrots:            4200,
    Potatoes:           4200+1,
    Reeds:              4200+2,
    Cactus:             4200+3,
    Beanstalk:          4200+4,
    Grapevine:          4200+5,
    DryFlower:          4200+6,

    SpyderWeb:          4208,          // attaches left, back, right, front, bottom, up
    
    Bed_Feet:           4216,          // feet left, back, right, front
    Bed_Head:           4224,          // head right, front, left, back
    Table:              4232,
    Chair:              4240,          // 4 orientations
    Bars:               4248,          // back-front, left-right, left-back, back-right, right-front, front-left, cross
    Fence:              4256,          // back-front, left-right, left-back, back-right, right-front, front-left, cross
    
    Glass:              4264,          // back-front, left-right, left-back, back-right, right-front, front-left, cross, horizontal
    Ladder:             4272,          // attaches left, back, right, front
    Fire:               4280,

    TorchFloor:         4288,
    TorchFloor_Off:     4288+1,

    TorchWall:          4296,          // connects left, back, right, front
    TorchWall_Off:      4296+4,        // connects left, back, right, front

    Gate:               4304,          // back-front
    Gate_1:             4304+1,        // left-right
    Gate_Open:          4304+2,
    Gate_1Open:         4304+3,

    TrapDoor1:          4312,          // iron, attach left, back, right, front
    TrapDoor1_Open:     4312+4,        // iron, attach left, back, right, front
    TrapDoor2:          4320,          // wood, attach left, back, right, front
    TrapDoor2_Open:     4320+4,        // wood, attach left, back, right, front
    TrapDoor3:          4328,          // inlet, attach left, back, right, front
    TrapDoor3_Open:     4328+4,        // inlet, attach left, back, right, front
    
    Painting:           4336,          // attach left, back, right, front    
    Fur:                4344,          // attach left, back, right, front, bottom, top

    Scripture:          4352,          // attach left, back, right, front
    ScriptureUsed:      4352+4,        // attach left, back, right, front

    RailsUp:            4368,          // raises up to left, back, right, front
    RailsUpHigh:        4368+4,        // raises up to left, back, right, front
    
    Book:               4376,

    Sign:               4384,          // looks left, back, right, front
    SignWall:           4392,          // attaches left, back, right, front

    LetterA:            4400,          // attaches left, back, right, front, bottom, top
    LetterB:            4408,
    LetterC:            4416,
    LetterD:            4424,
    LetterE:            4432,
    LetterF:            4440,
    LetterG:            4448,
    LetterH:            4456,
    LetterI:            4464,
    LetterJ:            4472,
    LetterK:            4480,
    LetterL:            4488,
    LetterM:            4496,
    LetterN:            4504,
    LetterO:            4512,
    LetterP:            4520,
    LetterQ:            4528,
    LetterR:            4536,
    LetterS:            4544,
    LetterT:            4552,
    LetterU:            4560,
    LetterV:            4568,
    LetterW:            4576,
    LetterX:            4584,
    LetterY:            4592,
    LetterZ:            4600,
    LetterEqual:        4608,
    LetterMinus:        4616,
    LetterPlus:         4624,
    LetterSlash:        4632,
    Letter1:            4640,
    Letter2:            4648,
    Letter3:            4656,
    Letter4:            4664,
    Letter5:            4672,
    Letter6:            4680,
    Letter7:            4688,
    Letter8:            4696,
    Letter9:            4704,
    Letter0:            4712,

    Window1:            4720,          // back-front, left-right

    TorchFloor1:        4728,
    TorchFloor1_Off:    4728+1,

    StairWood:          4736,          // raising left, back, right, front, upside down left, back, right, front
    StairCobblestone:   4744,
    StairBrick:         4752,
    StairBrickStone:    4760,
    StairBrickRed:      4768,
    StairSandstone:     4776,
    StairMarmor:        4784,
    StairWoodDark:      4792,
    StairWoodRed:       4800,
    StairSandRed:       4808,
    StairPurpur:        4816,
    StairTile:          4824,
    StairWoodLight:     4832,

    SnowCover:          4840,          // attaches left, back, right, front, bottom, top
    StoneCover:         4848,
    WoodCover:          4856,
    IronCover:          4864,
    SandCover:          4872,
    ObsidianCover:      4880,

    FenceSolid:         4888,          // back-front, left-right, left-back, back-right, right-front, front-left, cross
    GateSolid:          4896,
    GateSolid_1:        4896+1,
    GateSolid_Open:     4896+2,
    GateSolid_1Open:    4896+3,

    Cake:               4904,
    AlchemyLab:         4904+1,
    FlowerPot:          4904+2,

    RoseBush:           4912,
    Sunflower:          4912+1,
    GrassBush:          4912+2,
    Lilac:              4912+3,        // Flieder
    Beet:               4912+4,        // Rüben
    BeetBig:            4912+5,

    Panel:              4920,

    SlabStone:          4928,
    SlabStone_Up:       4928+1,
    SlabSandstone:      4928+2,
    SlabSandstone_Up:   4928+3,
    SlabCobblestone:    4928+4,
    SlabCobblestone_Up: 4928+5,
    SlabBrick:          4928+6,
    SlabBrick_Up:       4928+7,

    SlabMarmor:         4936,
    SlabMarmor_Up:      4936+1,
    SlabWood:           4936+2,
    SlabWood_Up:        4936+3,
    SlabWoodRed:        4936+4,
    SlabWoodRed_Up:     4936+5,
    SlabWoodDark:       4936+6,
    SlabWoodDark_Up:    4936+7,

    SlabWoodLight:      4944, 
    SlabWoodLight_Up:   4944+1, 
    SlabPurpur:         4944+2, 
    SlabPurpur_Up:      4944+3, 

    Cocoa:              4952,          // attaches left, back, right, front

    Lever_Mantel:       4960,          // lever attaching to left, back, right or front, on or off
    Lever_Base:         4968,          // lever attaching to bottom or top, on or off

    ButtonLED_Mantel:   4976,
    ButtonLED_Base:     4984,

    ButtonStone_Mantel: 4992,
    ButtonStone_Base:   5000,

    ButtonWood_Mantel:  5008,
    ButtonWood_Base:    5016,

    Pyramid:            5024,          // base is left, back, right, front, bottom, top
    
    Banner1:            5032,          // front, left, left-back, back, back-right, right, right-front, front, front-left
    Banner2:            5040,
    Banner3:            5048,
    Banner4:            5056,
    Banner5:            5064,
    
    Path:               5072,        
    Pole:               5080,          // attaches left, back, right, front, bottom, top
    PoleLong:           5088,          // attaches left, back, right, front, bottom, top

    FenceWhite:         5096,          // back-front, left-right, left-back, back-right, right-front, front-left, cross
    GateWhite:          5104,    
    GateWhite_1:        5104+1,    
    GateWhite_Open:     5104+2,    
    GateWhite_1Open:    5104+3,    
    Fence_Special:      5112,         // no left, no back, no right, no front, left, back, right, front
    FenceWhite_Special: 5120,         // no left, no back, no right, no front, left, back, right, front

    Horse:              5128,         // front, left, left-back, back, back-right, right, right-front, front, front-left
    GlassBlock:         5136,
    SecretEntry:        5144,
    Camera:             5152
};




const BlockData = new function() {      
    const self = this;
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // general properties
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
    this.createBlockData = function(x, y, z, faces, blockDefinition) {
        return ((y & 0xF) << 28) | ((z & 0xF) << 24) | ((x & 0xF) << 20) | ((faces & 0x3F) << 14) | (blockDefinition & 0x3FFF);
    }

    
    this.getY = function(blockData) {
        return (blockData >> 28) & 0xF;
    }


    this.getZ = function(blockData) {
        return (blockData >> 24) & 0xF;
    }


    this.getX = function(blockData) {
        return (blockData >> 20) & 0xF;
    }


    this.equalLocation = function(blockData1, blockData2) {
        return (blockData1 >> 20) == (blockData2 >> 20);
    }


    this.getFaces = function(blockData) {
        return (blockData >> 14) & 0x3F;
    }


    this.getDefinition = function(blockData) {
        return blockData & 0x3FFF;       
    }


    this.setDefinition = function(blockData, newBlockDefinition) {
        return (blockData & 0xFFFFC000) | (newBlockDefinition & 0x3FFF);       
    }


    this.getCategory = function(blockData) {
        return (blockData >> 9) & 0x1F;
    }


    this.getType = function(blockData) {
        return (blockData >> 3) & 0x3F;
    }


    this.getState = function(blockData) {
        return blockData & 0x7;
    }


    this.getDefinitionWithoutState = function(blockData) {
        return blockData & 0x3FF8;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // special types
    ///////////////////////////////////////////////////////////////////////////////////////////////

    this.isNoBlock = function(blockData) {
        return blockData == Block.NoBlock;
    }


    this.isBlock = function(blockData) {
        return this.getDefinition(blockData) > Block.NoBlock;
    }


    this.isSolid = function(blockData) {
        return this.getCategory(blockData) < 8 && this.getDefinition(blockData) > Block.NoBlock;
    }
    
    
    this.isTransparent = function(blockData) {
        return this.getCategory(blockData) >= 8;
    }
    
    
    this.isDoor = function(blockData) {
        const definition = this.getDefinition(blockData);
        return definition >= Block.Door1 && definition <= Block.Door5 + 7;
    }


    this.isScripture = function(blockData) {
        return this.getDefinitionWithoutState(blockData) == Block.Scripture;
    }


    this.isBook = function(blockData) {
        return this.getDefinition(blockData) == Block.Book;
    }


    this.isRadio = function(blockData) {
        return this.getDefinitionWithoutState(blockData) == Block.Radio;
    }

    
    this.isLadder = function(blockData) {
        return this.getDefinitionWithoutState(blockData) == Block.Ladder;
    }

    
    this.isPortal = function(blockData) {
        return this.getDefinition(blockData) == Block.Portal;
    }


    this.isOracle = function(blockData) {
        return this.getDefinitionWithoutState(blockData) == Block.Oracle;
    }


    this.isOracleUsed = function(blockData) {
        return this.getDefinition(blockData) == Block.OracleUsed;
    }


    this.isFlightStone = function(blockData) {
        return this.getDefinition(blockData) == Block.Gem;
    }


    this.isSign = function(blockData) {
        const definition = this.getDefinition(blockData);
        return definition >= Block.Sign && definition < Block.Sign + 16;
    }
    

    this.isTetris = function(blockData) {
        return this.getDefinition(blockData) == Block.Tetris;
    }


    this.isCamera = function(blockData) {
        return this.getDefinition(blockData) == Block.Camera;
    }

    this.isButton = function(blockData) {
        const definition = this.getDefinition(blockData);
        return definition >= Block.Lever_Mantel && definition <= Block.ButtonWood_Base+7;
    }

    
    this.isDoubleBlock = function(blockData) {
        const definition = this.getDefinition(blockData);
        if( definition >= Block.Banner1  && definition <= Block.Banner5+7 ) return true;
        if( definition >= Block.Door1    && definition <= Block.Door5+7   ) return true;
        if( definition >= Block.RoseBush && definition <= Block.Lilac     ) return true;
        if( definition >= Block.Horse    && definition <= Block.Horse + 7 ) return true;
        if( definition == Block.PoleLong + 4                              ) return true;
        return false;
    }
    
};
Object.freeze(Block);



