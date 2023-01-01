'Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved';
'use strict';

initializeBlockCarouselDescriptions();

function initializeBlockCarouselDescriptions() {
    
    const b             = Block;
    const Nature        = CarouselInfo.LineTypes.Nature;
    const Build         = CarouselInfo.LineTypes.Build;
    const Things        = CarouselInfo.LineTypes.Things;
    const Special       = CarouselInfo.LineTypes.Special;
    function blockInfo(block, name, icon, description)   { CarouselInfo.addBlockInfo(block, name, icon, description); }
    function lineInfo(blockType, name, VARARGS) { CarouselInfo.addLineInfo.apply(CarouselInfo, arguments); }


    lineInfo( Nature, "Stones",  b.Stone, b.Stone_1, b.Stone_2, b.Stone_3, b.Stone_4, b.Stone_5,  b.Rock, b.Gravel, b.Grit, b.Lava, b.LavaPink, b.LavaBrown);
    lineInfo( Nature, "Ore",  b.Ore, b.Ore_1, b.Ore_2, b.Ore_3, b.Ore_4, b.Ore_5, b.Ore_6, b.GravelGreen );
    lineInfo( Nature, "Landscape",  b.GrassBlock, b.Dirt, b.Dirt_1, b.Dirt_2, b.Dirt_3, b.Dirt_4, b.Dirt_5, b.Sand, b.Sand_1, b.Sand_2, b.Sand_3, b.Sand_4);
    lineInfo( Nature, "Flowers",  b.Flower, b.Flower_1, b.Flower_2, b.Flower_3, b.Flower_4, b.Flower_5, b.Flower_6, b.Flower_7, b.DryFlower);
    lineInfo( Nature, "Plants",  b.Grass, b.Fern, b.Wheat, b.Grain, b.Cocoa, b.DryBush, b.Mushroom_1, b.Mushroom_2, b.Reeds, b.Sapling, b.Carrots, b.Potatoes, b.Beet, b.BeetBig);
    lineInfo( Nature, "Plants",  b.Pumpkin, b.JackOLantern, b.Melon, b.Cactus, b.Mystic_Plant, b.Mystic_Flower, b.RoseBush, b.Sunflower, b.GrassBush, b.Lilac,b.Beanstalk, b.Grapevine);
    lineInfo( Nature, "Trees",  b.Leaves, b.Leaves_1, b.Leaves_2, b.Log_1, b.Log_2, b.Log_3, b.Log_4, b.Log_5, b.Log_6 );
    lineInfo( Nature, "Water",  b.Water, b.Ice, b.Snow, b.Waterlily);


    lineInfo( Build, "Walls",  b.Wall, b.Wall_1, b.Wall_2, b.Wall_3, b.Wall_4, b.Wall_5, b.Wall_6, b.Wall_7, b.Wall_8, b.Wall_9, b.Wall_10, b.Wall_11, b.Wall_12, b.Wall_13 )    
    lineInfo( Build, "Ashlars",  b.Ashlar, b.Ashlar_1, b.Ashlar_2, b.Ashlar_3, b.Ashlar_4, b.Ashlar_5, b.Ashlar_6 );
    lineInfo( Build, "Sculptured Stones",  b.Furnace, b.Pillar, b.Carved, b.Carved_1, b.Carved_2, b.Carved_3, b.Carved_4);
    lineInfo( Build, "Stairs",  b.StairWood, b.StairCobblestone, b.StairBrick, b.StairBrickStone, b.StairBrickRed,b.StairSandstone,b.StairMarmor, b.StairWoodDark,b.StairWoodLight, b.StairWoodRed, b.StairSandRed, b.StairPurpur, b.StairTile);    
    lineInfo( Build, "Slabs",  b.SlabStone, b.SlabSandstone,b.SlabCobblestone, b.SlabBrick, b.SlabMarmor, b.SlabWood, b.SlabWoodRed, b.SlabWoodDark, b.SlabWoodLight, b.SlabPurpur);
    lineInfo( Build, "Doors",  b.Door1, b.Door2, b.Door3, b.Door4, b.Door5, b.TrapDoor1, b.TrapDoor2, b.TrapDoor3);
    lineInfo( Build, "Windows and Gates",  b.Window, b.Window1, b.Glass, b.Panel, b.GlassBlock, b.WindowBlock, b.WindowBlock_1, b.Bars, b.Fence, b.Gate, b.Fence_Special, b.FenceSolid, b.GateSolid, b.FenceWhite, b.GateWhite, b.FenceWhite_Special);
    lineInfo( Build, "Train",  b.RailsLeftRight, b.RailsUp, b.RailSwitch, b.RailGrit);

    lineInfo( Things, "Furniture",  b.Drawer, b.Table, b.Chair, b.Shelf, b.Bed_Feet, b.Bed_Head, b.TableStone, b.TableIron, b.Caldron);
    lineInfo( Things, "Lamps and Buttons",  b.Lamp, b.TorchFloor, b.TorchFloor1, b.ButtonLED_Mantel, b.ButtonStone_Mantel, b.ButtonWood_Mantel, b.Lever_Mantel);
    lineInfo( Things, "Equipment",  b.Ladder, b.Painting, b.Fur, b.Cake, b.AlchemyLab, b.FlowerPot, b.Banner1, b.Banner2, b.Banner5);
    lineInfo( Things, "Varia",  b.Sponge, b.Hayblock, b.Disco, b.Cage, b.Pyramid, b.Ironblock, b.Goldblock, b.Fire, b.SpyderWeb, b.Path, b.Pole, b.PoleLong);
    lineInfo( Things, "Boxes",  b.Box, b.Box_1, b.Box_2, b.Box_3, b.Box_4, b.Box_5, b.Tresor, b.Music);
    lineInfo( Things, "Gems",  b.Gem, b.Gem_1, b.Gem_2, b.Gem_3, b.Gem_4, b.Gem_5);
    lineInfo( Things, "Directions",  b.ArrowVertical,b.ArrowLateral, b.ArrowLongitudinal);
    lineInfo( Things, "Children",  b.Ghost, b.Stove, b.Horse);

    lineInfo( Special, "Special",  b.Scripture, b.Radio, b.Portal, b.Oracle, b.Tetris, b.Sign, b.SignWall, b.Book, b.SecretEntry, b.Camera);
    lineInfo( Special, "Colored Felt",  b.Felt_Orange, b.Felt_White, b.Felt_Magenta, b.Felt_LightBlue, b.Felt_Yellow, b.Felt_Lime, b.Felt_Pink, b.Felt_Gray, b.Felt_Cyan, b.Felt_Purple, b.Felt_Blue, b.Felt_Brown, b.Felt_Green, b.Felt_Red, b.Felt_LightGray, b.Felt_Black);
    lineInfo( Special, "Colored Glass",  b.Glass_Orange, b.Glass_White, b.Glass_Magenta,b.Glass_LightBlue, b.Glass_Yellow, b.Glass_Lime, b.Glass_Pink, b.Glass_Gray, b.Glass_Cyan, b.Glass_Purple, b.Glass_Blue, b.Glass_Brown, b.Glass_Green, b.Glass_Red, b.Glass_LightGray, b.Glass_Black);
    lineInfo( Special, "Colored Clay",  b.Clay_Orange, b.Clay_White, b.Clay_Magenta, b.Clay_LightBlue, b.Clay_Yellow, b.Clay_Lime, b.Clay_Pink, b.Clay_Gray, b.Clay_Cyan, b.Clay_Purple, b.Clay_Blue, b.Clay_Brown, b.Clay_Green, b.Clay_Red, b.Clay_LightGray, b.Clay_Black);
    lineInfo( Special, "Letters 1",  b.LetterA, b.LetterB, b.LetterC, b.LetterD, b.LetterE, b.LetterF, b.LetterG, b.LetterH, b.LetterI, b.LetterJ, b.LetterK, b.LetterL, b.LetterM );
    lineInfo( Special, "Letters 2",  b.LetterN, b.LetterO, b.LetterP, b.LetterQ, b.LetterR, b.LetterS, b.LetterT, b.LetterU, b.LetterV, b.LetterW, b.LetterX, b.LetterY, b.LetterZ);
    lineInfo( Special, "Numbers",  b.Letter1, b.Letter2, b.Letter3, b.Letter4, b.Letter5, b.Letter6, b.Letter7, b.Letter8, b.Letter9, b.Letter0, b.LetterEqual, b.LetterMinus, b.LetterPlus, b.LetterSlash);

    if(Config.debug) {
        lineInfo( Special, "Development",  b.SnowCover, b.StoneCover, b.WoodCover, b.IronCover, b.SandCover, b.ObsidianCover);
    }

    blockInfo( b.Banner1,          "banner",            "banner1.png" );
    blockInfo( b.Banner2,          "banner",            "banner2.png" );
    blockInfo( b.Banner3,          "banner",            "banner3.png" );
    blockInfo( b.Banner4,          "banner",            "banner4.png" );
    blockInfo( b.Banner5,          "banner",            "banner5.png" );
    
    blockInfo( b.Wall,             "wall",            "wall_0.png" );
    blockInfo( b.Wall_1,           "wall",            "wall_1.png" );
    blockInfo( b.Wall_2,           "wall",            "wall_2.png" );
    blockInfo( b.Wall_3,           "wall",            "wall_3.png" );
    blockInfo( b.Wall_4,           "wall",            "wall_4.png" );
    blockInfo( b.Wall_5,           "wall",            "wall_5.png" );
    blockInfo( b.Wall_6,           "wall",            "wall_6.png" );
    blockInfo( b.Wall_7,           "wall",            "wall_7.png" );
    blockInfo( b.Wall_8,           "wall",            "wall_8.png" );
    blockInfo( b.Wall_9,           "wall",            "wall_9.png" );
    blockInfo( b.Wall_10,          "wall",            "wall_10.png" );
    blockInfo( b.Wall_11,          "wall",            "wall_11.png" );
    blockInfo( b.Wall_12,          "wall",            "wall_12.png" );
    blockInfo( b.Wall_13,          "wall",            "wall_13.png" );

    blockInfo( b.Ashlar,           "ashlar",          "ashlar_0.png" );
    blockInfo( b.Ashlar_1,         "ashlar",          "ashlar_1.png" );
    blockInfo( b.Ashlar_2,         "ashlar",          "ashlar_2.png" );
    blockInfo( b.Ashlar_3,         "ashlar",          "ashlar_3.png" );
    blockInfo( b.Ashlar_4,         "ashlar",          "ashlar_4.png" );
    blockInfo( b.Ashlar_5,         "ashlar",          "ashlar_5.png" );
    blockInfo( b.Ashlar_6,         "ashlar",          "ashlar_6.png" );

    blockInfo( b.Furnace,          "furnace",         "furnace.png" );
    blockInfo( b.Oracle,           "oracle",          "oracle.png" );
    blockInfo( b.Pillar,           "pillar",          "pillar.png" );
    blockInfo( b.Carved,           "carved",          "carved_0.png" );
    blockInfo( b.Carved_1,         "carved",          "carved_1.png" );
    blockInfo( b.Carved_2,         "carved",          "carved_2.png" );
    blockInfo( b.Carved_3,         "carved",          "carved_3.png" );
    blockInfo( b.Carved_4,         "ornated",         "carved_4.png" );

    blockInfo( b.Door1,            "door",            "door_1.png" );
    blockInfo( b.Door2,            "door",            "door_2.png" );
    blockInfo( b.Door3,            "door",            "door_3.png" );
    blockInfo( b.Door4,            "door",            "door_4.png" );
    blockInfo( b.Door5,            "door",            "door_5.png" );
    blockInfo( b.TrapDoor1,        "trap door",       "trapdoor.png" );
    blockInfo( b.TrapDoor2,        "trap door",       "trapdoor_1.png" );
    blockInfo( b.TrapDoor3,        "trap door",       "trapdoor_2.png" );

    blockInfo( b.Window,           "window",          "window.png" );
    blockInfo( b.Window1,          "window",          "window_1.png" );
    blockInfo( b.Glass,            "glass",           "glass.png" );
    blockInfo( b.GlassBlock,       "glass block",     "glass.png" );
    blockInfo( b.Panel,            "panel",           "glass_light_blue.png" );
    blockInfo( b.Bars,             "bars",            "bars.png" );
    blockInfo( b.Fence,            "fence",           "fence.png" );
    blockInfo( b.Fence_Special,    "fence special",   "fence.png" );
    blockInfo( b.Gate,             "gate",            "gate.png" );
    blockInfo( b.FenceSolid,       "fence",           "fenceSolid.png" );
    blockInfo( b.GateSolid,        "gate",            "gateSolid.png" );
    blockInfo( b.FenceWhite,       "fence",           "fenceWhite.png" );
    blockInfo( b.FenceWhite_Special,"fence special",  "fenceWhite.png" );
    blockInfo( b.GateWhite,        "gate",            "gateWhite.png" );

    blockInfo( b.Box,              "box",             "box_0.png" );
    blockInfo( b.Box_1,            "box",             "box_1.png" );
    blockInfo( b.Box_2,            "box",             "box_2.png" );
    blockInfo( b.Box_3,            "box",             "box_3.png" );
    blockInfo( b.Box_4,            "tnt",             "box_4.png" );
    blockInfo( b.Box_5,            "chest",           "box_5.png" );

    blockInfo( b.Drawer,           "drawer",          "drawer.png" );
    blockInfo( b.Table,            "table",           "table.png" );
    blockInfo( b.Chair,            "chair",           "chair.png" );
    blockInfo( b.Shelf,            "shelf",           "shelf.png" );
    blockInfo( b.Bed_Feet,         "bed feet",        "bed_feet.png" );
    blockInfo( b.Bed_Head,         "bed head",        "bed_head.png" );
    blockInfo( b.TableStone,       "stone table",     "table_stone.png" );
    blockInfo( b.TableIron,        "iron table",      "table_iron.png" );
    blockInfo( b.Caldron,          "caldron",         "caldron.png" );

    blockInfo( b.Ladder,           "ladder",          "ladder.png" );
    blockInfo( b.Painting,         "painting",        "painting.png" );
    blockInfo( b.Fur,              "fur",             "fur.png" );
    blockInfo( b.Lever_Mantel,     "lever",           "lever.png");
    blockInfo( b.ButtonLED_Mantel, "led button",      "button_led.png" );
    blockInfo( b.ButtonStone_Mantel,"button",         "button_stone.png" );
    blockInfo( b.ButtonWood_Mantel,"button",          "button_wood.png" );

    blockInfo( b.Scripture,        "scripture",       "scripture.png", "press space to write in the scripture" );
    blockInfo( b.Radio,            "radio",           "radio.png",  "press space to listen to the radio \npress F3 to change the station");
    blockInfo( b.Portal,           "portal",          "portal.png", "press space to teleport yourself to another place\npress F3 to change the destination" );
    blockInfo( b.Tetris,           "Blockrain",       "tetris.png", "play tetris" );
    blockInfo( b.Music,            "music",           "music.png" );

    blockInfo( b.Lamp,             "lamp",            "lamp.png" );
    blockInfo( b.TorchFloor,       "wall torch",      "torch.png" );
    blockInfo( b.TorchFloor1,      "floor torch",     "torch1.png" );        

    blockInfo( b.RailsLeftRight,   "rails",           "rails.png" );
    blockInfo( b.RailsUp,          "rails up",        "rails_up.png" );
    blockInfo( b.RailSwitch,       "rail switch",     "rail_switch.png" );
    blockInfo( b.RailGrit,         "rail grit",       "rail_grit.png" );        

    blockInfo( b.Felt_White,       "felt white",      "felt_white.png" );  
    blockInfo( b.Felt_Orange,      "felt orange",     "felt_orange.png" );
    blockInfo( b.Felt_Magenta,     "felt magenta",    "felt_magenta.png" );
    blockInfo( b.Felt_LightBlue,   "felt light blue", "felt_light_blue.png" );
    blockInfo( b.Felt_Yellow,      "felt yellow",     "felt_yellow.png" );
    blockInfo( b.Felt_Lime,        "felt lime",       "felt_lime.png" );
    blockInfo( b.Felt_Pink,        "felt pink",       "felt_pink.png" );
    blockInfo( b.Felt_Gray,        "felt gray",       "felt_gray.png" );
    blockInfo( b.Felt_Cyan,        "felt cyan",       "felt_cyan.png" );
    blockInfo( b.Felt_Purple,      "felt purple",     "felt_purple.png" );
    blockInfo( b.Felt_Blue,        "felt blue",       "felt_blue.png" );
    blockInfo( b.Felt_Brown,       "felt brown",      "felt_brown.png" );
    blockInfo( b.Felt_Green,       "felt green",      "felt_green.png" );
    blockInfo( b.Felt_Red,         "felt red",        "felt_red.png" );
    blockInfo( b.Felt_LightGray,   "felt light gray", "felt_light_gray.png" );
    blockInfo( b.Felt_Black,       "felt black",      "felt_black.png" );        

    blockInfo( b.Glass_White,      "glass white",     "glass_white.png" );  
    blockInfo( b.Glass_Orange,     "glass orange",    "glass_orange.png" );
    blockInfo( b.Glass_Magenta,    "glass magenta",   "glass_magenta.png" );
    blockInfo( b.Glass_LightBlue,  "glass light blue","glass_light_blue.png" );
    blockInfo( b.Glass_Yellow,     "glass yellow",    "glass_yellow.png" );
    blockInfo( b.Glass_Lime,       "glass lime",      "glass_lime.png" );
    blockInfo( b.Glass_Pink,       "glass pink",      "glass_pink.png" );
    blockInfo( b.Glass_Gray,       "glass gray",      "glass_gray.png" );
    blockInfo( b.Glass_Cyan,       "glass cyan",      "glass_cyan.png" );
    blockInfo( b.Glass_Purple,     "glass purple",    "glass_purple.png" );
    blockInfo( b.Glass_Blue,       "glass blue",      "glass_blue.png" );
    blockInfo( b.Glass_Brown,      "glass brown",     "glass_brown.png" );
    blockInfo( b.Glass_Green,      "glass green",     "glass_green.png" );
    blockInfo( b.Glass_Red,        "glass red",       "glass_red.png" );
    blockInfo( b.Glass_LightGray,  "glass light gray","glass_light_gray.png" );
    blockInfo( b.Glass_Black,      "glass black",     "glass_black.png" );        

    blockInfo( b.Gem,              "flight stone",    "gem_0.png" );
    blockInfo( b.Gem_1,            "gem",             "gem_1.png" );
    blockInfo( b.Gem_2,            "gem",             "gem_2.png" );
    blockInfo( b.Gem_3,            "gem",             "gem_3.png" );
    blockInfo( b.Gem_4,            "gem",             "gem_4.png" );        
    blockInfo( b.Gem_5,            "light stone",     "gem_5.png" );        

    blockInfo( b.ArrowVertical,    "vertical arrow",  "arrow_up.png" );
    blockInfo( b.ArrowLateral,     "lateral arrow",   "arrow.png" );
    blockInfo( b.ArrowLongitudinal,"longitudinal",    "arrow_right.png" );

    blockInfo( b.Sponge,           "sponge",          "sponge.png" );
    blockInfo( b.Hayblock,         "hay block",       "hay_block.png" );
    blockInfo( b.Disco,            "disco",           "disco.png" );
    blockInfo( b.Cage,             "cage",            "cage.png" );
    blockInfo( b.Ironblock,        "iron block",      "iron_block.png" );
    blockInfo( b.Goldblock,        "gold nuget",      "gold_nuget.png" );
    blockInfo( b.Fire,             "fire",            "fire.png" );
    blockInfo( b.Tresor,           "tresor",          "tresor.png" );        
    blockInfo( b.WindowBlock,      "window block",    "window_white.png" );        
    blockInfo( b.WindowBlock_1,    "window block",    "window_blue.png" );        

    blockInfo( b.LetterA,          "Letter A",        "letterA.png" ); 
    blockInfo( b.LetterB,          "Letter B",        "letterB.png" ); 
    blockInfo( b.LetterC,          "Letter C",        "letterC.png" ); 
    blockInfo( b.LetterD,          "Letter D",        "letterD.png" ); 
    blockInfo( b.LetterE,          "Letter E",        "letterE.png" );
    blockInfo( b.LetterF,          "Letter F",        "letterF.png" ); 
    blockInfo( b.LetterG,          "Letter G",        "letterG.png" ); 
    blockInfo( b.LetterH,          "Letter H",        "letterH.png" ); 
    blockInfo( b.LetterI,          "Letter I",        "letterI.png" ); 
    blockInfo( b.LetterJ,          "Letter J",        "letterJ.png" );
    blockInfo( b.LetterK,          "Letter K",        "letterK.png" ); 
    blockInfo( b.LetterL,          "Letter L",        "letterL.png" ); 
    blockInfo( b.LetterM,          "Letter M",        "letterM.png" ); 
    blockInfo( b.LetterN,          "Letter N",        "letterN.png" ); 
    blockInfo( b.LetterO,          "Letter O",        "letterO.png" );
    blockInfo( b.LetterP,          "Letter P",        "letterP.png" ); 
    blockInfo( b.LetterQ,          "Letter Q",        "letterQ.png" ); 
    blockInfo( b.LetterR,          "Letter R",        "letterR.png" ); 
    blockInfo( b.LetterS,          "Letter S",        "letterS.png" ); 
    blockInfo( b.LetterT,          "Letter T",        "letterT.png" );
    blockInfo( b.LetterU,          "Letter U",        "letterU.png" ); 
    blockInfo( b.LetterV,          "Letter V",        "letterV.png" ); 
    blockInfo( b.LetterW,          "Letter W",        "letterW.png" ); 
    blockInfo( b.LetterX,          "Letter X",        "letterX.png" ); 
    blockInfo( b.LetterY,          "Letter Y",        "letterY.png" );
    blockInfo( b.LetterZ,          "Letter Z",        "letterZ.png" );   

    blockInfo( b.Letter1,          "Letter 1",        "letter1.png" ); 
    blockInfo( b.Letter2,          "Letter 2",        "letter2.png" ); 
    blockInfo( b.Letter3,          "Letter 3",        "letter3.png" ); 
    blockInfo( b.Letter4,          "Letter 4",        "letter4.png" ); 
    blockInfo( b.Letter5,          "Letter 5",        "letter5.png" );
    blockInfo( b.Letter6,          "Letter 6",        "letter6.png" ); 
    blockInfo( b.Letter7,          "Letter 7",        "letter7.png" ); 
    blockInfo( b.Letter8,          "Letter 8",        "letter8.png" ); 
    blockInfo( b.Letter9,          "Letter 9",        "letter9.png" ); 
    blockInfo( b.Letter0,          "Letter 0",        "letter0.png" );
    blockInfo( b.LetterEqual,      "Letter =",        "letterEqual.png" ); 
    blockInfo( b.LetterMinus,      "Letter -",        "letterMinus.png" ); 
    blockInfo( b.LetterPlus,       "Letter +",        "letterPlus.png" ); 
    blockInfo( b.LetterSlash,      "Letter /",        "letterSlash.png" );        

    blockInfo( b.SpyderWeb,        "spyder web",      "spyder_web.png"  );
    blockInfo( b.Path,             "path",            "path.png"  );
    blockInfo( b.Ghost,            "ghost",           "ghost.png" );
    blockInfo( b.Stove,            "stove",           "stove.png" );

    blockInfo( b.Pumpkin,          "pumpkin",         "pumpkin.png" );
    blockInfo( b.JackOLantern,     "jackolantern",    "jackolantern.png"  );
    blockInfo( b.Melon,            "melon",           "melon.png" );
    blockInfo( b.Mystic_Plant,     "mystic plant",    "mystic_plant.png" );
    blockInfo( b.Mystic_Flower,    "mystic flower",   "mystic_flower.png" );

    blockInfo( b.Grass,            "grass",           "grass.png" );
    blockInfo( b.Fern,             "fern",            "fern.png" );
    blockInfo( b.Wheat,            "wheat",           "wheat.png" );
    blockInfo( b.Grain,            "grain",           "grain.png" );
    blockInfo( b.DryBush,          "dry bush",        "dry_bush.png" );
    blockInfo( b.Mushroom_1,       "mushroom 1",      "mushroom_1.png" );
    blockInfo( b.Mushroom_2,       "mushroom 2",      "mushroom_2.png" );
    blockInfo( b.Sapling,          "sapling",         "sapling.png" );
    blockInfo( b.Carrots,          "carrots",         "carrots.png" );
    blockInfo( b.Potatoes,         "potatoes",        "potatoes.png" );
    blockInfo( b.Reeds,            "sugar canez",     "reeds.png" );
    blockInfo( b.Cactus,           "cactus",          "cactus.png" );
    blockInfo( b.Beanstalk,        "beanstalk",       "beanstalk.png" );
    blockInfo( b.Grapevine,        "grapevine",       "grapevine.png" );
    blockInfo( b.DryFlower,        "dry flower",      "dry_flower.png" );
    blockInfo( b.Cocoa,            "cocoa",           "cocoa.png" );

    blockInfo( b.Flower,           "flower",          "flower_0.png" );
    blockInfo( b.Flower_1,         "flower",          "flower_1.png" );
    blockInfo( b.Flower_2,         "flower",          "flower_2.png" );
    blockInfo( b.Flower_3,         "flower",          "flower_3.png" );    
    blockInfo( b.Flower_4,         "flower",          "flower_4.png" );
    blockInfo( b.Flower_5,         "flower",          "flower_5.png" );
    blockInfo( b.Flower_6,         "flower",          "flower_6.png" );
    blockInfo( b.Flower_7,         "flower",          "flower_7.png" );

    blockInfo( b.RoseBush,         "rose bush",       "rose_bush.png" );
    blockInfo( b.Sunflower,        "sunflower",       "sunflower.png" );
    blockInfo( b.GrassBush,        "grass bush",      "grass_bush.png" );
    blockInfo( b.Lilac,            "lilac",           "lilac.png" );
    blockInfo( b.Beet,             "beet",            "beet.png" );
    blockInfo( b.BeetBig,          "beet big",        "beet_big.png" );

    blockInfo( b.GrassBlock,       "grassblock",      "grassblock.png" ); 
    blockInfo( b.Dirt,             "dirt",            "dirt_0.png" );
    blockInfo( b.Dirt_1,           "dirt",            "dirt_1.png" );
    blockInfo( b.Dirt_2,           "dirt",            "dirt_2.png" );
    blockInfo( b.Dirt_3,           "raw clay",        "dirt_3.png" );  
    blockInfo( b.Dirt_4,           "farmland",        "dirt_4.png" );
    blockInfo( b.Dirt_5,           "poisened dirt",   "dirt_5.png" );
    blockInfo( b.Log_1,            "log 1",           "log_1.png" );
    blockInfo( b.Log_2,            "log 2",           "log_2.png" );
    blockInfo( b.Log_3,            "log 3",           "log_3.png" );
    blockInfo( b.Log_4,            "log 4",           "log_4.png" );
    blockInfo( b.Log_5,            "log 5",           "log_5.png" );
    blockInfo( b.Log_6,            "log 6",           "log_6.png" );

    blockInfo( b.Leaves,           "leaves",          "leaves_0.png" );
    blockInfo( b.Leaves_1,         "leaves",          "leaves_1.png" );
    blockInfo( b.Leaves_2,         "leaves",          "leaves_2.png" );

    blockInfo( b.Stone,            "stone",           "stone_0.png" );
    blockInfo( b.Stone_1,          "stone",           "stone_1.png" );
    blockInfo( b.Stone_2,          "stone",           "stone_2.png" );
    blockInfo( b.Stone_3,          "stone",           "stone_3.png" );
    blockInfo( b.Stone_4,          "stone",           "stone_4.png" );
    blockInfo( b.Stone_5,          "stone",           "stone_5.png" );    

    blockInfo( b.Ore,              "ore",             "ore_0.png" );
    blockInfo( b.Ore_1,            "ore",            "ore_1.png" );
    blockInfo( b.Ore_2,            "ore",            "ore_2.png" );
    blockInfo( b.Ore_3,            "ore",            "ore_3.png" );
    blockInfo( b.Ore_4,            "ore",            "ore_4.png" );
    blockInfo( b.Ore_5,            "ore",            "ore_5.png" );        
    blockInfo( b.Ore_6,            "ore",            "ore_6.png" );        

    blockInfo( b.Sand,             "sand",           "sand_0.png" );
    blockInfo( b.Sand_1,           "sand",           "sand_1.png" );
    blockInfo( b.Sand_2,           "sand",           "sand_2.png" );
    blockInfo( b.Sand_3,           "sand",           "sand_3.png" );
    blockInfo( b.Sand_4,           "sand",           "sand_4.png" );

    blockInfo( b.Rock,             "rock",           "rock.png" );
    blockInfo( b.Gravel,           "gravel",         "gravel.png" );
    blockInfo( b.GravelGreen,      "gravel green",   "gravel_green.png" );
    blockInfo( b.Grit,             "grit",           "grit.png" );
    blockInfo( b.Lava,             "lava",           "lava.png" );
    blockInfo( b.LavaPink,         "pink lava",      "lavapink.png" );
    blockInfo( b.LavaBrown,        "brown lava",     "lavabrown.png" );

    blockInfo( b.Clay_White,       "clay white",      "clay_white.png" );  
    blockInfo( b.Clay_Orange,      "clay orange",     "clay_orange.png" );
    blockInfo( b.Clay_Magenta,     "clay magenta",    "clay_magenta.png" );
    blockInfo( b.Clay_LightBlue,   "clay light blue", "clay_light_blue.png" );
    blockInfo( b.Clay_Yellow,      "clay yellow",     "clay_yellow.png" );
    blockInfo( b.Clay_Lime,        "clay lime",       "clay_lime.png" );
    blockInfo( b.Clay_Pink,        "clay pink",       "clay_pink.png" );
    blockInfo( b.Clay_Gray,        "clay gray",       "clay_gray.png" );
    blockInfo( b.Clay_Cyan,        "clay cyan",       "clay_cyan.png" );
    blockInfo( b.Clay_Purple,      "clay purple",     "clay_purple.png" );
    blockInfo( b.Clay_Blue,        "clay blue",       "clay_blue.png" );
    blockInfo( b.Clay_Brown,       "clay brown",      "clay_brown.png" );
    blockInfo( b.Clay_Green,       "clay green",      "clay_green.png" );
    blockInfo( b.Clay_Red,         "clay red",        "clay_red.png" );
    blockInfo( b.Clay_LightGray,   "clay light gray", "clay_light_gray.png" );
    blockInfo( b.Clay_Black,       "clay black",      "clay_black.png" );        

    blockInfo( b.Water,            "water",          "water.png" );
    blockInfo( b.Ice,              "ice",            "ice.png" );
    blockInfo( b.Snow,             "snow",           "snow.png" );
    blockInfo( b.Waterlily,        "waterlily",      "waterlily.png" );
    
    blockInfo( b.StairWood,        "stair wood",     "stair_wood.png" );
    blockInfo( b.StairCobblestone, "stair cobble",   "stair_cobblestone.png" );
    blockInfo( b.StairBrick,       "stair brick",    "stair_brick.png" );
    blockInfo( b.StairBrickStone,  "stair brick",    "stair_brickstone.png" );
    blockInfo( b.StairBrickRed,    "stair brick",    "stair_brickred.png" );
    blockInfo( b.StairSandstone,   "stair sand",     "stair_sandstone.png" );
    blockInfo( b.StairMarmor,      "stair marmor",   "stair_marmor.png" );
    blockInfo( b.StairWoodDark,    "stair wood",     "stair_wooddark.png" );
    blockInfo( b.StairWoodRed,     "stair wood",     "stair_woodred.png" );
    blockInfo( b.StairSandRed,     "stair red sand", "stair_sandred.png" );
    blockInfo( b.StairPurpur,      "stair purpur",   "stair_purpur.png" );
    blockInfo( b.StairTile,        "stair tile",     "stair_tile.png" );
    blockInfo( b.StairWoodLight,   "stair wood",     "stair_woodlight.png" );
    
    blockInfo( b.Sign,             "sign",           "sign.png", "writing on a sign is not yet implemented" );
    blockInfo( b.SignWall,         "wall sign",      "sign_wall.png", "writing on a sign is not yet implemented" );
    blockInfo( b.Book,             "book",           "book.png", "writing in a book is not yet implemented");      
    blockInfo( b.SecretEntry,      "Secret Entry",   "secret_entry.png", "this blocks look like normal blocks, \n but they are permeable. \nUse F3 to change.");
    blockInfo( b.Camera,           "Camera",         "camera.png");

    blockInfo( b.Cake,             "cake",           "cake.png");
    blockInfo( b.AlchemyLab,       "alchemy lab",    "alchemylab.png");
    blockInfo( b.FlowerPot,        "flower pot",     "flower_pot.png");

    blockInfo( b.SnowCover,        "snow cover",     "snow.png");
    blockInfo( b.StoneCover,       "stone cover",    "ashlar_3.png");
    blockInfo( b.WoodCover,        "wood cover",     "box_1.png");
    blockInfo( b.IronCover,        "iron cover",     "iron_block.png");
    blockInfo( b.SandCover,        "sand cover",     "sand_0.png");
    blockInfo( b.ObsidianCover,    "obsidian cover", "stone_4.png");
        
    blockInfo( b.SlabStone,        "stone slab",     "slab_stone.png");
    blockInfo( b.SlabSandstone,    "sandstone slab", "slab_sandstone.png");
    blockInfo( b.SlabCobblestone,  "cobblestone slab","slab_cobblestone.png");
    blockInfo( b.SlabBrick,        "brick slab",     "slab_brick.png");
    blockInfo( b.SlabMarmor,       "marmor slab",    "slab_marmor.png");
    blockInfo( b.SlabWood,         "wood slab",      "slab_wood.png");
    blockInfo( b.SlabWoodRed,      "wood slab",      "slab_woodred.png");
    blockInfo( b.SlabWoodDark,     "wood slab",      "slab_wooddark.png");
    blockInfo( b.SlabWoodLight,    "wood slab",      "slab_woodlight.png");
    blockInfo( b.SlabPurpur,       "purpur slab",    "slab_purpur.png");
    
    blockInfo( b.Pyramid,          "iron pyramid",   "pyramid_iron.png");
    blockInfo( b.Pole,             "pole",           "pole.png");
    blockInfo( b.PoleLong,         "long pole",      "pole.png");

    blockInfo( b.Horse,            "Horse",          "horse.png");

}    


