'use strict';


initializeBlockViewDescriptions();

function initializeBlockViewDescriptions() {

    WorldInfo.addBasicBlock(Block.UnknownBlock,   65);
    WorldInfo.addBasicBlock(Block.Rock,            0);
    WorldInfo.addBasicBlock(Block.Gravel,          1);
    WorldInfo.addBasicBlock(Block.GravelGreen,   201);
    WorldInfo.addBasicBlock(Block.Grit,          126);
    WorldInfo.addBasicBlock(Block.Lava,            2);    
    WorldInfo.addBasicBlock(Block.Stone,           3);    
    WorldInfo.addBasicBlock(Block.Stone_1,         4);    
    WorldInfo.addBasicBlock(Block.Stone_2,         5);    
    WorldInfo.addBasicBlock(Block.Stone_3,         6);    
    WorldInfo.addBasicBlock(Block.Stone_4,         7);    
    WorldInfo.addBasicBlock(Block.Stone_5,         8);    
    WorldInfo.addBasicBlock(Block.Sand,            9);
    WorldInfo.addBasicBlock(Block.Sand_1,         10);
    WorldInfo.addBasicBlock(Block.Sand_2,         11);
    WorldInfo.addBasicBlock(Block.Sand_3,         12);    
    WorldInfo.addBasicBlock(Block.Sand_4,        186);    
    WorldInfo.addBasicBlock(Block.Dirt,           13);    
    WorldInfo.addBasicBlock(Block.Dirt_1,         14);    
    WorldInfo.addBasicBlock(Block.Dirt_2,         15);    
    WorldInfo.addBasicBlock(Block.Dirt_3,         16);        
    WorldInfo.addBasicBlock(Block.Dirt_4,         17);

    WorldInfo.addBasicBlock(Block.Clay_White,     18);    
    WorldInfo.addBasicBlock(Block.Clay_Orange,    19);    
    WorldInfo.addBasicBlock(Block.Clay_Magenta,   20);    
    WorldInfo.addBasicBlock(Block.Clay_LightBlue, 21);    
    WorldInfo.addBasicBlock(Block.Clay_Yellow,    22);    
    WorldInfo.addBasicBlock(Block.Clay_Lime,      23);    
    WorldInfo.addBasicBlock(Block.Clay_Pink,      24);    
    WorldInfo.addBasicBlock(Block.Clay_Gray,      25);        
    WorldInfo.addBasicBlock(Block.Clay_LightGray,190);    
    WorldInfo.addBasicBlock(Block.Clay_Cyan,     191);    
    WorldInfo.addBasicBlock(Block.Clay_Purple,   192);    
    WorldInfo.addBasicBlock(Block.Clay_Blue,     193);    
    WorldInfo.addBasicBlock(Block.Clay_Brown,    194);    
    WorldInfo.addBasicBlock(Block.Clay_Green,    195);    
    WorldInfo.addBasicBlock(Block.Clay_Red,      196);    
    WorldInfo.addBasicBlock(Block.Clay_Black,    197);   

    WorldInfo.addBasicBlock(Block.Water,          26);
    WorldInfo.addBasicBlock(Block.Ice,            27);
    WorldInfo.addBasicBlock(Block.Snow,           28);    
    WorldInfo.addBasicBlock(Block.GrassBlock,     29);
    WorldInfo.addBasicBlock(Block.Leaves,         43);
    WorldInfo.addBasicBlock(Block.Leaves_1,       44);
    WorldInfo.addBasicBlock(Block.Leaves_2,       45);
    WorldInfo.addBasicBlock(Block.Ore,            46);    
    WorldInfo.addBasicBlock(Block.Ore_1,          47);    
    WorldInfo.addBasicBlock(Block.Ore_2,          48);    
    WorldInfo.addBasicBlock(Block.Ore_3,          49);    
    WorldInfo.addBasicBlock(Block.Ore_4,          50);    
    WorldInfo.addBasicBlock(Block.Ore_5,          51);        
    WorldInfo.addBasicBlock(Block.Ore_6,         198);        
    WorldInfo.addBasicBlock(Block.Wall    ,       57);
    WorldInfo.addBasicBlock(Block.Wall_1  ,       58);
    WorldInfo.addBasicBlock(Block.Wall_2  ,       59);
    WorldInfo.addBasicBlock(Block.Wall_3  ,       60);
    WorldInfo.addBasicBlock(Block.Wall_4  ,       61);
    WorldInfo.addBasicBlock(Block.Wall_5  ,       62);    
    WorldInfo.addBasicBlock(Block.Wall_6  ,      138);    
    WorldInfo.addBasicBlock(Block.Wall_7  ,      146);    
    WorldInfo.addBasicBlock(Block.Wall_8  ,      147);    
    WorldInfo.addBasicBlock(Block.Wall_9  ,      148);    
    WorldInfo.addBasicBlock(Block.Wall_10 ,      149);        
    WorldInfo.addBasicBlock(Block.Wall_11 ,      155);        
    WorldInfo.addBasicBlock(Block.Wall_12,       176);
    WorldInfo.addBasicBlock(Block.Wall_13,       177);
    WorldInfo.addBasicBlock(Block.Lamp    ,       63);
    WorldInfo.addBasicBlock(Block.Lamp_On  ,      64);
    WorldInfo.addBasicBlock(Block.Ashlar  ,       67);    
    WorldInfo.addBasicBlock(Block.Ashlar_1,       68);    
    WorldInfo.addBasicBlock(Block.Ashlar_2,       69);    
    WorldInfo.addBasicBlock(Block.Ashlar_3,       70);    
    WorldInfo.addBasicBlock(Block.Ashlar_4,       71);    
    WorldInfo.addBasicBlock(Block.Ashlar_5,       72);    
    WorldInfo.addBasicBlock(Block.Ashlar_6,       73);     
    WorldInfo.addBasicBlock(Block.Carved,         82);    
    WorldInfo.addBasicBlock(Block.Carved_1,       83);    
    WorldInfo.addBasicBlock(Block.Carved_2,       84);    
    WorldInfo.addBasicBlock(Block.Carved_3,       85);    
    WorldInfo.addBasicBlock(Block.Carved_4,      185);    
    WorldInfo.addBasicBlock(Block.Shelf,          88);
    WorldInfo.addBasicBlock(Block.Box,            89);    
    WorldInfo.addBasicBlock(Block.Box_1,          90);    
    WorldInfo.addBasicBlock(Block.Box_2,          91);    
    WorldInfo.addBasicBlock(Block.Box_3,          92);    
    WorldInfo.addBasicBlock(Block.Gem,            93);    
    WorldInfo.addBasicBlock(Block.Gem_1,          94);    
    WorldInfo.addBasicBlock(Block.Gem_2,          95);    
    WorldInfo.addBasicBlock(Block.Gem_3,          96);    
    WorldInfo.addBasicBlock(Block.Gem_4,          97);        
    WorldInfo.addBasicBlock(Block.Gem_5,         200);        
    WorldInfo.addBasicBlock(Block.Sponge,         98);
    WorldInfo.addBasicBlock(Block.Sponge_1,       30);
    WorldInfo.addBasicBlock(Block.Ironblock,     118);
    WorldInfo.addBasicBlock(Block.Goldblock,     119);
    WorldInfo.addBasicBlock(Block.Cage,          139);
    WorldInfo.addBasicBlock(Block.Ghost,         240);
    WorldInfo.addBasicBlock(Block.Ghost_1,       241);
    WorldInfo.addBasicBlock(Block.Disco,         132);
    WorldInfo.addBasicBlock(Block.Mystic_Plant,  130);
    WorldInfo.addBasicBlock(Block.Mystic_Flower, 131);
    WorldInfo.addBasicBlock(Block.Felt_White,    100);
    WorldInfo.addBasicBlock(Block.Felt_Orange,   101);
    WorldInfo.addBasicBlock(Block.Felt_Magenta,  102);
    WorldInfo.addBasicBlock(Block.Felt_LightBlue,103);
    WorldInfo.addBasicBlock(Block.Felt_Yellow,   104);
    WorldInfo.addBasicBlock(Block.Felt_Lime,     105);
    WorldInfo.addBasicBlock(Block.Felt_Pink,     106);
    WorldInfo.addBasicBlock(Block.Felt_Gray,     107);
    WorldInfo.addBasicBlock(Block.Felt_LightGray,108);
    WorldInfo.addBasicBlock(Block.Felt_Cyan,     109);
    WorldInfo.addBasicBlock(Block.Felt_Purple,   110);
    WorldInfo.addBasicBlock(Block.Felt_Blue,     111);
    WorldInfo.addBasicBlock(Block.Felt_Brown,    112);
    WorldInfo.addBasicBlock(Block.Felt_Green,    113);
    WorldInfo.addBasicBlock(Block.Felt_Red,      114);
    WorldInfo.addBasicBlock(Block.Felt_Black,    115);

    WorldInfo.addBasicBlock(Block.Glass_White,   160);
    WorldInfo.addBasicBlock(Block.Glass_Orange,  161);
    WorldInfo.addBasicBlock(Block.Glass_Magenta, 162);
    WorldInfo.addBasicBlock(Block.Glass_LightBlue,163);
    WorldInfo.addBasicBlock(Block.Glass_Yellow,  164);
    WorldInfo.addBasicBlock(Block.Glass_Lime,    165);
    WorldInfo.addBasicBlock(Block.Glass_Pink,    166);
    WorldInfo.addBasicBlock(Block.Glass_Gray,    167);
    WorldInfo.addBasicBlock(Block.Glass_LightGray,168);
    WorldInfo.addBasicBlock(Block.Glass_Cyan,    169);
    WorldInfo.addBasicBlock(Block.Glass_Purple,  170);
    WorldInfo.addBasicBlock(Block.Glass_Blue,    171);
    WorldInfo.addBasicBlock(Block.Glass_Brown,   172);
    WorldInfo.addBasicBlock(Block.Glass_Green,   173);
    WorldInfo.addBasicBlock(Block.Glass_Red,     174);
    WorldInfo.addBasicBlock(Block.Glass_Black,   175);

    WorldInfo.addBasicBlock(Block.Tresor,        187);
    WorldInfo.addBasicBlock(Block.WindowBlock,   189);
    WorldInfo.addBasicBlock(Block.WindowBlock_1, 199);
    
    WorldInfo.addBasicBlock(Block.Portal,        143);
    WorldInfo.addBasicBlock(Block.Tetris,        157);
    WorldInfo.addBasicBlock(Block.LavaPink,      158);
    WorldInfo.addBasicBlock(Block.LavaBrown,     159);
    WorldInfo.addBasicBlock(Block.Camera,        202);
    WorldInfo.addBasicBlock(Block.Internet,      200);

    WorldInfo.addVerticalBlock(Block.Pumpkin,        52, 53);
    WorldInfo.addVerticalBlock(Block.JackOLantern,   54, 53);
    WorldInfo.addVerticalBlock(Block.JackOLantern_On, 99, 53);
    WorldInfo.addVerticalBlock(Block.Melon,          55, 56);
    WorldInfo.addVerticalBlock(Block.Pillar,         74, 75);    
    WorldInfo.addVerticalBlock(Block.Oracle,         76, 77);
    WorldInfo.addVerticalBlock(Block.OracleUsed,     78, 77);
    WorldInfo.addVerticalBlock(Block.Furnace,        80, 81); 
    WorldInfo.addVerticalBlock(Block.Furnace_On,     79, 81);         
    WorldInfo.addVerticalBlock(Block.Drawer,         86, 87);    
    WorldInfo.addVerticalBlock(Block.TableStone,    136, 138, 137);    
    WorldInfo.addVerticalBlock(Block.TableIron,     140, 142, 141);    
    WorldInfo.addVerticalBlock(Block.Box_4,         150, 151);    
    WorldInfo.addVerticalBlock(Block.Box_5,         152, 153);    
    WorldInfo.addVerticalBlock(Block.Hayblock,      116, 117);
    WorldInfo.addVerticalBlock(Block.Radio,         120, 120, 120);
    WorldInfo.addVerticalBlock(Block.Radio_1,       121, 121, 121);
    WorldInfo.addVerticalBlock(Block.Radio_2,       122, 122, 122);
    WorldInfo.addVerticalBlock(Block.Radio_3,       123, 123, 123);
    WorldInfo.addVerticalBlock(Block.Waterlily,      26,  26, 154);
    WorldInfo.addVerticalBlock(Block.Dirt_5,        178,  14, 179);
    WorldInfo.addVerticalBlock(Block.Caldron,       180, 181, 182); 
    WorldInfo.addVerticalBlock(Block.Caldron_On,    183, 181, 184);
    WorldInfo.addVerticalBlock(Block.Music,         124, 125);         
    
    WorldInfo.addToppleableLog(Block.Log_1, 31, 32);
    WorldInfo.addToppleableLog(Block.Log_2, 33, 34);
    WorldInfo.addToppleableLog(Block.Log_3, 35, 36);
    WorldInfo.addToppleableLog(Block.Log_4, 37, 38);
    WorldInfo.addToppleableLog(Block.Log_5, 39, 40);
    WorldInfo.addToppleableLog(Block.Log_6, 41, 42);
    
    WorldInfo.addDoor(Block.Door1,    0, 5, 0);
    WorldInfo.addDoor(Block.Door2,    1, 5, 0);
    WorldInfo.addDoor(Block.Door3,    2, 5, 2);
    WorldInfo.addDoor(Block.Door4,    3, 5, 3);
    WorldInfo.addDoor(Block.Door5,    4, 5, 1);

    WorldInfo.addCross(Block.Grass,      15, 0.45, 0.85, true);        
    WorldInfo.addCross(Block.Fern,       51, 0.45, 0.65, true);        
    WorldInfo.addCross(Block.DryBush,    28, 0.3,  0.5,  true);
    WorldInfo.addCross(Block.Mushroom_1, 21, 0.38, 0.4,  true);
    WorldInfo.addCross(Block.Mushroom_2, 22, 0.2,  0.45, true);
    WorldInfo.addCross(Block.Wheat,      23, 0.5,  0.85, true);
    WorldInfo.addCross(Block.Grain,      24, 0.5,  1,    true);
    WorldInfo.addCross(Block.Sapling,    25, 0.35, 1,    true);    
    WorldInfo.addCross(Block.Flower,     29, 0.35, 0.65, true);        
    WorldInfo.addCross(Block.Flower_1,   74, 0.45, 0.9,  true);        
    WorldInfo.addCross(Block.Flower_2,   75, 0.25, 0.6,  true);        
    WorldInfo.addCross(Block.Flower_3,   76, 0.2,  0.65, true);     
    WorldInfo.addCross(Block.Flower_4,   77, 0.2,  0.6,  true);        
    WorldInfo.addCross(Block.Flower_5,   78, 0.25, 0.88, true);        
    WorldInfo.addCross(Block.Flower_6,   79, 0.35, 1,    true);        
    WorldInfo.addCross(Block.Flower_7,   20, 0.5,  1,    true);        
    WorldInfo.addCross(Block.Fire,       57, 0.5,  1,    true);
    WorldInfo.addCross(Block.DryFlower, 167, 0.4, 0.7,   true);
    WorldInfo.addCross(Block.TorchFloor, 58, 0.2,  0.85);
    WorldInfo.addCross(Block.TorchFloor_Off,   59, 0.2,  0.85);
    WorldInfo.addCross(Block.TorchFloor1,      52, 0.2,  0.85);
    WorldInfo.addCross(Block.TorchFloor1_Off,  53, 0.2,  0.85);
    WorldInfo.addCross(Block.AlchemyLab,168, 0.5,  0.9);
    WorldInfo.addCross(Block.RoseBush,  6, 0.5,  2, true);
    WorldInfo.addCross(Block.Sunflower, 7, 0.4,  2, true, true);
    WorldInfo.addCross(Block.GrassBush, 8, 0.5,  2, true);
    WorldInfo.addCross(Block.Lilac,     9, 0.5,  2, true, true);
    WorldInfo.addCross(Block.Beet,    177, 0.5,  0.4, true, true);
    WorldInfo.addCross(Block.BeetBig, 176, 0.5,  1, true, true);

    WorldInfo.addDiagonalCross(Block.Reeds,  149, 0.4, 1);

    WorldInfo.addParallelPlanes(Block.Carrots,  26, 0.55, true);
    WorldInfo.addParallelPlanes(Block.Potatoes, 27, 0.4,  true);        

    WorldInfo.addTable(Block.Table, 43, 44, 44);        
    WorldInfo.addTurnableChair(Block.Chair, 45, 46, 47, 44);        
    
    WorldInfo.addFlippablePlane(Block.Window, 49, 49);
    WorldInfo.addFlippablePlane(Block.Window1, 73, 73);         
    WorldInfo.addFence(Block.Bars, 48, 0.01);        
    WorldInfo.addFence(Block.Fence, 150, 0.1); 
    WorldInfo.addFenceSpecial(Block.Fence_Special, 150, 0.1); 
    WorldInfo.addFence(Block.FenceWhite, 202, 0.1);        
    WorldInfo.addFenceSpecial(Block.FenceWhite_Special, 202, 0.1);        
    WorldInfo.addFence(Block.FenceSolid, 50, 0.01);        
                      
    WorldInfo.addFence(Block.Panel, 161, 0.01);
    WorldInfo.addGlass(Block.Glass, 34, 0.01);

    WorldInfo.addWallTorch(Block.TorchWall, 58, 54);
    WorldInfo.addWallTorch(Block.TorchWall_Off, 59, 55);

    WorldInfo.addBlock(Block.ArrowVertical+0, 127, 127, 127, 127, 128, 128, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowVertical+1, 127, 127, 127, 127, 129, 129, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn90, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowVertical+2, 127, 127, 127, 127, 128, 128, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn90, Orientation.Turn270);                
    WorldInfo.addBlock(Block.ArrowVertical+3, 127, 127, 127, 127, 129, 129, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn180, Orientation.Turn270);                
    WorldInfo.addBlock(Block.ArrowVertical+4, 127, 127, 127, 127, 128, 128, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn180, Orientation.Turn180);                
    WorldInfo.addBlock(Block.ArrowVertical+5, 127, 127, 127, 127, 129, 129, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn270, Orientation.Turn180);                
    WorldInfo.addBlock(Block.ArrowVertical+6, 127, 127, 127, 127, 128, 128, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn270, Orientation.Turn90);                
    WorldInfo.addBlock(Block.ArrowVertical+7, 127, 127, 127, 127, 129, 129, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn90);                
        
    WorldInfo.addBlock(Block.ArrowLateral+0, 128, 128, 127, 127, 127, 127,  Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowLateral+1, 129, 129, 127, 127, 127, 127,  Orientation.Turn90, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowLateral+2, 128, 128, 127, 127, 127, 127,  Orientation.Turn90, Orientation.Turn270, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowLateral+3, 129, 129, 127, 127, 127, 127,  Orientation.Turn180, Orientation.Turn270, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowLateral+4, 128, 128, 127, 127, 127, 127,  Orientation.Turn180, Orientation.Turn180, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowLateral+5, 129, 129, 127, 127, 127, 127,  Orientation.Turn270, Orientation.Turn180, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowLateral+6, 128, 128, 127, 127, 127, 127,  Orientation.Turn270, Orientation.Turn90, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowLateral+7, 129, 129, 127, 127, 127, 127,  Orientation.Normal, Orientation.Turn90, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
            
    WorldInfo.addBlock(Block.ArrowLongitudinal+0, 127, 127, 128, 128, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowLongitudinal+1, 127, 127, 129, 129, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Turn90, Orientation.Normal, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowLongitudinal+2, 127, 127, 128, 128, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Turn90, Orientation.Turn270, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowLongitudinal+3, 127, 127, 129, 129, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Turn180, Orientation.Turn270, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowLongitudinal+4, 127, 127, 128, 128, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Turn180, Orientation.Turn180, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowLongitudinal+5, 127, 127, 129, 129, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Turn270, Orientation.Turn180, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowLongitudinal+6, 127, 127, 128, 128, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Turn270, Orientation.Turn90, Orientation.Normal, Orientation.Normal);                
    WorldInfo.addBlock(Block.ArrowLongitudinal+7, 127, 127, 129, 129, 127, 127, Orientation.Normal, Orientation.Normal, Orientation.Normal, Orientation.Turn90, Orientation.Normal, Orientation.Normal);                
            
    WorldInfo.addFlippablePlane(Block.Gate, 151, 151);        
    WorldInfo.addFlippableOpenGate(Block.Gate_Open, 151);   
    WorldInfo.addFlippablePlane(Block.GateSolid, 30, 30);        
    WorldInfo.addFlippableOpenGate(Block.GateSolid_Open, 30);   
    WorldInfo.addFlippablePlane(Block.GateWhite, 203, 203);        
    WorldInfo.addFlippableOpenGate(Block.GateWhite_Open, 203);   
            
    WorldInfo.addTurnableSide(Block.TrapDoor1, 31, BlockFaces.Top);
    WorldInfo.addDecoratorForMantel(Block.TrapDoor1_Open, 31);
    
    WorldInfo.addTurnableSide(Block.TrapDoor2, 32, BlockFaces.Top);
    WorldInfo.addDecoratorForMantel(Block.TrapDoor2_Open, 32);
    
    WorldInfo.addTurnableSide(Block.TrapDoor3, 33, BlockFaces.Top);
    WorldInfo.addDecoratorForMantel(Block.TrapDoor3_Open, 33);
        
    WorldInfo.addDecoratorForMantel(Block.Scripture, 60);
    WorldInfo.addDecoratorForMantel(Block.ScriptureUsed, 63);
    
    WorldInfo.addVerticalBlock(Block.RailsBackFront,  135, 135, 133, Orientation.Normal);  
    WorldInfo.addVerticalBlock(Block.RailsLeftRight,  135, 135, 133, Orientation.Turn90);          
    WorldInfo.addVerticalBlock(Block.RailsLeftBack,   135, 135, 134, Orientation.Normal);          
    WorldInfo.addVerticalBlock(Block.RailsBackRight,  135, 135, 134, Orientation.Turn90);          
    WorldInfo.addVerticalBlock(Block.RailsRightFront, 135, 135, 134, Orientation.Turn180);          
    WorldInfo.addVerticalBlock(Block.RailsFrontLeft,  135, 135, 134, Orientation.Turn270);  
    WorldInfo.addBasicBlock(Block.RailGrit, 135);          

    
    WorldInfo.addTurnableBlock(Block.RailSwitch, 135, 135, 135, 135, 135, 144);  
    WorldInfo.addTurnableBlock(Block.RailSwitch_Switched, 135, 135, 135, 135, 135, 145); 
    WorldInfo.addTurnableBlock(Block.Stove, 203, 204, 204, 204, 204, 205);
    
    WorldInfo.addTurnableWedge(Block.RailsUp, 64, 65, 67, 67);          
    WorldInfo.addTurnableHighWedge(Block.RailsUpHigh, 64, 66, 67, 67, 67);          

    WorldInfo.addRotatableWeb(Block.SpyderWeb, 68);          
    WorldInfo.addPath(Block.Path, 201,200, 201);          
            
    WorldInfo.addDecorator(Block.Book, 69, BlockFaces.Bottom);         

    WorldInfo.addTurnablePlane(Block.Sign, 70, 71);

    WorldInfo.addDecoratorForMantel(Block.Ladder, 56);        
    WorldInfo.addDecoratorForMantel(Block.Painting, 61);
    WorldInfo.addDecoratorForMantel(Block.SignWall, 72);

    WorldInfo.addDecoratorForAllSides(Block.Fur, 62);

    WorldInfo.addDecoratorForAllSides(Block.LetterA, 80);
    WorldInfo.addDecoratorForAllSides(Block.LetterB, 81);
    WorldInfo.addDecoratorForAllSides(Block.LetterC, 82);
    WorldInfo.addDecoratorForAllSides(Block.LetterD, 83);
    WorldInfo.addDecoratorForAllSides(Block.LetterE, 84);
    WorldInfo.addDecoratorForAllSides(Block.LetterF, 85);
    WorldInfo.addDecoratorForAllSides(Block.LetterG, 86);
    WorldInfo.addDecoratorForAllSides(Block.LetterH, 87);
    WorldInfo.addDecoratorForAllSides(Block.LetterI, 88);
    WorldInfo.addDecoratorForAllSides(Block.LetterJ, 89);
    WorldInfo.addDecoratorForAllSides(Block.LetterK, 90);
    WorldInfo.addDecoratorForAllSides(Block.LetterL, 91);
    WorldInfo.addDecoratorForAllSides(Block.LetterM, 92);
    WorldInfo.addDecoratorForAllSides(Block.LetterN, 93);
    WorldInfo.addDecoratorForAllSides(Block.LetterO, 94);
    WorldInfo.addDecoratorForAllSides(Block.LetterP, 95);
    WorldInfo.addDecoratorForAllSides(Block.LetterQ, 96);
    WorldInfo.addDecoratorForAllSides(Block.LetterR, 97);
    WorldInfo.addDecoratorForAllSides(Block.LetterS, 98);
    WorldInfo.addDecoratorForAllSides(Block.LetterT, 99);
    WorldInfo.addDecoratorForAllSides(Block.LetterU, 100);
    WorldInfo.addDecoratorForAllSides(Block.LetterV, 101);
    WorldInfo.addDecoratorForAllSides(Block.LetterW, 102);
    WorldInfo.addDecoratorForAllSides(Block.LetterX, 103);
    WorldInfo.addDecoratorForAllSides(Block.LetterY, 104);
    WorldInfo.addDecoratorForAllSides(Block.LetterZ, 105);

    WorldInfo.addDecoratorForAllSides(Block.LetterEqual, 106);
    WorldInfo.addDecoratorForAllSides(Block.LetterMinus, 107);
    WorldInfo.addDecoratorForAllSides(Block.LetterPlus, 108);
    WorldInfo.addDecoratorForAllSides(Block.LetterSlash, 109);
    WorldInfo.addDecoratorForAllSides(Block.Letter1, 110);
    WorldInfo.addDecoratorForAllSides(Block.Letter2, 111);
    WorldInfo.addDecoratorForAllSides(Block.Letter3, 112);
    WorldInfo.addDecoratorForAllSides(Block.Letter4, 113);
    WorldInfo.addDecoratorForAllSides(Block.Letter5, 114);
    WorldInfo.addDecoratorForAllSides(Block.Letter6, 115);
    WorldInfo.addDecoratorForAllSides(Block.Letter7, 116);
    WorldInfo.addDecoratorForAllSides(Block.Letter8, 117);
    WorldInfo.addDecoratorForAllSides(Block.Letter9, 118);
    WorldInfo.addDecoratorForAllSides(Block.Letter0, 119);

    WorldInfo.addDecoratorForAllSides(Block.SnowCover,     144);
    WorldInfo.addDecoratorForAllSides(Block.StoneCover,    145);
    WorldInfo.addDecoratorForAllSides(Block.WoodCover,     146);
    WorldInfo.addDecoratorForAllSides(Block.IronCover,     147);
    WorldInfo.addDecoratorForAllSides(Block.SandCover,     148);
    WorldInfo.addDecoratorForAllSides(Block.ObsidianCover, 169);

    WorldInfo.addStair(Block.StairWood, 123, 122);
    WorldInfo.addStair(Block.StairCobblestone, 127, 126);
    WorldInfo.addStair(Block.StairBrick, 125, 124);
    WorldInfo.addStair(Block.StairBrickStone, 129, 128);
    WorldInfo.addStair(Block.StairBrickRed, 131, 130);
    WorldInfo.addStair(Block.StairSandstone, 133, 132);
    WorldInfo.addStair(Block.StairMarmor, 121, 120);
    WorldInfo.addStair(Block.StairWoodDark, 135, 134);
    WorldInfo.addStair(Block.StairWoodRed, 137, 136);
    WorldInfo.addStair(Block.StairSandRed, 139, 138);
    WorldInfo.addStair(Block.StairPurpur, 141, 140);
    WorldInfo.addStair(Block.StairTile, 143, 142);
    WorldInfo.addStair(Block.StairWoodLight, 171, 170);

    WorldInfo.addTurnableHalfBlock(Block.Bed_Feet, 35, 36, 38, 36, 39, 37);
    WorldInfo.addTurnableHalfBlock(Block.Bed_Head, 38, 41, 40, 41, 39, 42);

    WorldInfo.addInsetBlock(Block.Cactus, 152, 154, 153, 0.065, 0, 0);
    WorldInfo.addInsetBlock(Block.Cake,   155, 157, 156, 0.13,  0, 0.5);    

    WorldInfo.addLowerHalfBlock(Block.SlabStone, 162);
    WorldInfo.addUpperHalfBlock(Block.SlabStone_Up, 162);
    WorldInfo.addLowerHalfBlock(Block.SlabSandstone, 133);
    WorldInfo.addUpperHalfBlock(Block.SlabSandstone_Up, 133);
    WorldInfo.addLowerHalfBlock(Block.SlabCobblestone, 127);
    WorldInfo.addUpperHalfBlock(Block.SlabCobblestone_Up, 127);
    WorldInfo.addLowerHalfBlock(Block.SlabBrick, 125);
    WorldInfo.addUpperHalfBlock(Block.SlabBrick_Up, 125);

    WorldInfo.addLowerHalfBlock(Block.SlabMarmor, 121);
    WorldInfo.addUpperHalfBlock(Block.SlabMarmor_Up, 121);
    WorldInfo.addLowerHalfBlock(Block.SlabWood, 123);
    WorldInfo.addUpperHalfBlock(Block.SlabWood_Up, 123);
    WorldInfo.addLowerHalfBlock(Block.SlabWoodRed, 137);
    WorldInfo.addUpperHalfBlock(Block.SlabWoodRed_Up, 137);
    WorldInfo.addLowerHalfBlock(Block.SlabWoodDark, 135);
    WorldInfo.addUpperHalfBlock(Block.SlabWoodDark_Up, 135);

    WorldInfo.addLowerHalfBlock(Block.SlabWoodLight, 171);
    WorldInfo.addUpperHalfBlock(Block.SlabWoodLight_Up, 171);
    WorldInfo.addLowerHalfBlock(Block.SlabPurpur, 141);
    WorldInfo.addUpperHalfBlock(Block.SlabPurpur_Up, 141);

    WorldInfo.addCenterPlane(Block.Beanstalk, 165, true);
    WorldInfo.addGrapevine(Block.Grapevine, 166, true);
    WorldInfo.addSidePlane(Block.Cocoa, 172);
    WorldInfo.addSmallBlock(Block.FlowerPot, 173, 173, 174, 0.4, 1, BlockFaces.Bottom);    
    WorldInfo.addSmallBlock(Block.GlassBlock, 34, 34, 34, 1, 1, BlockFaces.Bottom);    
    
    WorldInfo.addLeverMantel(Block.Lever_Mantel , 163, 164);
    WorldInfo.addLeverBase(Block.Lever_Base, 163, 164);

    
    WorldInfo.addSmallBlock(Block.ButtonLED_Mantel+0, 160, 160, 158, 0.4, 0.2, BlockFaces.Left);
    WorldInfo.addSmallBlock(Block.ButtonLED_Mantel+1, 160, 160, 159, 0.4, 0.2, BlockFaces.Left);
    WorldInfo.addSmallBlock(Block.ButtonLED_Mantel+2, 160, 160, 158, 0.4, 0.2, BlockFaces.Back);
    WorldInfo.addSmallBlock(Block.ButtonLED_Mantel+3, 160, 160, 159, 0.4, 0.2, BlockFaces.Back);
    WorldInfo.addSmallBlock(Block.ButtonLED_Mantel+4, 160, 160, 158, 0.4, 0.2, BlockFaces.Right);
    WorldInfo.addSmallBlock(Block.ButtonLED_Mantel+5, 160, 160, 159, 0.4, 0.2, BlockFaces.Right);
    WorldInfo.addSmallBlock(Block.ButtonLED_Mantel+6, 160, 160, 158, 0.4, 0.2, BlockFaces.Front);
    WorldInfo.addSmallBlock(Block.ButtonLED_Mantel+7, 160, 160, 159, 0.4, 0.2, BlockFaces.Front);
    WorldInfo.addSmallBlock(Block.ButtonLED_Base+0,   160, 160, 158, 0.4, 0.2, BlockFaces.Bottom);
    WorldInfo.addSmallBlock(Block.ButtonLED_Base+1,   160, 160, 159, 0.4, 0.2, BlockFaces.Bottom);
    WorldInfo.addSmallBlock(Block.ButtonLED_Base+2,   160, 160, 158, 0.4, 0.2, BlockFaces.Top);
    WorldInfo.addSmallBlock(Block.ButtonLED_Base+3,   160, 160, 159, 0.4, 0.2, BlockFaces.Top);

    WorldInfo.addSmallBlock(Block.ButtonStone_Mantel+0, 121, 121, 121, 0.25, 0.15, BlockFaces.Left);
    WorldInfo.addSmallBlock(Block.ButtonStone_Mantel+1, 121, 121, 121, 0.25, 0.1, BlockFaces.Left);
    WorldInfo.addSmallBlock(Block.ButtonStone_Mantel+2, 121, 121, 121, 0.25, 0.15, BlockFaces.Back);
    WorldInfo.addSmallBlock(Block.ButtonStone_Mantel+3, 121, 121, 121, 0.25, 0.1, BlockFaces.Back);
    WorldInfo.addSmallBlock(Block.ButtonStone_Mantel+4, 121, 121, 121, 0.25, 0.15, BlockFaces.Right);
    WorldInfo.addSmallBlock(Block.ButtonStone_Mantel+5, 121, 121, 121, 0.25, 0.1, BlockFaces.Right);
    WorldInfo.addSmallBlock(Block.ButtonStone_Mantel+6, 121, 121, 121, 0.25, 0.15, BlockFaces.Front);
    WorldInfo.addSmallBlock(Block.ButtonStone_Mantel+7, 121, 121, 121, 0.25, 0.1, BlockFaces.Front);
    WorldInfo.addSmallBlock(Block.ButtonStone_Base+0,   121, 121, 121, 0.25, 0.15, BlockFaces.Bottom);
    WorldInfo.addSmallBlock(Block.ButtonStone_Base+1,   121, 121, 121, 0.25, 0.1, BlockFaces.Bottom);
    WorldInfo.addSmallBlock(Block.ButtonStone_Base+2,   121, 121, 121, 0.25, 0.15, BlockFaces.Top);
    WorldInfo.addSmallBlock(Block.ButtonStone_Base+3,   121, 121, 121, 0.25, 0.1, BlockFaces.Top);

    WorldInfo.addSmallBlock(Block.ButtonWood_Mantel+0, 135, 135, 135, 0.25, 0.15, BlockFaces.Left);
    WorldInfo.addSmallBlock(Block.ButtonWood_Mantel+1, 135, 135, 135, 0.25, 0.1, BlockFaces.Left);
    WorldInfo.addSmallBlock(Block.ButtonWood_Mantel+2, 135, 135, 135, 0.25, 0.15, BlockFaces.Back);
    WorldInfo.addSmallBlock(Block.ButtonWood_Mantel+3, 135, 135, 135, 0.25, 0.1, BlockFaces.Back);
    WorldInfo.addSmallBlock(Block.ButtonWood_Mantel+4, 135, 135, 135, 0.25, 0.15, BlockFaces.Right);
    WorldInfo.addSmallBlock(Block.ButtonWood_Mantel+5, 135, 135, 135, 0.25, 0.1, BlockFaces.Right);
    WorldInfo.addSmallBlock(Block.ButtonWood_Mantel+6, 135, 135, 135, 0.25, 0.15, BlockFaces.Front);
    WorldInfo.addSmallBlock(Block.ButtonWood_Mantel+7, 135, 135, 135, 0.25, 0.1, BlockFaces.Front);
    WorldInfo.addSmallBlock(Block.ButtonWood_Base+0,   135, 135, 135, 0.25, 0.15, BlockFaces.Bottom);
    WorldInfo.addSmallBlock(Block.ButtonWood_Base+1,   135, 135, 135, 0.25, 0.1, BlockFaces.Bottom);
    WorldInfo.addSmallBlock(Block.ButtonWood_Base+2,   135, 135, 135, 0.25, 0.15, BlockFaces.Top);
    WorldInfo.addSmallBlock(Block.ButtonWood_Base+3,   135, 135, 135, 0.25, 0.1, BlockFaces.Top);

    WorldInfo.addSmallBlock(Block.Pole+0, 161, 161, 161, 0.2, 1, BlockFaces.Left);
    WorldInfo.addSmallBlock(Block.Pole+1, 161, 161, 161, 0.2, 1, BlockFaces.Back);
    WorldInfo.addSmallBlock(Block.Pole+2, 161, 161, 161, 0.2, 1, BlockFaces.Right);
    WorldInfo.addSmallBlock(Block.Pole+3, 161, 161, 161, 0.2, 1, BlockFaces.Front);
    WorldInfo.addSmallBlock(Block.Pole+4, 161, 161, 161, 0.2, 1, BlockFaces.Bottom);
    WorldInfo.addSmallBlock(Block.Pole+5, 161, 161, 161, 0.2, 1, BlockFaces.Top);

    WorldInfo.addSmallBlock(Block.PoleLong+0, 161, 161, 161, 0.2, 4, BlockFaces.Left);
    WorldInfo.addSmallBlock(Block.PoleLong+1, 161, 161, 161, 0.2, 4, BlockFaces.Back);
    WorldInfo.addSmallBlock(Block.PoleLong+2, 161, 161, 161, 0.2, 4, BlockFaces.Right);
    WorldInfo.addSmallBlock(Block.PoleLong+3, 161, 161, 161, 0.2, 4, BlockFaces.Front);
    WorldInfo.addSmallBlock(Block.PoleLong+4, 161, 161, 161, 0.2, 4, BlockFaces.Bottom);
    WorldInfo.addSmallBlock(Block.PoleLong+5, 161, 161, 161, 0.2, 4, BlockFaces.Top);

    WorldInfo.addPyramide(Block.Pyramid, 175);
    WorldInfo.addBanner(Block.Banner1, 180, 181, 0.35, 1.8);
    WorldInfo.addBanner(Block.Banner2, 182, 183, 0.35, 1.8);
    WorldInfo.addBanner(Block.Banner3, 184, 185, 0.35, 1.8);
    WorldInfo.addBanner(Block.Banner4, 186, 187, 0.35, 1.8);
    WorldInfo.addBanner(Block.Banner5, 188, 189, 0.35, 1.8);

    WorldInfo.addBanner(Block.Horse, 204, 204, 1, 2);

    WorldInfo.addBasicBlock(Block.SecretEntry+0, 210, true);
    WorldInfo.addBasicBlock(Block.SecretEntry+1, 211, true);
    WorldInfo.addBasicBlock(Block.SecretEntry+2, 212, true);
    WorldInfo.addBasicBlock(Block.SecretEntry+3, 213, true);
    WorldInfo.addBasicBlock(Block.SecretEntry+4, 220, true);
    WorldInfo.addBasicBlock(Block.SecretEntry+5, 221, true);
    WorldInfo.addBasicBlock(Block.SecretEntry+6, 222, true);
    WorldInfo.addBasicBlock(Block.SecretEntry+7, 223, true);
}

