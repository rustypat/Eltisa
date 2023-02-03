'use strict';


initializeBlockViewDescriptions();

function initializeBlockViewDescriptions() {

    ViewInfo.addBasicBlock(Block.UnknownBlock,   65);
    ViewInfo.addBasicBlock(Block.Rock,            0);
    ViewInfo.addBasicBlock(Block.Gravel,          1);
    ViewInfo.addBasicBlock(Block.GravelGreen,   201);
    ViewInfo.addBasicBlock(Block.Grit,          126);
    ViewInfo.addBasicBlock(Block.Lava,            2);    
    ViewInfo.addBasicBlock(Block.Stone,           3);    
    ViewInfo.addBasicBlock(Block.Stone_1,         4);    
    ViewInfo.addBasicBlock(Block.Stone_2,         5);    
    ViewInfo.addBasicBlock(Block.Stone_3,         6);    
    ViewInfo.addBasicBlock(Block.Stone_4,         7);    
    ViewInfo.addBasicBlock(Block.Stone_5,         8);    
    ViewInfo.addBasicBlock(Block.Sand,            9);
    ViewInfo.addBasicBlock(Block.Sand_1,         10);
    ViewInfo.addBasicBlock(Block.Sand_2,         11);
    ViewInfo.addBasicBlock(Block.Sand_3,         12);    
    ViewInfo.addBasicBlock(Block.Sand_4,        186);    
    ViewInfo.addBasicBlock(Block.Dirt,           13);    
    ViewInfo.addBasicBlock(Block.Dirt_1,         14);    
    ViewInfo.addBasicBlock(Block.Dirt_2,         15);    
    ViewInfo.addBasicBlock(Block.Dirt_3,         16);        
    ViewInfo.addBasicBlock(Block.Dirt_4,         17);

    ViewInfo.addBasicBlock(Block.Clay_White,     18);    
    ViewInfo.addBasicBlock(Block.Clay_Orange,    19);    
    ViewInfo.addBasicBlock(Block.Clay_Magenta,   20);    
    ViewInfo.addBasicBlock(Block.Clay_LightBlue, 21);    
    ViewInfo.addBasicBlock(Block.Clay_Yellow,    22);    
    ViewInfo.addBasicBlock(Block.Clay_Lime,      23);    
    ViewInfo.addBasicBlock(Block.Clay_Pink,      24);    
    ViewInfo.addBasicBlock(Block.Clay_Gray,      25);        
    ViewInfo.addBasicBlock(Block.Clay_LightGray,190);    
    ViewInfo.addBasicBlock(Block.Clay_Cyan,     191);    
    ViewInfo.addBasicBlock(Block.Clay_Purple,   192);    
    ViewInfo.addBasicBlock(Block.Clay_Blue,     193);    
    ViewInfo.addBasicBlock(Block.Clay_Brown,    194);    
    ViewInfo.addBasicBlock(Block.Clay_Green,    195);    
    ViewInfo.addBasicBlock(Block.Clay_Red,      196);    
    ViewInfo.addBasicBlock(Block.Clay_Black,    197);   

    ViewInfo.addBasicBlock(Block.Water,          26);
    ViewInfo.addBasicBlock(Block.Ice,            27);
    ViewInfo.addBasicBlock(Block.Snow,           28);    
    ViewInfo.addBasicBlock(Block.GrassBlock,     29);
    ViewInfo.addBasicBlock(Block.Leaves,         43);
    ViewInfo.addBasicBlock(Block.Leaves_1,       44);
    ViewInfo.addBasicBlock(Block.Leaves_2,       45);
    ViewInfo.addBasicBlock(Block.Ore,            46);    
    ViewInfo.addBasicBlock(Block.Ore_1,          47);    
    ViewInfo.addBasicBlock(Block.Ore_2,          48);    
    ViewInfo.addBasicBlock(Block.Ore_3,          49);    
    ViewInfo.addBasicBlock(Block.Ore_4,          50);    
    ViewInfo.addBasicBlock(Block.Ore_5,          51);        
    ViewInfo.addBasicBlock(Block.Ore_6,         198);        
    ViewInfo.addBasicBlock(Block.Wall    ,       57);
    ViewInfo.addBasicBlock(Block.Wall_1  ,       58);
    ViewInfo.addBasicBlock(Block.Wall_2  ,       59);
    ViewInfo.addBasicBlock(Block.Wall_3  ,       60);
    ViewInfo.addBasicBlock(Block.Wall_4  ,       61);
    ViewInfo.addBasicBlock(Block.Wall_5  ,       62);    
    ViewInfo.addBasicBlock(Block.Wall_6  ,      138);    
    ViewInfo.addBasicBlock(Block.Wall_7  ,      146);    
    ViewInfo.addBasicBlock(Block.Wall_8  ,      147);    
    ViewInfo.addBasicBlock(Block.Wall_9  ,      148);    
    ViewInfo.addBasicBlock(Block.Wall_10 ,      149);        
    ViewInfo.addBasicBlock(Block.Wall_11 ,      155);        
    ViewInfo.addBasicBlock(Block.Wall_12,       176);
    ViewInfo.addBasicBlock(Block.Wall_13,       177);
    ViewInfo.addBasicBlock(Block.Lamp    ,       63);
    ViewInfo.addBasicBlock(Block.Lamp_On  ,      64);
    ViewInfo.addBasicBlock(Block.Ashlar  ,       67);    
    ViewInfo.addBasicBlock(Block.Ashlar_1,       68);    
    ViewInfo.addBasicBlock(Block.Ashlar_2,       69);    
    ViewInfo.addBasicBlock(Block.Ashlar_3,       70);    
    ViewInfo.addBasicBlock(Block.Ashlar_4,       71);    
    ViewInfo.addBasicBlock(Block.Ashlar_5,       72);    
    ViewInfo.addBasicBlock(Block.Ashlar_6,       73);     
    ViewInfo.addBasicBlock(Block.Carved,         82);    
    ViewInfo.addBasicBlock(Block.Carved_1,       83);    
    ViewInfo.addBasicBlock(Block.Carved_2,       84);    
    ViewInfo.addBasicBlock(Block.Carved_3,       85);    
    ViewInfo.addBasicBlock(Block.Carved_4,      185);    
    ViewInfo.addBasicBlock(Block.Shelf,          88);
    ViewInfo.addBasicBlock(Block.Box,            89);    
    ViewInfo.addBasicBlock(Block.Box_1,          90);    
    ViewInfo.addBasicBlock(Block.Box_2,          91);    
    ViewInfo.addBasicBlock(Block.Box_3,          92);    
    ViewInfo.addBasicBlock(Block.Gem,            93);    
    ViewInfo.addBasicBlock(Block.Gem_1,          94);    
    ViewInfo.addBasicBlock(Block.Gem_2,          95);    
    ViewInfo.addBasicBlock(Block.Gem_3,          96);    
    ViewInfo.addBasicBlock(Block.Gem_4,          97);        
    ViewInfo.addBasicBlock(Block.Gem_5,         200);        
    ViewInfo.addBasicBlock(Block.Sponge,         98);
    ViewInfo.addBasicBlock(Block.Sponge_1,       30);
    ViewInfo.addBasicBlock(Block.Ironblock,     118);
    ViewInfo.addBasicBlock(Block.Goldblock,     119);
    ViewInfo.addBasicBlock(Block.Cage,          139);
    ViewInfo.addBasicBlock(Block.Ghost,         240);
    ViewInfo.addBasicBlock(Block.Ghost_1,       241);
    ViewInfo.addBasicBlock(Block.Disco,         132);
    ViewInfo.addBasicBlock(Block.Mystic_Plant,  130);
    ViewInfo.addBasicBlock(Block.Mystic_Flower, 131);
    ViewInfo.addBasicBlock(Block.Felt_White,    100);
    ViewInfo.addBasicBlock(Block.Felt_Orange,   101);
    ViewInfo.addBasicBlock(Block.Felt_Magenta,  102);
    ViewInfo.addBasicBlock(Block.Felt_LightBlue,103);
    ViewInfo.addBasicBlock(Block.Felt_Yellow,   104);
    ViewInfo.addBasicBlock(Block.Felt_Lime,     105);
    ViewInfo.addBasicBlock(Block.Felt_Pink,     106);
    ViewInfo.addBasicBlock(Block.Felt_Gray,     107);
    ViewInfo.addBasicBlock(Block.Felt_LightGray,108);
    ViewInfo.addBasicBlock(Block.Felt_Cyan,     109);
    ViewInfo.addBasicBlock(Block.Felt_Purple,   110);
    ViewInfo.addBasicBlock(Block.Felt_Blue,     111);
    ViewInfo.addBasicBlock(Block.Felt_Brown,    112);
    ViewInfo.addBasicBlock(Block.Felt_Green,    113);
    ViewInfo.addBasicBlock(Block.Felt_Red,      114);
    ViewInfo.addBasicBlock(Block.Felt_Black,    115);

    ViewInfo.addBasicBlock(Block.Glass_White,   160);
    ViewInfo.addBasicBlock(Block.Glass_Orange,  161);
    ViewInfo.addBasicBlock(Block.Glass_Magenta, 162);
    ViewInfo.addBasicBlock(Block.Glass_LightBlue,163);
    ViewInfo.addBasicBlock(Block.Glass_Yellow,  164);
    ViewInfo.addBasicBlock(Block.Glass_Lime,    165);
    ViewInfo.addBasicBlock(Block.Glass_Pink,    166);
    ViewInfo.addBasicBlock(Block.Glass_Gray,    167);
    ViewInfo.addBasicBlock(Block.Glass_LightGray,168);
    ViewInfo.addBasicBlock(Block.Glass_Cyan,    169);
    ViewInfo.addBasicBlock(Block.Glass_Purple,  170);
    ViewInfo.addBasicBlock(Block.Glass_Blue,    171);
    ViewInfo.addBasicBlock(Block.Glass_Brown,   172);
    ViewInfo.addBasicBlock(Block.Glass_Green,   173);
    ViewInfo.addBasicBlock(Block.Glass_Red,     174);
    ViewInfo.addBasicBlock(Block.Glass_Black,   175);

    ViewInfo.addBasicBlock(Block.Tresor,        187);
    ViewInfo.addBasicBlock(Block.WindowBlock,   189);
    ViewInfo.addBasicBlock(Block.WindowBlock_1, 199);
    
    ViewInfo.addBasicBlock(Block.Portal,        143);
    ViewInfo.addBasicBlock(Block.Tetris,        157);
    ViewInfo.addBasicBlock(Block.LavaPink,      158);
    ViewInfo.addBasicBlock(Block.LavaBrown,     159);
    ViewInfo.addBasicBlock(Block.Camera,        202);
    ViewInfo.addBasicBlock(Block.Internet,      200);

    ViewInfo.addVerticalBlock(Block.Pumpkin,        52, 53);
    ViewInfo.addVerticalBlock(Block.JackOLantern,   54, 53);
    ViewInfo.addVerticalBlock(Block.JackOLantern_On, 99, 53);
    ViewInfo.addVerticalBlock(Block.Melon,          55, 56);
    ViewInfo.addVerticalBlock(Block.Pillar,         74, 75);    
    ViewInfo.addVerticalBlock(Block.Oracle,         76, 77);
    ViewInfo.addVerticalBlock(Block.OracleUsed,     78, 77);
    ViewInfo.addVerticalBlock(Block.Furnace,        80, 81); 
    ViewInfo.addVerticalBlock(Block.Furnace_On,     79, 81);         
    ViewInfo.addVerticalBlock(Block.Drawer,         86, 87);    
    ViewInfo.addVerticalBlock(Block.TableStone,    136, 138, 137);    
    ViewInfo.addVerticalBlock(Block.TableIron,     140, 142, 141);    
    ViewInfo.addVerticalBlock(Block.Box_4,         150, 151);    
    ViewInfo.addVerticalBlock(Block.Box_5,         152, 153);    
    ViewInfo.addVerticalBlock(Block.Hayblock,      116, 117);
    ViewInfo.addVerticalBlock(Block.Radio,         120, 120, 120);
    ViewInfo.addVerticalBlock(Block.Radio_1,       121, 121, 121);
    ViewInfo.addVerticalBlock(Block.Radio_2,       122, 122, 122);
    ViewInfo.addVerticalBlock(Block.Radio_3,       123, 123, 123);
    ViewInfo.addVerticalBlock(Block.Stove,         243, 244, 242);
    ViewInfo.addVerticalBlock(Block.Waterlily,      26,  26, 154);
    ViewInfo.addVerticalBlock(Block.Dirt_5,        178,  14, 179);
    ViewInfo.addVerticalBlock(Block.Caldron,       180, 181, 182); 
    ViewInfo.addVerticalBlock(Block.Caldron_On,    183, 181, 184);
    ViewInfo.addVerticalBlock(Block.Music,         124, 125);         
    
    ViewInfo.addToppleableLog(Block.Log_1, 31, 32);
    ViewInfo.addToppleableLog(Block.Log_2, 33, 34);
    ViewInfo.addToppleableLog(Block.Log_3, 35, 36);
    ViewInfo.addToppleableLog(Block.Log_4, 37, 38);
    ViewInfo.addToppleableLog(Block.Log_5, 39, 40);
    ViewInfo.addToppleableLog(Block.Log_6, 41, 42);
    
    ViewInfo.addDoor(Block.Door1,    0, 5, 0);
    ViewInfo.addDoor(Block.Door2,    1, 5, 0);
    ViewInfo.addDoor(Block.Door3,    2, 5, 2);
    ViewInfo.addDoor(Block.Door4,    3, 5, 3);
    ViewInfo.addDoor(Block.Door5,    4, 5, 1);

    ViewInfo.addCross(Block.Grass,      15, 0.45, 0.85, true);        
    ViewInfo.addCross(Block.Fern,       51, 0.45, 0.65, true);        
    ViewInfo.addCross(Block.DryBush,    28, 0.3,  0.5,  true);
    ViewInfo.addCross(Block.Mushroom_1, 21, 0.38, 0.4,  true);
    ViewInfo.addCross(Block.Mushroom_2, 22, 0.2,  0.45, true);
    ViewInfo.addCross(Block.Wheat,      23, 0.5,  0.85, true);
    ViewInfo.addCross(Block.Grain,      24, 0.5,  1,    true);
    ViewInfo.addCross(Block.Sapling,    25, 0.35, 1,    true);    
    ViewInfo.addCross(Block.Flower,     29, 0.35, 0.65, true);        
    ViewInfo.addCross(Block.Flower_1,   74, 0.45, 0.9,  true);        
    ViewInfo.addCross(Block.Flower_2,   75, 0.25, 0.6,  true);        
    ViewInfo.addCross(Block.Flower_3,   76, 0.2,  0.65, true);     
    ViewInfo.addCross(Block.Flower_4,   77, 0.2,  0.6,  true);        
    ViewInfo.addCross(Block.Flower_5,   78, 0.25, 0.88, true);        
    ViewInfo.addCross(Block.Flower_6,   79, 0.35, 1,    true);        
    ViewInfo.addCross(Block.Flower_7,   20, 0.5,  1,    true);        
    ViewInfo.addCross(Block.Fire,       57, 0.5,  1,    true);
    ViewInfo.addCross(Block.DryFlower, 167, 0.4, 0.7,   true);
    ViewInfo.addCross(Block.TorchFloor, 58, 0.2,  0.85);
    ViewInfo.addCross(Block.TorchFloor_Off,   59, 0.2,  0.85);
    ViewInfo.addCross(Block.TorchFloor1,      52, 0.2,  0.85);
    ViewInfo.addCross(Block.TorchFloor1_Off,  53, 0.2,  0.85);
    ViewInfo.addCross(Block.AlchemyLab,168, 0.5,  0.9);
    ViewInfo.addCross(Block.RoseBush,  6, 0.5,  2, true);
    ViewInfo.addCross(Block.Sunflower, 7, 0.4,  2, true, true);
    ViewInfo.addCross(Block.GrassBush, 8, 0.5,  2, true);
    ViewInfo.addCross(Block.Lilac,     9, 0.5,  2, true, true);
    ViewInfo.addCross(Block.Beet,    177, 0.5,  0.4, true, true);
    ViewInfo.addCross(Block.BeetBig, 176, 0.5,  1, true, true);

    ViewInfo.addDiagonalCross(Block.Reeds,  149, 0.4, 1);

    ViewInfo.addParallelPlanes(Block.Carrots,  26, 0.55, true);
    ViewInfo.addParallelPlanes(Block.Potatoes, 27, 0.4,  true);        

    ViewInfo.addTable(Block.Table, 43, 44, 44);        
    ViewInfo.addTurnableChair(Block.Chair, 45, 46, 47, 44);        
    
    ViewInfo.addFlippablePlane(Block.Window, 49, 49);
    ViewInfo.addFlippablePlane(Block.Window1, 73, 73);         
    ViewInfo.addFence(Block.Bars, 48, 0.01);        
    ViewInfo.addFence(Block.Fence, 150, 0.1); 
    ViewInfo.addFenceSpecial(Block.Fence_Special, 150, 0.1); 
    ViewInfo.addFence(Block.FenceWhite, 202, 0.1);        
    ViewInfo.addFenceSpecial(Block.FenceWhite_Special, 202, 0.1);        
    ViewInfo.addFence(Block.FenceSolid, 50, 0.01);        
                      
    ViewInfo.addFence(Block.Panel, 161, 0.01);
    ViewInfo.addGlass(Block.Glass, 34, 0.01);

    ViewInfo.addWallTorch(Block.TorchWall, 58, 54);
    ViewInfo.addWallTorch(Block.TorchWall_Off, 59, 55);

    ViewInfo.addBlock(Block.ArrowVertical+0, 127, 127, 127, 127, 128, 128, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowVertical+1, 127, 127, 127, 127, 129, 129, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn90, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowVertical+2, 127, 127, 127, 127, 128, 128, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn90, Orientation.Turn270);                
    ViewInfo.addBlock(Block.ArrowVertical+3, 127, 127, 127, 127, 129, 129, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn180, Orientation.Turn270);                
    ViewInfo.addBlock(Block.ArrowVertical+4, 127, 127, 127, 127, 128, 128, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn180, Orientation.Turn180);                
    ViewInfo.addBlock(Block.ArrowVertical+5, 127, 127, 127, 127, 129, 129, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn270, Orientation.Turn180);                
    ViewInfo.addBlock(Block.ArrowVertical+6, 127, 127, 127, 127, 128, 128, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn270, Orientation.Turn90);                
    ViewInfo.addBlock(Block.ArrowVertical+7, 127, 127, 127, 127, 129, 129, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn90);                
        
    ViewInfo.addBlock(Block.ArrowLateral+0, 128, 128, 127, 127, 127, 127,  Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowLateral+1, 129, 129, 127, 127, 127, 127,  Orientation.Turn90, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowLateral+2, 128, 128, 127, 127, 127, 127,  Orientation.Turn90, Orientation.Turn270, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowLateral+3, 129, 129, 127, 127, 127, 127,  Orientation.Turn180, Orientation.Turn270, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowLateral+4, 128, 128, 127, 127, 127, 127,  Orientation.Turn180, Orientation.Turn180, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowLateral+5, 129, 129, 127, 127, 127, 127,  Orientation.Turn270, Orientation.Turn180, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowLateral+6, 128, 128, 127, 127, 127, 127,  Orientation.Turn270, Orientation.Turn90, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowLateral+7, 129, 129, 127, 127, 127, 127,  Orientation.Normal, Orientation.Turn90, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
            
    ViewInfo.addBlock(Block.ArrowLongitudinal+0, 127, 127, 128, 128, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowLongitudinal+1, 127, 127, 129, 129, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Turn90, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowLongitudinal+2, 127, 127, 128, 128, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Turn90, Orientation.Turn270, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowLongitudinal+3, 127, 127, 129, 129, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Turn180, Orientation.Turn270, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowLongitudinal+4, 127, 127, 128, 128, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Turn180, Orientation.Turn180, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowLongitudinal+5, 127, 127, 129, 129, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Turn270, Orientation.Turn180, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowLongitudinal+6, 127, 127, 128, 128, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Turn270, Orientation.Turn90, Orientation.Normal, Orientation.Normal);                
    ViewInfo.addBlock(Block.ArrowLongitudinal+7, 127, 127, 129, 129, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn90, Orientation.Normal, Orientation.Normal);                
            
    ViewInfo.addFlippablePlane(Block.Gate, 151, 151);        
    ViewInfo.addFlippableOpenGate(Block.Gate_Open, 151);   
    ViewInfo.addFlippablePlane(Block.GateSolid, 30, 30);        
    ViewInfo.addFlippableOpenGate(Block.GateSolid_Open, 30);   
    ViewInfo.addFlippablePlane(Block.GateWhite, 203, 203);        
    ViewInfo.addFlippableOpenGate(Block.GateWhite_Open, 203);   
            
    ViewInfo.addTurnableSide(Block.TrapDoor1, 31, BlockFaces.Top);
    ViewInfo.addDecoratorForMantel(Block.TrapDoor1_Open, 31);
    
    ViewInfo.addTurnableSide(Block.TrapDoor2, 32, BlockFaces.Top);
    ViewInfo.addDecoratorForMantel(Block.TrapDoor2_Open, 32);
    
    ViewInfo.addTurnableSide(Block.TrapDoor3, 33, BlockFaces.Top);
    ViewInfo.addDecoratorForMantel(Block.TrapDoor3_Open, 33);
        
    ViewInfo.addDecoratorForMantel(Block.Scripture, 60);
    ViewInfo.addDecoratorForMantel(Block.ScriptureUsed, 63);
    
    ViewInfo.addVerticalBlock(Block.RailsBackFront,  135, 135, 133, Orientation.Normal);  
    ViewInfo.addVerticalBlock(Block.RailsLeftRight,  135, 135, 133, Orientation.Turn90);          
    ViewInfo.addVerticalBlock(Block.RailsLeftBack,   135, 135, 134, Orientation.Normal);          
    ViewInfo.addVerticalBlock(Block.RailsBackRight,  135, 135, 134, Orientation.Turn90);          
    ViewInfo.addVerticalBlock(Block.RailsRightFront, 135, 135, 134, Orientation.Turn180);          
    ViewInfo.addVerticalBlock(Block.RailsFrontLeft,  135, 135, 134, Orientation.Turn270);  
    ViewInfo.addBasicBlock(Block.RailGrit, 135);          

    
    ViewInfo.addTurnableBlock(Block.RailSwitch, 135, 135, 135, 135, 135, 144);  
    ViewInfo.addTurnableBlock(Block.RailSwitch_Switched, 135, 135, 135, 135, 135, 145);  
    
    ViewInfo.addTurnableWedge(Block.RailsUp, 64, 65, 67, 67);          
    ViewInfo.addTurnableHighWedge(Block.RailsUpHigh, 64, 66, 67, 67, 67);          

    ViewInfo.addRotatableWeb(Block.SpyderWeb, 68);          
    ViewInfo.addPath(Block.Path, 201,200, 201);          
            
    ViewInfo.addDecorator(Block.Book, 69, BlockFaces.Bottom);         

    ViewInfo.addTurnablePlane(Block.Sign, 70, 71);

    ViewInfo.addDecoratorForMantel(Block.Ladder, 56);        
    ViewInfo.addDecoratorForMantel(Block.Painting, 61);
    ViewInfo.addDecoratorForMantel(Block.SignWall, 72);

    ViewInfo.addDecoratorForAllSides(Block.Fur, 62);

    ViewInfo.addDecoratorForAllSides(Block.LetterA, 80);
    ViewInfo.addDecoratorForAllSides(Block.LetterB, 81);
    ViewInfo.addDecoratorForAllSides(Block.LetterC, 82);
    ViewInfo.addDecoratorForAllSides(Block.LetterD, 83);
    ViewInfo.addDecoratorForAllSides(Block.LetterE, 84);
    ViewInfo.addDecoratorForAllSides(Block.LetterF, 85);
    ViewInfo.addDecoratorForAllSides(Block.LetterG, 86);
    ViewInfo.addDecoratorForAllSides(Block.LetterH, 87);
    ViewInfo.addDecoratorForAllSides(Block.LetterI, 88);
    ViewInfo.addDecoratorForAllSides(Block.LetterJ, 89);
    ViewInfo.addDecoratorForAllSides(Block.LetterK, 90);
    ViewInfo.addDecoratorForAllSides(Block.LetterL, 91);
    ViewInfo.addDecoratorForAllSides(Block.LetterM, 92);
    ViewInfo.addDecoratorForAllSides(Block.LetterN, 93);
    ViewInfo.addDecoratorForAllSides(Block.LetterO, 94);
    ViewInfo.addDecoratorForAllSides(Block.LetterP, 95);
    ViewInfo.addDecoratorForAllSides(Block.LetterQ, 96);
    ViewInfo.addDecoratorForAllSides(Block.LetterR, 97);
    ViewInfo.addDecoratorForAllSides(Block.LetterS, 98);
    ViewInfo.addDecoratorForAllSides(Block.LetterT, 99);
    ViewInfo.addDecoratorForAllSides(Block.LetterU, 100);
    ViewInfo.addDecoratorForAllSides(Block.LetterV, 101);
    ViewInfo.addDecoratorForAllSides(Block.LetterW, 102);
    ViewInfo.addDecoratorForAllSides(Block.LetterX, 103);
    ViewInfo.addDecoratorForAllSides(Block.LetterY, 104);
    ViewInfo.addDecoratorForAllSides(Block.LetterZ, 105);

    ViewInfo.addDecoratorForAllSides(Block.LetterEqual, 106);
    ViewInfo.addDecoratorForAllSides(Block.LetterMinus, 107);
    ViewInfo.addDecoratorForAllSides(Block.LetterPlus, 108);
    ViewInfo.addDecoratorForAllSides(Block.LetterSlash, 109);
    ViewInfo.addDecoratorForAllSides(Block.Letter1, 110);
    ViewInfo.addDecoratorForAllSides(Block.Letter2, 111);
    ViewInfo.addDecoratorForAllSides(Block.Letter3, 112);
    ViewInfo.addDecoratorForAllSides(Block.Letter4, 113);
    ViewInfo.addDecoratorForAllSides(Block.Letter5, 114);
    ViewInfo.addDecoratorForAllSides(Block.Letter6, 115);
    ViewInfo.addDecoratorForAllSides(Block.Letter7, 116);
    ViewInfo.addDecoratorForAllSides(Block.Letter8, 117);
    ViewInfo.addDecoratorForAllSides(Block.Letter9, 118);
    ViewInfo.addDecoratorForAllSides(Block.Letter0, 119);

    ViewInfo.addDecoratorForAllSides(Block.SnowCover,     144);
    ViewInfo.addDecoratorForAllSides(Block.StoneCover,    145);
    ViewInfo.addDecoratorForAllSides(Block.WoodCover,     146);
    ViewInfo.addDecoratorForAllSides(Block.IronCover,     147);
    ViewInfo.addDecoratorForAllSides(Block.SandCover,     148);
    ViewInfo.addDecoratorForAllSides(Block.ObsidianCover, 169);

    ViewInfo.addStair(Block.StairWood, 123, 122);
    ViewInfo.addStair(Block.StairCobblestone, 127, 126);
    ViewInfo.addStair(Block.StairBrick, 125, 124);
    ViewInfo.addStair(Block.StairBrickStone, 129, 128);
    ViewInfo.addStair(Block.StairBrickRed, 131, 130);
    ViewInfo.addStair(Block.StairSandstone, 133, 132);
    ViewInfo.addStair(Block.StairMarmor, 121, 120);
    ViewInfo.addStair(Block.StairWoodDark, 135, 134);
    ViewInfo.addStair(Block.StairWoodRed, 137, 136);
    ViewInfo.addStair(Block.StairSandRed, 139, 138);
    ViewInfo.addStair(Block.StairPurpur, 141, 140);
    ViewInfo.addStair(Block.StairTile, 143, 142);
    ViewInfo.addStair(Block.StairWoodLight, 171, 170);

    ViewInfo.addTurnableHalfBlock(Block.Bed_Feet, 35, 36, 38, 36, 39, 37);
    ViewInfo.addTurnableHalfBlock(Block.Bed_Head, 38, 41, 40, 41, 39, 42);

    ViewInfo.addInsetBlock(Block.Cactus, 152, 154, 153, 0.065, 0, 0);
    ViewInfo.addInsetBlock(Block.Cake,   155, 157, 156, 0.13,  0, 0.5);    

    ViewInfo.addLowerHalfBlock(Block.SlabStone, 162);
    ViewInfo.addUpperHalfBlock(Block.SlabStone_Up, 162);
    ViewInfo.addLowerHalfBlock(Block.SlabSandstone, 133);
    ViewInfo.addUpperHalfBlock(Block.SlabSandstone_Up, 133);
    ViewInfo.addLowerHalfBlock(Block.SlabCobblestone, 127);
    ViewInfo.addUpperHalfBlock(Block.SlabCobblestone_Up, 127);
    ViewInfo.addLowerHalfBlock(Block.SlabBrick, 125);
    ViewInfo.addUpperHalfBlock(Block.SlabBrick_Up, 125);

    ViewInfo.addLowerHalfBlock(Block.SlabMarmor, 121);
    ViewInfo.addUpperHalfBlock(Block.SlabMarmor_Up, 121);
    ViewInfo.addLowerHalfBlock(Block.SlabWood, 123);
    ViewInfo.addUpperHalfBlock(Block.SlabWood_Up, 123);
    ViewInfo.addLowerHalfBlock(Block.SlabWoodRed, 137);
    ViewInfo.addUpperHalfBlock(Block.SlabWoodRed_Up, 137);
    ViewInfo.addLowerHalfBlock(Block.SlabWoodDark, 135);
    ViewInfo.addUpperHalfBlock(Block.SlabWoodDark_Up, 135);

    ViewInfo.addLowerHalfBlock(Block.SlabWoodLight, 171);
    ViewInfo.addUpperHalfBlock(Block.SlabWoodLight_Up, 171);
    ViewInfo.addLowerHalfBlock(Block.SlabPurpur, 141);
    ViewInfo.addUpperHalfBlock(Block.SlabPurpur_Up, 141);

    ViewInfo.addCenterPlane(Block.Beanstalk, 165, true);
    ViewInfo.addGrapevine(Block.Grapevine, 166, true);
    ViewInfo.addSidePlane(Block.Cocoa, 172);
    ViewInfo.addSmallBlock(Block.FlowerPot, 173, 173, 174, 0.4, 1, BlockFaces.Bottom);    
    ViewInfo.addSmallBlock(Block.GlassBlock, 34, 34, 34, 1, 1, BlockFaces.Bottom);    
    
    ViewInfo.addLeverMantel(Block.Lever_Mantel , 163, 164);
    ViewInfo.addLeverBase(Block.Lever_Base, 163, 164);

    
    ViewInfo.addSmallBlock(Block.ButtonLED_Mantel+0, 160, 160, 158, 0.4, 0.2, BlockFaces.Left);
    ViewInfo.addSmallBlock(Block.ButtonLED_Mantel+1, 160, 160, 159, 0.4, 0.2, BlockFaces.Left);
    ViewInfo.addSmallBlock(Block.ButtonLED_Mantel+2, 160, 160, 158, 0.4, 0.2, BlockFaces.Back);
    ViewInfo.addSmallBlock(Block.ButtonLED_Mantel+3, 160, 160, 159, 0.4, 0.2, BlockFaces.Back);
    ViewInfo.addSmallBlock(Block.ButtonLED_Mantel+4, 160, 160, 158, 0.4, 0.2, BlockFaces.Right);
    ViewInfo.addSmallBlock(Block.ButtonLED_Mantel+5, 160, 160, 159, 0.4, 0.2, BlockFaces.Right);
    ViewInfo.addSmallBlock(Block.ButtonLED_Mantel+6, 160, 160, 158, 0.4, 0.2, BlockFaces.Front);
    ViewInfo.addSmallBlock(Block.ButtonLED_Mantel+7, 160, 160, 159, 0.4, 0.2, BlockFaces.Front);
    ViewInfo.addSmallBlock(Block.ButtonLED_Base+0,   160, 160, 158, 0.4, 0.2, BlockFaces.Bottom);
    ViewInfo.addSmallBlock(Block.ButtonLED_Base+1,   160, 160, 159, 0.4, 0.2, BlockFaces.Bottom);
    ViewInfo.addSmallBlock(Block.ButtonLED_Base+2,   160, 160, 158, 0.4, 0.2, BlockFaces.Top);
    ViewInfo.addSmallBlock(Block.ButtonLED_Base+3,   160, 160, 159, 0.4, 0.2, BlockFaces.Top);

    ViewInfo.addSmallBlock(Block.ButtonStone_Mantel+0, 121, 121, 121, 0.25, 0.15, BlockFaces.Left);
    ViewInfo.addSmallBlock(Block.ButtonStone_Mantel+1, 121, 121, 121, 0.25, 0.1, BlockFaces.Left);
    ViewInfo.addSmallBlock(Block.ButtonStone_Mantel+2, 121, 121, 121, 0.25, 0.15, BlockFaces.Back);
    ViewInfo.addSmallBlock(Block.ButtonStone_Mantel+3, 121, 121, 121, 0.25, 0.1, BlockFaces.Back);
    ViewInfo.addSmallBlock(Block.ButtonStone_Mantel+4, 121, 121, 121, 0.25, 0.15, BlockFaces.Right);
    ViewInfo.addSmallBlock(Block.ButtonStone_Mantel+5, 121, 121, 121, 0.25, 0.1, BlockFaces.Right);
    ViewInfo.addSmallBlock(Block.ButtonStone_Mantel+6, 121, 121, 121, 0.25, 0.15, BlockFaces.Front);
    ViewInfo.addSmallBlock(Block.ButtonStone_Mantel+7, 121, 121, 121, 0.25, 0.1, BlockFaces.Front);
    ViewInfo.addSmallBlock(Block.ButtonStone_Base+0,   121, 121, 121, 0.25, 0.15, BlockFaces.Bottom);
    ViewInfo.addSmallBlock(Block.ButtonStone_Base+1,   121, 121, 121, 0.25, 0.1, BlockFaces.Bottom);
    ViewInfo.addSmallBlock(Block.ButtonStone_Base+2,   121, 121, 121, 0.25, 0.15, BlockFaces.Top);
    ViewInfo.addSmallBlock(Block.ButtonStone_Base+3,   121, 121, 121, 0.25, 0.1, BlockFaces.Top);

    ViewInfo.addSmallBlock(Block.ButtonWood_Mantel+0, 135, 135, 135, 0.25, 0.15, BlockFaces.Left);
    ViewInfo.addSmallBlock(Block.ButtonWood_Mantel+1, 135, 135, 135, 0.25, 0.1, BlockFaces.Left);
    ViewInfo.addSmallBlock(Block.ButtonWood_Mantel+2, 135, 135, 135, 0.25, 0.15, BlockFaces.Back);
    ViewInfo.addSmallBlock(Block.ButtonWood_Mantel+3, 135, 135, 135, 0.25, 0.1, BlockFaces.Back);
    ViewInfo.addSmallBlock(Block.ButtonWood_Mantel+4, 135, 135, 135, 0.25, 0.15, BlockFaces.Right);
    ViewInfo.addSmallBlock(Block.ButtonWood_Mantel+5, 135, 135, 135, 0.25, 0.1, BlockFaces.Right);
    ViewInfo.addSmallBlock(Block.ButtonWood_Mantel+6, 135, 135, 135, 0.25, 0.15, BlockFaces.Front);
    ViewInfo.addSmallBlock(Block.ButtonWood_Mantel+7, 135, 135, 135, 0.25, 0.1, BlockFaces.Front);
    ViewInfo.addSmallBlock(Block.ButtonWood_Base+0,   135, 135, 135, 0.25, 0.15, BlockFaces.Bottom);
    ViewInfo.addSmallBlock(Block.ButtonWood_Base+1,   135, 135, 135, 0.25, 0.1, BlockFaces.Bottom);
    ViewInfo.addSmallBlock(Block.ButtonWood_Base+2,   135, 135, 135, 0.25, 0.15, BlockFaces.Top);
    ViewInfo.addSmallBlock(Block.ButtonWood_Base+3,   135, 135, 135, 0.25, 0.1, BlockFaces.Top);

    ViewInfo.addSmallBlock(Block.Pole+0, 161, 161, 161, 0.2, 1, BlockFaces.Left);
    ViewInfo.addSmallBlock(Block.Pole+1, 161, 161, 161, 0.2, 1, BlockFaces.Back);
    ViewInfo.addSmallBlock(Block.Pole+2, 161, 161, 161, 0.2, 1, BlockFaces.Right);
    ViewInfo.addSmallBlock(Block.Pole+3, 161, 161, 161, 0.2, 1, BlockFaces.Front);
    ViewInfo.addSmallBlock(Block.Pole+4, 161, 161, 161, 0.2, 1, BlockFaces.Bottom);
    ViewInfo.addSmallBlock(Block.Pole+5, 161, 161, 161, 0.2, 1, BlockFaces.Top);

    ViewInfo.addSmallBlock(Block.PoleLong+0, 161, 161, 161, 0.2, 4, BlockFaces.Left);
    ViewInfo.addSmallBlock(Block.PoleLong+1, 161, 161, 161, 0.2, 4, BlockFaces.Back);
    ViewInfo.addSmallBlock(Block.PoleLong+2, 161, 161, 161, 0.2, 4, BlockFaces.Right);
    ViewInfo.addSmallBlock(Block.PoleLong+3, 161, 161, 161, 0.2, 4, BlockFaces.Front);
    ViewInfo.addSmallBlock(Block.PoleLong+4, 161, 161, 161, 0.2, 4, BlockFaces.Bottom);
    ViewInfo.addSmallBlock(Block.PoleLong+5, 161, 161, 161, 0.2, 4, BlockFaces.Top);

    ViewInfo.addPyramide(Block.Pyramid, 175);
    ViewInfo.addBanner(Block.Banner1, 180, 181, 0.35, 1.8);
    ViewInfo.addBanner(Block.Banner2, 182, 183, 0.35, 1.8);
    ViewInfo.addBanner(Block.Banner3, 184, 185, 0.35, 1.8);
    ViewInfo.addBanner(Block.Banner4, 186, 187, 0.35, 1.8);
    ViewInfo.addBanner(Block.Banner5, 188, 189, 0.35, 1.8);

    ViewInfo.addBanner(Block.Horse, 204, 204, 1, 2);

    ViewInfo.addBasicBlock(Block.SecretEntry+0, 210, true);
    ViewInfo.addBasicBlock(Block.SecretEntry+1, 211, true);
    ViewInfo.addBasicBlock(Block.SecretEntry+2, 212, true);
    ViewInfo.addBasicBlock(Block.SecretEntry+3, 213, true);
    ViewInfo.addBasicBlock(Block.SecretEntry+4, 220, true);
    ViewInfo.addBasicBlock(Block.SecretEntry+5, 221, true);
    ViewInfo.addBasicBlock(Block.SecretEntry+6, 222, true);
    ViewInfo.addBasicBlock(Block.SecretEntry+7, 223, true);
}

