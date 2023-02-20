'use strict';


initializeBlockBehaviorDescriptions();

function initializeBlockBehaviorDescriptions() {

    // solid blocks    
    BehaviorInfo.variants(Block.Log_1,           4);        
    BehaviorInfo.variants(Block.Log_2,           4);
    BehaviorInfo.variants(Block.Log_3,           4);
    BehaviorInfo.variants(Block.Log_4,           4);
    BehaviorInfo.variants(Block.Log_5,           4);
    BehaviorInfo.variants(Block.Log_6,           4);
    BehaviorInfo.variants(Block.Ore,             6);
    BehaviorInfo.variants(Block.Clay,            8);
    BehaviorInfo.variants(Block.ArrowVertical,   8);
    BehaviorInfo.variants(Block.ArrowLateral,    8);
    BehaviorInfo.variants(Block.ArrowLongitudinal, 8);
    BehaviorInfo.variants(Block.Radio,           4);
    BehaviorInfo.variants(Block.Stove,           4);
    
    BehaviorInfo.variants(Block.RailsLeftRight,  6);
    BehaviorInfo.variants(Block.RailSwitch,      4);
    BehaviorInfo.variants(Block.RailSwitch_Switched,  4);
    BehaviorInfo.variantsCanSwitch(Block.RailSwitch, 4);
    BehaviorInfo.variantsCanSwitch(Block.RailSwitch_Switched, 4);

    BehaviorInfo.variantsCanSwitch(Block.JackOLantern, 2);
    BehaviorInfo.variantsCanSwitch(Block.Furnace,      2);
    BehaviorInfo.variantsCanSwitch(Block.Lamp,         2);
    BehaviorInfo.variantsCanSwitch(Block.Sponge,       2);
    BehaviorInfo.variantsCanSwitch(Block.Ghost,        2);
    BehaviorInfo.variantsCanSwitch(Block.Caldron,      2);

    // transparent blocks    
    BehaviorInfo.variantsCanSwitch(Block.TorchFloor1, 2);
    BehaviorInfo.variantsAttachAt( Block.TorchFloor1, 2, BlockFaces.Bottom);

    BehaviorInfo.variants(Block.Gate, 2);
    BehaviorInfo.variants(Block.Gate_Open, 2);
    BehaviorInfo.variantsAttachAt(Block.Gate, 4, BlockFaces.Bottom);
    BehaviorInfo.variantsCanSwitch(Block.Gate, 4);

    BehaviorInfo.variants(Block.GateSolid, 2);
    BehaviorInfo.variants(Block.GateSolid_Open, 2);
    BehaviorInfo.variantsAttachAt(Block.GateSolid, 4, BlockFaces.Bottom);
    BehaviorInfo.variantsCanSwitch(Block.GateSolid, 4);

    BehaviorInfo.variants(Block.GateWhite, 2);
    BehaviorInfo.variants(Block.GateWhite_Open, 2);
    BehaviorInfo.variantsAttachAt(Block.GateWhite, 4, BlockFaces.Bottom);
    BehaviorInfo.variantsCanSwitch(Block.GateWhite, 4);

    BehaviorInfo.attachesAt(Block.Grass,           BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Fern,            BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.DryBush,         BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Mushroom_1,      BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Mushroom_2,      BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Wheat,           BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Grain,           BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Sapling,         BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Flower,          BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Flower_1,        BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Flower_2,        BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Flower_3,        BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Flower_4,        BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Flower_5,        BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Flower_6,        BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Flower_7,        BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Carrots,         BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Potatoes,        BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Table,           BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Fire,            BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Reeds,           BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Cactus,          BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Beanstalk,       BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Grapevine,       BlockFaces.Bottom | BlockFaces.Left | BlockFaces.Back | BlockFaces.Right | BlockFaces.Front);
    BehaviorInfo.attachesAt(Block.DryFlower,       BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Cake,            BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.AlchemyLab,      BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.FlowerPot,       BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.RoseBush,        BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Sunflower,       BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.GrassBush,       BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Lilac,           BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Beet,            BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.BeetBig,         BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Path,            BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.Book,            BlockFaces.Bottom);
    BehaviorInfo.attachesAt(Block.GlassBlock,      BlockFaces.Bottom | BlockFaces.Left | BlockFaces.Back | BlockFaces.Right | BlockFaces.Front | BlockFaces.Top );

    BehaviorInfo.variants(Block.SecretEntry, 8);
    BehaviorInfo.variantsAttachAt(Block.SecretEntry, 8, BlockFaces.All);

    BehaviorInfo.variants(         Block.RailsUp,         8);
    BehaviorInfo.variantsAttachAt( Block.RailsUp,         8, BlockFaces.Bottom);
    BehaviorInfo.variants(         Block.Window,          2);
    BehaviorInfo.variantsAttachAt( Block.Window,          2, BlockFaces.Bottom);
    BehaviorInfo.variants(         Block.Window1,         2);
    BehaviorInfo.variantsAttachAt( Block.Window1,         2, BlockFaces.Bottom);
    BehaviorInfo.variants(         Block.Bed_Feet,        4);
    BehaviorInfo.variantsAttachAt( Block.Bed_Feet,        4, BlockFaces.Bottom);
    BehaviorInfo.variants(         Block.Bed_Head,        4);
    BehaviorInfo.variantsAttachAt( Block.Bed_Head,        4, BlockFaces.Bottom);
    BehaviorInfo.variants(         Block.Chair,           4);
    BehaviorInfo.variantsAttachAt( Block.Chair,           4, BlockFaces.Bottom);
    BehaviorInfo.variants(         Block.Bars,            7);
    BehaviorInfo.variantsAttachAt( Block.Bars,            7, BlockFaces.Bottom);
    BehaviorInfo.variants(         Block.Fence,           8);
    BehaviorInfo.variantsAttachAt( Block.Fence,           8, BlockFaces.Bottom);
    BehaviorInfo.variants(         Block.Fence_Special,   8);
    BehaviorInfo.variantsAttachAt( Block.Fence_Special,   8, BlockFaces.Bottom);
    BehaviorInfo.variants(         Block.FenceSolid,      8);
    BehaviorInfo.variantsAttachAt( Block.FenceSolid,      8, BlockFaces.Bottom);
    BehaviorInfo.variants(         Block.FenceWhite,      8);
    BehaviorInfo.variantsAttachAt( Block.FenceWhite,      8, BlockFaces.Bottom);
    BehaviorInfo.variants(         Block.FenceWhite_Special, 8);
    BehaviorInfo.variantsAttachAt( Block.FenceWhite_Special, 8, BlockFaces.Bottom);
    BehaviorInfo.variants(         Block.Panel,           7);
    BehaviorInfo.variantsAttachAt( Block.Panel,           7, BlockFaces.Bottom);
    BehaviorInfo.variants(         Block.Sign,            4);   
    BehaviorInfo.variantsAttachAt( Block.Sign,            4, BlockFaces.Bottom);   

    BehaviorInfo.variantsStickToMantel(Block.Ladder);
    BehaviorInfo.variantsStickToMantel(Block.SignWall);
    BehaviorInfo.variantsStickToMantel(Block.Painting);
    BehaviorInfo.variantsStickToMantel(Block.Scripture);
    BehaviorInfo.variantsStickToMantel(Block.ScriptureUsed);
    BehaviorInfo.variantsStickToMantel(Block.Cocoa);

    BehaviorInfo.variantsStickToAllSides(Block.Fur);
    BehaviorInfo.variantsStickToAllSides(Block.SpyderWeb);

    BehaviorInfo.variantsStickToAllSides(Block.LetterA);
    BehaviorInfo.variantsStickToAllSides(Block.LetterB);
    BehaviorInfo.variantsStickToAllSides(Block.LetterC);
    BehaviorInfo.variantsStickToAllSides(Block.LetterD);
    BehaviorInfo.variantsStickToAllSides(Block.LetterE);
    BehaviorInfo.variantsStickToAllSides(Block.LetterF);
    BehaviorInfo.variantsStickToAllSides(Block.LetterG);
    BehaviorInfo.variantsStickToAllSides(Block.LetterH);
    BehaviorInfo.variantsStickToAllSides(Block.LetterI);
    BehaviorInfo.variantsStickToAllSides(Block.LetterJ);
    BehaviorInfo.variantsStickToAllSides(Block.LetterK);
    BehaviorInfo.variantsStickToAllSides(Block.LetterL);
    BehaviorInfo.variantsStickToAllSides(Block.LetterM);
    BehaviorInfo.variantsStickToAllSides(Block.LetterN);
    BehaviorInfo.variantsStickToAllSides(Block.LetterO);
    BehaviorInfo.variantsStickToAllSides(Block.LetterP);
    BehaviorInfo.variantsStickToAllSides(Block.LetterQ);
    BehaviorInfo.variantsStickToAllSides(Block.LetterR);
    BehaviorInfo.variantsStickToAllSides(Block.LetterS);
    BehaviorInfo.variantsStickToAllSides(Block.LetterT);
    BehaviorInfo.variantsStickToAllSides(Block.LetterU);
    BehaviorInfo.variantsStickToAllSides(Block.LetterV);
    BehaviorInfo.variantsStickToAllSides(Block.LetterW);
    BehaviorInfo.variantsStickToAllSides(Block.LetterX);
    BehaviorInfo.variantsStickToAllSides(Block.LetterY);
    BehaviorInfo.variantsStickToAllSides(Block.LetterZ);
    BehaviorInfo.variantsStickToAllSides(Block.LetterEqual);
    BehaviorInfo.variantsStickToAllSides(Block.LetterMinus);
    BehaviorInfo.variantsStickToAllSides(Block.LetterPlus);
    BehaviorInfo.variantsStickToAllSides(Block.LetterSlash);
    BehaviorInfo.variantsStickToAllSides(Block.Letter1);
    BehaviorInfo.variantsStickToAllSides(Block.Letter2);
    BehaviorInfo.variantsStickToAllSides(Block.Letter3);
    BehaviorInfo.variantsStickToAllSides(Block.Letter4);
    BehaviorInfo.variantsStickToAllSides(Block.Letter5);
    BehaviorInfo.variantsStickToAllSides(Block.Letter6);
    BehaviorInfo.variantsStickToAllSides(Block.Letter7);
    BehaviorInfo.variantsStickToAllSides(Block.Letter8);
    BehaviorInfo.variantsStickToAllSides(Block.Letter9);
    BehaviorInfo.variantsStickToAllSides(Block.Letter0);

    BehaviorInfo.variantsStickToAllSides(Block.SnowCover);
    BehaviorInfo.variantsStickToAllSides(Block.StoneCover);
    BehaviorInfo.variantsStickToAllSides(Block.WoodCover);
    BehaviorInfo.variantsStickToAllSides(Block.IronCover);
    BehaviorInfo.variantsStickToAllSides(Block.SandCover);
    BehaviorInfo.variantsStickToAllSides(Block.ObsidianCover);
    BehaviorInfo.variantsStickToAllSides(Block.Pole);
    BehaviorInfo.variantsStickToAllSides(Block.PoleLong);

    BehaviorInfo.addGlassBehavior(Block.Glass);
    BehaviorInfo.addStairBehavior(Block.StairWood);        
    BehaviorInfo.addStairBehavior(Block.StairCobblestone);        
    BehaviorInfo.addStairBehavior(Block.StairBrick);   
    BehaviorInfo.addStairBehavior(Block.StairBrickStone);   
    BehaviorInfo.addStairBehavior(Block.StairBrickRed);   
    BehaviorInfo.addStairBehavior(Block.StairSandstone);       
    BehaviorInfo.addStairBehavior(Block.StairMarmor);        
    BehaviorInfo.addStairBehavior(Block.StairWoodDark);        
    BehaviorInfo.addStairBehavior(Block.StairWoodRed);        
    BehaviorInfo.addStairBehavior(Block.StairSandRed);        
    BehaviorInfo.addStairBehavior(Block.StairPurpur);        
    BehaviorInfo.addStairBehavior(Block.StairTile);        
    BehaviorInfo.addStairBehavior(Block.StairWoodLight);        
    
    BehaviorInfo.addDoorBehavior(Block.Door1);
    BehaviorInfo.addDoorBehavior(Block.Door2);
    BehaviorInfo.addDoorBehavior(Block.Door3);
    BehaviorInfo.addDoorBehavior(Block.Door4);
    BehaviorInfo.addDoorBehavior(Block.Door5);

    BehaviorInfo.addTrabDoorBehavior(Block.TrapDoor1);
    BehaviorInfo.addTrabDoorBehavior(Block.TrapDoor2);
    BehaviorInfo.addTrabDoorBehavior(Block.TrapDoor3);

    BehaviorInfo.addTorchBehavior(Block.TorchFloor, Block.TorchWall);

    BehaviorInfo.addSlabBehavior(Block.SlabStone,       Block.SlabStone_Up);
    BehaviorInfo.addSlabBehavior(Block.SlabSandstone,   Block.SlabSandstone_Up);
    BehaviorInfo.addSlabBehavior(Block.SlabCobblestone, Block.SlabCobblestone_Up);
    BehaviorInfo.addSlabBehavior(Block.SlabBrick,       Block.SlabBrick_Up);
    BehaviorInfo.addSlabBehavior(Block.SlabMarmor,      Block.SlabMarmor_Up);
    BehaviorInfo.addSlabBehavior(Block.SlabWood,        Block.SlabWood_Up);
    BehaviorInfo.addSlabBehavior(Block.SlabWoodRed,     Block.SlabWoodRed_Up);
    BehaviorInfo.addSlabBehavior(Block.SlabWoodDark,    Block.SlabWoodDark_Up);
    BehaviorInfo.addSlabBehavior(Block.SlabWoodLight,   Block.SlabWoodLight_Up);
    BehaviorInfo.addSlabBehavior(Block.SlabPurpur,      Block.SlabPurpur_Up);

    BehaviorInfo.addLeverBehavior(Block.Lever_Mantel,       Block.Lever_Base);
    BehaviorInfo.addButtonBehavior(Block.ButtonLED_Mantel,   Block.ButtonLED_Base);
    BehaviorInfo.addButtonBehavior(Block.ButtonStone_Mantel, Block.ButtonStone_Base);
    BehaviorInfo.addButtonBehavior(Block.ButtonWood_Mantel,  Block.ButtonWood_Base);

    BehaviorInfo.addPyramidBehavior(Block.Pyramid);
    BehaviorInfo.addBannerBehavior(Block.Banner1);
    BehaviorInfo.addBannerBehavior(Block.Banner2);
    BehaviorInfo.addBannerBehavior(Block.Banner3);
    BehaviorInfo.addBannerBehavior(Block.Banner4);
    BehaviorInfo.addBannerBehavior(Block.Banner5);

    BehaviorInfo.addBannerBehavior(Block.Horse);
}

