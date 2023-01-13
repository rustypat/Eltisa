namespace Eltisa.Source.Import; 

using System;
using Eltisa.Source.Models;
using static System.Diagnostics.Debug;
using static Eltisa.Source.Models.Block;


/// <summary>
/// A mapper, that maps Mindcraft blocks to Eltisa blocks
/// </summary>
public static class McMapper {

    public static ushort ToEltisaBlock(int mcType, byte mcState) {
        Assert(mcType >= 0 && mcType < 256);
        Assert(mcState >= 0 && mcState < 16);

        if( mcType < 16 ) {
            if( mcType==0 ) return NoBlock;   // Air

            if( mcType==1 ) {
                switch(mcState) {
                    case 0: return Stone;
                    case 1: return Stone_1;
                    case 2: return Ashlar_1;
                    case 3: return Stone_2;
                    case 4: return Ashlar_2;
                    case 5: return Stone_3;
                    case 6: return Ashlar_3;
                    default: return Stone;
                } 
            }
            if( mcType==2 ) return GrassBlock;
            if( mcType==3 ) {
                switch(mcState) {
                    case 0: return Dirt;
                    case 1: return Dirt_1;
                    case 2: return Dirt_2;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                } 
            }
            if( mcType==4 ) {    // cobblestone
                switch(mcState) {
                    case 0: return Wall_2;
                    case 1: return Wall_3;
                    default: return Wall_2;
                }
            } 
            if( mcType==5 ) {    // planks
                switch(mcState) {
                    case 0: return Box;
                    case 2: return Box_2;
                    case 3: return Box_3;
                    case 4: return Box_1;
                    default: return Box;
                } 
            }
            if( mcType==6 ) return Sapling;   
            if( mcType==7 ) return Rock;   
            if( mcType==8 ) return Water;   
            if( mcType==9 ) return Water;  
            if( mcType==10 ) return Lava; 
            if( mcType==11 ) return Lava; 
            if( mcType==12 ) return Sand; 
            if( mcType==13 ) return Grit; 
            if( mcType==14 ) return Ore; 
            if( mcType==15 ) return Ore_1; 
        }
        else if( mcType < 32 ) {
            if( mcType==16 ) return Ore_2; 
            if( mcType==17 ) {    // wood 
                switch(mcState) {
                    case 0: return Log_5+1; 
                    case 1: return Log_6+1;
                    case 2: return Log_3+1;
                    case 3: return Log_4+1;
                    case 4: return Log_5+2; 
                    case 5: return Log_6+2;
                    case 6: return Log_3+2;
                    case 7: return Log_4+2;
                    case 8: return Log_5+3; 
                    case 9: return Log_6+3;
                    case 10: return Log_3+3;
                    case 11: return Log_4+3;
                    case 12: return Log_5+0; 
                    case 13: return Log_6+0;
                    case 14: return Log_3+0;
                    case 15: return Log_4+0;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                } 
            }
            if( mcType==18 ) {    // leaves
                switch(mcState) {
                    case 0: return Leaves;  
                    case 1: return Leaves_2;
                    case 2: return Leaves;
                    case 3: return Leaves_1;
                    case 4: return Leaves;
                    case 5: return Leaves_2;
                    case 6: return Leaves;
                    case 7: return Leaves_1;
                    case 8: return Leaves;
                    case 9: return Leaves_2;
                    case 10: return Leaves;
                    case 11: return Leaves_1;
                    case 12: return Leaves;
                    case 13: return Leaves_2;
                    case 14: return Leaves;
                    case 15: return Leaves_1;
                    default: return Leaves;
                } 
            }
            if( mcType==19 ) return Sponge; 
            if( mcType==20 ) return GlassBlock;
            if( mcType==21 ) return Ore_3;  // lapis ore
            if( mcType==22 ) return Gem;    // lapis block
            if( mcType==23 ) return Oracle;
            if( mcType==24 ) return Sand_1;
            if( mcType==25 ) return Music;
            if( mcType==26 ) {
                if( (mcState & 0b1000) != 0 ) {
                    if( (mcState & 0b0000_0011) == 0 ) return BedHead_Back; 
                    if( (mcState & 0b0000_0011) == 1 ) return BedHead_Left; 
                    if( (mcState & 0b0000_0011) == 2 ) return BedHead_Front; 
                    if( (mcState & 0b0000_0011) == 3 ) return BedHead_Right; 
                } 
                else {
                    if( (mcState & 0b0000_0011) == 0 ) return BedFeet_Front; 
                    if( (mcState & 0b0000_0011) == 1 ) return BedFeet_Right; 
                    if( (mcState & 0b0000_0011) == 2 ) return BedFeet_Back; 
                    if( (mcState & 0b0000_0011) == 3 ) return BedFeet_Left; 
                } 
                throw new Exception("invalid state " + mcState + " for mcType " + mcType);
            }
            if( mcType==27 || mcType==28 ) {
                int orientation = mcState & 0b0111; 
                if( orientation == 0 ) return RailsBackFront; 
                if( orientation == 1 ) return RailsLeftRight; 
                if( orientation == 2 ) return RailsUp_Right; 
                if( orientation == 3 ) return RailsUp_Left; 
                if( orientation == 4 ) return RailsUp_Front; 
                if( orientation == 5 ) return RailsUp_Back; 
            }
            if( mcType==29 ) return TableStone;
            if( mcType==30 ) return SpyderWeb_Left;
            if( mcType==31 ) {
                switch(mcState) {
                    case 0: return DryBush;
                    case 1: return Grass;
                    case 2: return Fern;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                } 
            }
        }
        else if( mcType < 48 ) {
            if( mcType==32 ) return DryBush;   
            if( mcType==33 ) return TableStone;        // replace piston
            if( mcType==34 ) return NoBlock;           // piston head
            if( mcType==35 ) {
                switch(mcState) {
                    case 0:  return Felt_White;
                    case 1:  return Felt_Orange;
                    case 2:  return Felt_Magenta;
                    case 3:  return Felt_LightBlue;
                    case 4:  return Felt_Yellow;
                    case 5:  return Felt_Lime;
                    case 6:  return Felt_Pink;
                    case 7:  return Felt_Gray;
                    case 8:  return Felt_LightGray;
                    case 9:  return Felt_Cyan;
                    case 10:  return Felt_Purple;
                    case 11:  return Felt_Blue;
                    case 12:  return Felt_Brown;
                    case 13:  return Felt_Green;
                    case 14:  return Felt_Red;
                    case 15:  return Felt_Black;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==36 ) return NoBlock;           // block being moved by piston
            if( mcType==37 ) return Flower_2;
            if( mcType==38 )  {
                switch(mcState) {
                    case 0:  return Flower_4;
                    case 1:  return Flower_1;
                    case 2:  return Flower_6;
                    case 3:  return Flower;
                    case 4:  return Flower_5;
                    case 5:  return Flower_5;
                    case 6:  return Flower_5;
                    case 7:  return Flower_5;
                    case 8:  return Flower_3;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==39 ) return Mushroom_1; 
            if( mcType==40 ) return Mushroom_2; 
            if( mcType==41 ) return Goldblock; 
            if( mcType==42 ) return Ironblock; 
            if( mcType==43 ) {
                switch(mcState) {
                    case 0:  return Wall_7;
                    case 1:  return Wall_5;
                    case 2:  return Wall_8;
                    case 3:  return Wall_2;
                    case 4:  return Wall_1;
                    case 5:  return Wall;
                    case 6:  return Ashlar_4;
                    case 7:  return Wall_8;
                    case 8:  return Ashlar;
                    case 9:  return Ashlar_5;
                    case 15:  return Ashlar_4;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==44 ) {               // half block slabs
                switch(mcState) {
                    case 0:  return SlabStone;
                    case 1:  return SlabSandstone;
                    case 2:  return SlabWood;
                    case 3:  return SlabCobblestone;
                    case 4:  return SlabBrick;
                    case 5:  return SlabStone;
                    case 6:  return SlabBrick;
                    case 7:  return SlabMarmor;
                    case 8:  return SlabStone_Up;
                    case 9:  return SlabSandstone_Up;
                    case 10: return SlabWood_Up;
                    case 11: return SlabCobblestone_Up;
                    case 12: return SlabBrick_Up;
                    case 13: return SlabStone_Up;
                    case 14: return SlabBrick_Up;
                    case 15: return SlabMarmor_Up;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==45 ) return Wall_1;
            if( mcType==46 ) return Box_4;   // tnt box
            if( mcType==47 ) return Shelf;
        }
        else if( mcType < 64 ) {
            if( mcType==48 ) return Wall_3;
            if( mcType==49 ) return Stone_4;
            if( mcType==50 ) {
                switch(mcState) {
                    case 1: return TorchWall_Left;
                    case 2: return TorchWall_Right;
                    case 3: return TorchWall_Front;
                    case 4: return TorchWall_Back;
                    case 5: return TorchFloor;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==51 ) return Fire;   
            if( mcType==52 ) return Cage; 
            if( mcType==53 ){
                switch(mcState) {
                    case 0: return StairWood+2;
                    case 1: return StairWood+0;
                    case 2: return StairWood+1;
                    case 3: return StairWood+3;
                    case 4: return StairWood+6;
                    case 5: return StairWood+4;
                    case 6: return StairWood+5;
                    case 7: return StairWood+7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }
            if( mcType==54 ) return Box_5;   // chest
            if( mcType==55 ) return NoBlock; // redstone wire
            if( mcType==56 ) return Ore_4;
            if( mcType==57 ) return Gem_3;
            if( mcType==58 ) return TableIron;
            if( mcType==59 ) return Wheat; 
            if( mcType==60 ) return Dirt_4;
            if( mcType==61 ) return Furnace;
            if( mcType==62 ) return Furnace_On;
            if( mcType==63 ) {
                switch(mcState) {
                    case 0: return Sign_Back;
                    case 1: return Sign_Back;
                    case 2: return Sign_Left;
                    case 3: return Sign_Left;
                    case 4: return Sign_Left;
                    case 5: return Sign_Left;
                    case 6: return Sign_Front;
                    case 7: return Sign_Front;
                    case 8: return Sign_Front;
                    case 9: return Sign_Front;
                    case 10: return Sign_Right;
                    case 11: return Sign_Right;
                    case 12: return Sign_Right;
                    case 13: return Sign_Right;
                    case 14: return Sign_Back;
                    case 15: return Sign_Back;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
        }
        else if( mcType < 80 ) {            
            if( mcType==64 ) {
                if( (mcState & 0b1000) == 0 ) {
                    switch(mcState & 0b0011) {
                        case 0: return Door1+0;
                        case 1: return Door1+1;
                        case 2: return Door1+2;
                        case 3: return Door1+3;
                        default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                    }
                }
                else {
                    switch(mcState & 0b0001) {
                        case 0: return MC_UpperDoor_RightAttached;
                        case 1: return MC_UpperDoor_LeftAttached;
                        default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                    }
                }
            }

            if( mcType==65 ) {
                switch(mcState) {
                    case 2: return Ladder_Back;
                    case 3: return Ladder_Front;
                    case 4: return Ladder_Right;
                    case 5: return Ladder_Left;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==66 ) {
                switch(mcState) {
                    case 0: return RailsBackFront;
                    case 1: return RailsLeftRight;
                    case 2: return RailsUp_Right;
                    case 3: return RailsUp_Left;
                    case 4: return RailsUp_Front;
                    case 5: return RailsUp_Back;
                    case 6: return RailsBackRight;
                    case 7: return RailsLeftBack;
                    case 8: return RailsFrontLeft;
                    case 9: return RailsRightFront;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==67 ){
                switch(mcState) {
                    case 0: return StairCobblestone+2;
                    case 1: return StairCobblestone+0;
                    case 2: return StairCobblestone+1;
                    case 3: return StairCobblestone+3;
                    case 4: return StairCobblestone+6;
                    case 5: return StairCobblestone+4;
                    case 6: return StairCobblestone+5;
                    case 7: return StairCobblestone+7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                
            if( mcType==68 ) {
                switch(mcState) {
                    case 2: return SignWall_Back;
                    case 3: return SignWall_Front;
                    case 4: return SignWall_Right;
                    case 5: return SignWall_Left;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==69 ) {
                switch(mcState) {
                    case 0: return Lever_TopT;
                    case 1: return Lever_Left;
                    case 2: return Lever_Right;
                    case 3: return Lever_Front;
                    case 4: return Lever_Back;
                    case 5: return Lever_Bottom;
                    case 6: return Lever_BottomT;
                    case 7: return Lever_Top;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==70 ) return StoneCover+4;
            if( mcType==71) {
                if( (mcState & 0b1000) == 0 ) {
                    switch(mcState & 0b0011) {
                        case 0: return Door3+0;
                        case 1: return Door3+1;
                        case 2: return Door3+2;
                        case 3: return Door3+3;
                        default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                    }
                }
                else {
                    switch(mcState & 0b0001) {
                        case 0: return MC_UpperDoor_RightAttached;
                        case 1: return MC_UpperDoor_LeftAttached;
                        default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                    }
                }
            }
            if( mcType==72 ) return WoodCover+4;
            
            if( mcType==73 ) return Ore_5;
            if( mcType==74 ) return Ore_5;
            if( mcType==75 ) return TorchFloor1_Off;
            if( mcType==76 ) return TorchFloor1;
            if( mcType==77 ) {
                switch(mcState) {
                    case 0: return ButtonStone_Top;
                    case 1: return ButtonStone_Left;
                    case 2: return ButtonStone_Right;
                    case 3: return ButtonStone_Front;
                    case 4: return ButtonStone_Back;
                    case 5: return ButtonStone_Bottom;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==78 ) return SnowCover+4;
            if( mcType==79 ) return Ice;
        }
        else if( mcType < 96 ) {            
            if( mcType==80 ) return Snow;
            if( mcType==81 ) return Cactus;
            if( mcType==82 ) return Dirt_3;
            if( mcType==83 ) return Reeds;   
            if( mcType==84 ) return Music;   
            if( mcType==85 ) return Fence_BackFront;
            if( mcType==86 ) {
                switch(mcState) {
                    case 16: return Pumpkin;
                    default: return JackOLantern;
                }
            }
            if( mcType==87 ) return LavaPink;
            if( mcType==88 ) return LavaBrown;
            if( mcType==89 ) return Goldblock;
            if( mcType==90 ) return Stone_4;
            if( mcType==91 ) return JackOLantern_On;
            if( mcType==92 ) return Cake;
            if( mcType==93 ) return ButtonLED_Bottom;
            if( mcType==94 ) return ButtonLED_BottomOn;
            if( mcType==95 ) {
                switch(mcState) {
                    case 0:  return Glass_White;
                    case 1:  return Glass_Orange;
                    case 2:  return Glass_Magenta;
                    case 3:  return Glass_LightBlue;
                    case 4:  return Glass_Yellow;
                    case 5:  return Glass_Lime;
                    case 6:  return Glass_Pink;
                    case 7:  return Glass_Gray;
                    case 8:  return Glass_LightGray;
                    case 9:  return Glass_Cyan;
                    case 10:  return Glass_Purple;
                    case 11:  return Glass_Blue;
                    case 12:  return Glass_Brown;
                    case 13:  return Glass_Green;
                    case 14:  return Glass_Red;
                    case 15:  return Glass_Black;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }                
        }
        else if( mcType < 112 ) {  
            if( mcType==96 ) {                    
                if( (mcState & 0b1000) > 0) {
                    if( (mcState & 0b0100) > 0) {
                        switch(mcState & 0b11) {
                            case 0:  return TrapDoor2_BackOpen;
                            case 1:  return TrapDoor2_FrontOpen;
                            case 2:  return TrapDoor2_RightOpen;
                            case 3:  return TrapDoor2_LeftOpen;
                            default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                        }
                    }
                    else {
                        switch(mcState & 0b11) {
                            case 0:  return TrapDoor2_Back;
                            case 1:  return TrapDoor2_Front;
                            case 2:  return TrapDoor2_Right;
                            case 3:  return TrapDoor2_Left;
                            default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                        }
                    }
                }
                else {
                    if( (mcState & 0b0100) > 0) {
                        switch(mcState & 0b11) {
                            case 0:  return MC_TrapDoor2_Lower_BackOpen;
                            case 1:  return MC_TrapDoor2_Lower_FrontOpen;
                            case 2:  return MC_TrapDoor2_Lower_RightOpen;
                            case 3:  return MC_TrapDoor2_Lower_LeftOpen;
                            default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                        }
                    }
                    else {
                        switch(mcState & 0b11) {
                            case 0:  return MC_TrapDoor2_Lower_Back;
                            case 1:  return MC_TrapDoor2_Lower_Front;
                            case 2:  return MC_TrapDoor2_Lower_Right;
                            case 3:  return MC_TrapDoor2_Lower_Left;
                            default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                        }
                    }
                }                    
            }
            if( mcType==97 ) {
                switch(mcState) {
                    case 0:  return Stone;
                    case 1:  return Wall_2;
                    case 2:  return Wall;
                    case 3:  return Wall_4;
                    case 4:  return Wall_12;
                    case 5:  return Wall_13;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==98 ) {
                switch(mcState) {
                    case 0:  return Wall;
                    case 1:  return Wall_4;
                    case 2:  return Wall_12;
                    case 3:  return Wall_13;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==99 ) return Clay_LightBlue;      // mushroom brick brown
            if( mcType==100 ) return Clay_Magenta;       // mushroom brick red
            if( mcType==101 ) return Bars_BackFront;
            if( mcType==102 ) return Glass_BackFront;
            if( mcType==103 ) return Melon;
            if( mcType==104 ) return Beanstalk;
            if( mcType==105 ) return Beanstalk;
            if( mcType==106 ) return Grapevine;
            if( mcType==107 ){
                switch(mcState) {
                    case 0: return Gate_LeftRight;
                    case 1: return Gate_BackFront;
                    case 2: return Gate_LeftRight;
                    case 3: return Gate_BackFront;
                    case 4: return Gate_LeftRightOpen;
                    case 5: return Gate_BackFrontOpen;
                    case 6: return Gate_LeftRightOpen;
                    case 7: return Gate_BackFrontOpen;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                
            if( mcType==108 ){
                switch(mcState) {
                    case 0: return StairBrick+2;
                    case 1: return StairBrick+0;
                    case 2: return StairBrick+1;
                    case 3: return StairBrick+3;
                    case 4: return StairBrick+6;
                    case 5: return StairBrick+4;
                    case 6: return StairBrick+5;
                    case 7: return StairBrick+7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                
            if( mcType==109 ){
                switch(mcState) {
                    case 0: return StairBrickStone+2;
                    case 1: return StairBrickStone+0;
                    case 2: return StairBrickStone+1;
                    case 3: return StairBrickStone+3;
                    case 4: return StairBrickStone+6;
                    case 5: return StairBrickStone+4;
                    case 6: return StairBrickStone+5;
                    case 7: return StairBrickStone+7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                                          
            if( mcType==110 ) return Dirt_5;
            if( mcType==111 ) return Waterlily;
        }

        else if( mcType < 128 ) {            
            if( mcType==112 ) return Wall_8;
            if( mcType==113 ) return Fence_BackFront;
            if( mcType==114 ){
                switch(mcState) {
                    case 0: return StairBrickRed+2;
                    case 1: return StairBrickRed+0;
                    case 2: return StairBrickRed+1;
                    case 3: return StairBrickRed+3;
                    case 4: return StairBrickRed+6;
                    case 5: return StairBrickRed+4;
                    case 6: return StairBrickRed+5;
                    case 7: return StairBrickRed+7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                
            if( mcType==115 ) return DryFlower;
            if( mcType==116 ) return TableIron;
            if( mcType==117 ) return AlchemyLab;
            if( mcType==118 ) return Caldron;
            if( mcType==119 ) return ObsidianCover+7;  // end portal
            if( mcType==120 ) return Carved_4;         // end portal frame
            if( mcType==121 ) return Sand_4;           // end stone
            if( mcType==122 ) return Stone_4;          // dragon egg
            if( mcType==123 ) return Lamp;             
            if( mcType==124 ) return Lamp_On;          
            
            if( mcType==125 ) {
                switch(mcState) {
                    case 0: return Box_2; 
                    case 1: return Box_3;
                    case 2: return Box_2;
                    case 3: return Box_3;
                    case 4: return Box;
                    case 5: return Box_1;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                } 
            }
            if( mcType==126 ) {    
                switch(mcState) {
                    case 0: return SlabWoodLight; 
                    case 1: return SlabWood;
                    case 2: return SlabWoodLight;
                    case 3: return SlabWood;
                    case 4: return SlabWoodRed;
                    case 5: return SlabWoodDark;
                    
                    case 8: return SlabWoodLight_Up;
                    case 9: return SlabWood_Up;
                    case 10: return SlabWoodLight_Up;
                    case 11: return SlabWood_Up;
                    case 12: return SlabWoodRed_Up;
                    case 13: return SlabWoodDark_Up;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                } 
            }
            if( mcType==127 ) {
                switch(mcState) {
                    case 0: return Cocoa_Front; 
                    case 1: return Cocoa_Right;
                    case 2: return Cocoa_Back;
                    case 3: return Cocoa_Left;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                } 
            }
        }
        else if( mcType < 144 ) {    
            if( mcType==128 ){
                switch(mcState) {
                    case 0: return StairSandstone+2;
                    case 1: return StairSandstone+0;
                    case 2: return StairSandstone+1;
                    case 3: return StairSandstone+3;
                    case 4: return StairSandstone+6;
                    case 5: return StairSandstone+4;
                    case 6: return StairSandstone+5;
                    case 7: return StairSandstone+7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                                        
            if( mcType==129 ) return Ore_5;
            if( mcType==130 ) return Box_5;
            if( mcType==131 ) return NoBlock;  // tripwire hock
            if( mcType==132 ) return NoBlock;  // tripwire
            if( mcType==133 ) return Gem_2;
            if( mcType==134 ){
                switch(mcState) {
                    case 0: return StairWood+2;
                    case 1: return StairWood+0;
                    case 2: return StairWood+1;
                    case 3: return StairWood+3;
                    case 4: return StairWood+6;
                    case 5: return StairWood+4;
                    case 6: return StairWood+5;
                    case 7: return StairWood+7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                                                        
            if( mcType==135 ){
                switch(mcState) {
                    case 0: return StairWoodRed+2;
                    case 1: return StairWoodRed+0;
                    case 2: return StairWoodRed+1;
                    case 3: return StairWoodRed+3;
                    case 4: return StairWoodRed+6;
                    case 5: return StairWoodRed+4;
                    case 6: return StairWoodRed+5;
                    case 7: return StairWoodRed+7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                                                        
            if( mcType==136 ){
                switch(mcState) {
                    case 0: return StairWood+2;
                    case 1: return StairWood+0;
                    case 2: return StairWood+1;
                    case 3: return StairWood+3;
                    case 4: return StairWood+6;
                    case 5: return StairWood+4;
                    case 6: return StairWood+5;
                    case 7: return StairWood+7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }            
            if( mcType==137 ) return Block.Tresor;  
            if( mcType==138 ) return Block.Portal;  
            if( mcType==139 ) return Wall_2;   // cobblestone wall
            if( mcType==140 ) return FlowerPot;  
            if( mcType==141 ) return Carrots;  
            if( mcType==142 ) return Potatoes;  
            if( mcType==143 ) {
                switch(mcState) {
                    case 0: return ButtonWood_Top;
                    case 1: return ButtonWood_Left;
                    case 2: return ButtonWood_Right;
                    case 3: return ButtonWood_Front;
                    case 4: return ButtonWood_Back;
                    case 5: return ButtonWood_Bottom;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
        }
        else if( mcType < 160 ) {  
            if( mcType==144 ) return Oracle;
            if( mcType==145 ) return Stone_5;
            if( mcType==146 ) return Box_5;
            if( mcType==147 ) return SandCover+4;
            if( mcType==148 ) return IronCover+4;
            if( mcType==149 ) return ButtonLED_Bottom;
            if( mcType==150 ) return ButtonLED_BottomOn;
            if( mcType==151 ) return WindowBlock;                          
            if( mcType==152 ) return Gem_1;
            if( mcType==153 ) return Ore_6;
            if( mcType==154 ) {  // hopper
                switch(mcState) {
                    case 0: return Pyramid_Top;
                    case 1: return Pyramid_Bottom;
                    case 2: return Pyramid_Back;
                    case 3: return Pyramid_Front;
                    case 4: return Pyramid_Right;
                    case 5: return Pyramid_Left;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }
            
            if( mcType==155 ) return Ashlar_4;
            if( mcType==156 ){
                switch(mcState) {
                    case 0: return StairMarmor+2;
                    case 1: return StairMarmor+0;
                    case 2: return StairMarmor+1;
                    case 3: return StairMarmor+3;
                    case 4: return StairMarmor+6;
                    case 5: return StairMarmor+4;
                    case 6: return StairMarmor+5;
                    case 7: return StairMarmor+7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }       
            if( mcType==157 ) {
                int orientation = mcState & 0b0111; 
                if( orientation == 0 ) return RailsBackFront; 
                if( orientation == 1 ) return RailsLeftRight; 
                if( orientation == 2 ) return RailsUp_Right; 
                if( orientation == 3 ) return RailsUp_Left; 
                if( orientation == 4 ) return RailsUp_Front; 
                if( orientation == 5 ) return RailsUp_Back; 
            }
            if( mcType==158 ) return OracleUsed;                                                                 
            if( mcType==159 ) {
                switch(mcState) {
                    case 0:  return Clay_White;
                    case 1:  return Clay_Orange;
                    case 2:  return Clay_Magenta;
                    case 3:  return Clay_LightBlue;
                    case 4:  return Clay_Yellow;
                    case 5:  return Clay_Lime;
                    case 6:  return Clay_Pink;
                    case 7:  return Clay_Gray;
                    case 8:  return Clay_LightGray;
                    case 9:  return Clay_Cyan;
                    case 10:  return Clay_Purple;
                    case 11:  return Clay_Blue;
                    case 12:  return Clay_Brown;
                    case 13:  return Clay_Green;
                    case 14:  return Clay_Red;
                    case 15:  return Clay_Black;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
        }
        else if( mcType < 176 ) {
            if(mcType==160) return Panel_BackFront;
            if(mcType==161) return Leaves;
            if(mcType==162) {
                switch(mcState) {
                    case 0:  return Log_1+1;
                    case 1:  return Log_2+1;
                    case 4:  return Log_1+2;
                    case 5:  return Log_2+2;
                    case 8:  return Log_1+3;
                    case 9:  return Log_2+3;
                    case 12:  return Log_1+0;
                    case 13:  return Log_2+0;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==163 ){
                switch(mcState) {
                    case 0: return StairWoodRed+2;
                    case 1: return StairWoodRed+0;
                    case 2: return StairWoodRed+1;
                    case 3: return StairWoodRed+3;
                    case 4: return StairWoodRed+6;
                    case 5: return StairWoodRed+4;
                    case 6: return StairWoodRed+5;
                    case 7: return StairWoodRed+7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                                                        
            if( mcType==164 ){
                switch(mcState) {
                    case 0: return StairWoodDark+2;
                    case 1: return StairWoodDark+0;
                    case 2: return StairWoodDark+1;
                    case 3: return StairWoodDark+3;
                    case 4: return StairWoodDark+6;
                    case 5: return StairWoodDark+4;
                    case 6: return StairWoodDark+5;
                    case 7: return StairWoodDark+7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }          
            if( mcType==165 ) return Gem_2;     // slime jump block
            if( mcType==166 ) return NoBlock;   // invisible barrier block                      
            if( mcType==167 ) {
                if( (mcState & 0b1000) > 0) {
                    if( (mcState & 0b0100) > 0) {
                        switch(mcState & 0b11) {
                            case 0:  return TrapDoor1_BackOpen;
                            case 1:  return TrapDoor1_FrontOpen;
                            case 2:  return TrapDoor1_RightOpen;
                            case 3:  return TrapDoor1_LeftOpen;
                            default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                        }
                    }
                    else {
                        switch(mcState & 0b11) {
                            case 0:  return TrapDoor1_Back;
                            case 1:  return TrapDoor1_Front;
                            case 2:  return TrapDoor1_Right;
                            case 3:  return TrapDoor1_Left;
                            default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                        }
                    }
                }
                else {
                    if( (mcState & 0b0100) > 0) {
                        switch(mcState & 0b11) {
                            case 0:  return MC_TrapDoor1_Lower_BackOpen;
                            case 1:  return MC_TrapDoor1_Lower_FrontOpen;
                            case 2:  return MC_TrapDoor1_Lower_RightOpen;
                            case 3:  return MC_TrapDoor1_Lower_LeftOpen;
                            default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                        }
                    }
                    else {
                        switch(mcState & 0b11) {
                            case 0:  return MC_TrapDoor1_Lower_Back;
                            case 1:  return MC_TrapDoor1_Lower_Front;
                            case 2:  return MC_TrapDoor1_Lower_Right;
                            case 3:  return MC_TrapDoor1_Lower_Left;
                            default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                        }
                    }
                }                    
            }                                                        
            if( mcType==168 ) return Wall_10;
            if( mcType==169 ) return Gem_5;  // light stone as sea lantern
            if( mcType==170 ) return Hayblock;
            if( mcType==171 ) {              // carpet
                switch(mcState) {
                    case 0:  return Felt_White;
                    case 1:  return Felt_Orange;
                    case 2:  return Felt_Magenta;
                    case 3:  return Felt_LightBlue;
                    case 4:  return Felt_Yellow;
                    case 5:  return Felt_Lime;
                    case 6:  return Felt_Pink;
                    case 7:  return Felt_Gray;
                    case 8:  return Felt_LightGray;
                    case 9:  return Felt_Cyan;
                    case 10: return Felt_Purple;
                    case 11: return Felt_Blue;
                    case 12: return Felt_Brown;
                    case 13: return Felt_Green;
                    case 14: return Felt_Red;
                    case 15: return Felt_Black;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }                
            if( mcType==172 ) {    
                switch(mcState) {
                    case 0:  return Clay_White;
                    case 1:  return Clay_Orange;
                    case 2:  return Clay_Magenta;
                    case 3:  return Clay_LightBlue;
                    case 4:  return Clay_Yellow;
                    case 5:  return Clay_Lime;
                    case 6:  return Clay_Pink;
                    case 7:  return Clay_Gray;
                    case 8:  return Clay_LightGray;
                    case 9:  return Clay_Cyan;
                    case 10: return Clay_Purple;
                    case 11: return Clay_Blue;
                    case 12: return Clay_Brown;
                    case 13: return Clay_Green;
                    case 14: return Clay_Red;
                    case 15: return Clay_Black;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==173 ) return Stone_5;
            if( mcType==174 ) return Ice;      // packed ice
            if( mcType==175 ) {
                if(mcState >= 8) return Block.NoBlock;  
                switch(mcState) {
                    case 0:  return Sunflower;
                    case 1:  return Lilac;
                    case 2:  return GrassBush;
                    case 3:  return Fern;
                    case 4:  return RoseBush;
                    case 5:  return Flower_7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
        }
        else if( mcType < 192 ) {
            if( mcType==176 ) {    
                switch(mcState) {
                    case 0:  return Banner5_Back;
                    case 1:  return Banner5_LeftBack;
                    case 2:  return Banner5_LeftBack;
                    case 3:  return Banner5_LeftBack;
                    case 4:  return Banner5_Left;
                    case 5:  return Banner5_FrontLeft;
                    case 6:  return Banner5_FrontLeft;
                    case 7:  return Banner5_FrontLeft;
                    case 8:  return Banner5_Front;
                    case 9:  return Banner5_RightFront;
                    case 10: return Banner5_RightFront;
                    case 11: return Banner5_RightFront;
                    case 12: return Banner5_Right;
                    case 13: return Banner5_BackRight;
                    case 14: return Banner5_BackRight;
                    case 15: return Banner5_BackRight;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==177 ) return NoBlock;           // wall banners not yet implemented
            if( mcType==178 ) return WindowBlock_1;
            if( mcType==179 ) return Sand_2;
            if( mcType==180 ){
                switch(mcState) {
                    case 0: return StairSandRed+2;
                    case 1: return StairSandRed+0;
                    case 2: return StairSandRed+1;
                    case 3: return StairSandRed+3;
                    case 4: return StairSandRed+6;
                    case 5: return StairSandRed+4;
                    case 6: return StairSandRed+5;
                    case 7: return StairSandRed+7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                       
            if( mcType==181 ) return Sand_3;
            if( mcType==182 ) {               // half block slabs
                switch(mcState) {
                    case 0:  return SlabSandstone;
                    case 8:  return SlabSandstone_Up;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==183 ){
                switch(mcState) {
                    case 0: return Gate_LeftRight;
                    case 1: return Gate_BackFront;
                    case 2: return Gate_LeftRight;
                    case 3: return Gate_BackFront;
                    case 4: return Gate_LeftRightOpen;
                    case 5: return Gate_BackFrontOpen;
                    case 6: return Gate_LeftRightOpen;
                    case 7: return Gate_BackFrontOpen;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                
            if( mcType==184 ){
                switch(mcState) {
                    case 0: return Gate_LeftRight;
                    case 1: return Gate_BackFront;
                    case 2: return Gate_LeftRight;
                    case 3: return Gate_BackFront;
                    case 4: return Gate_LeftRightOpen;
                    case 5: return Gate_BackFrontOpen;
                    case 6: return Gate_LeftRightOpen;
                    case 7: return Gate_BackFrontOpen;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                
            if( mcType==185 ){
                switch(mcState) {
                    case 0: return Gate_LeftRight;
                    case 1: return Gate_BackFront;
                    case 2: return Gate_LeftRight;
                    case 3: return Gate_BackFront;
                    case 4: return Gate_LeftRightOpen;
                    case 5: return Gate_BackFrontOpen;
                    case 6: return Gate_LeftRightOpen;
                    case 7: return Gate_BackFrontOpen;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                
            if( mcType==186 ){
                switch(mcState) {
                    case 0: return Gate_LeftRight;
                    case 1: return Gate_BackFront;
                    case 2: return Gate_LeftRight;
                    case 3: return Gate_BackFront;
                    case 4: return Gate_LeftRightOpen;
                    case 5: return Gate_BackFrontOpen;
                    case 6: return Gate_LeftRightOpen;
                    case 7: return Gate_BackFrontOpen;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                
            if( mcType==187 ){
                switch(mcState) {
                    case 0: return Gate_LeftRight;
                    case 1: return Gate_BackFront;
                    case 2: return Gate_LeftRight;
                    case 3: return Gate_BackFront;
                    case 4: return Gate_LeftRightOpen;
                    case 5: return Gate_BackFrontOpen;
                    case 6: return Gate_LeftRightOpen;
                    case 7: return Gate_BackFrontOpen;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                
                                                             
            if( mcType==188 ) return Fence_BackFront;
            if( mcType==189 ) return Fence_BackFront;
            if( mcType==190 ) return Fence_BackFront;
            if( mcType==191 ) return Fence_BackFront;
        }
        else if( mcType < 208 ) {
            if( mcType==192) return Fence_BackFront;
            if( mcType==193 ) {
                if( (mcState & 0b1000) == 0 ) {
                    switch(mcState & 0b0011) {
                        case 0: return Door1+0;
                        case 1: return Door1+1;
                        case 2: return Door1+2;
                        case 3: return Door1+3;
                        default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                    }
                }
                else {
                    switch(mcState & 0b0001) {
                        case 0: return MC_UpperDoor_RightAttached;
                        case 1: return MC_UpperDoor_LeftAttached;
                        default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                    }
                }
            }
            if( mcType==194 ) {
                if( (mcState & 0b1000) == 0 ) {
                    switch(mcState & 0b0011) {
                        case 0: return Door4+0;
                        case 1: return Door4+1;
                        case 2: return Door4+2;
                        case 3: return Door4+3;
                        default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                    }
                }
                else {
                    switch(mcState & 0b0001) {
                        case 0: return MC_UpperDoor_RightAttached;
                        case 1: return MC_UpperDoor_LeftAttached;
                        default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                    }
                }
            }
            if( mcType==195 ) {
                if( (mcState & 0b1000) == 0 ) {
                    switch(mcState & 0b0011) {
                        case 0: return Door1+0;
                        case 1: return Door1+1;
                        case 2: return Door1+2;
                        case 3: return Door1+3;
                        default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                    }
                }
                else {
                    switch(mcState & 0b0001) {
                        case 0: return MC_UpperDoor_RightAttached;
                        case 1: return MC_UpperDoor_LeftAttached;
                        default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                    }
                }
            }
            if( mcType==196 ) {
                if( (mcState & 0b1000) == 0 ) {
                    switch(mcState & 0b0011) {
                        case 0: return Door5+0;
                        case 1: return Door5+1;
                        case 2: return Door5+2;
                        case 3: return Door5+3;
                        default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                    }
                }
                else {
                    switch(mcState & 0b0001) {
                        case 0: return MC_UpperDoor_RightAttached;
                        case 1: return MC_UpperDoor_LeftAttached;
                        default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                    }
                }
            }
            if( mcType==197 ) {
                if( (mcState & 0b1000) == 0 ) {
                    switch(mcState & 0b0011) {
                        case 0: return Door2+0;
                        case 1: return Door2+1;
                        case 2: return Door2+2;
                        case 3: return Door2+3;
                        default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                    }
                }
                else {
                    switch(mcState & 0b0001) {
                        case 0: return MC_UpperDoor_RightAttached;
                        case 1: return MC_UpperDoor_LeftAttached;
                        default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                    }
                }
            }                
            if( mcType==198 ) {
                switch(mcState) {
                    case 0: return Pole_Top;
                    case 1: return Pole_Bottom;
                    case 2: return Pole_Back;
                    case 3: return Pole_Front;
                    case 4: return Pole_Right;
                    case 5: return Pole_Left;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                
            if( mcType==199 ) return Mystic_Plant;
            if( mcType==200 ) return Mystic_Flower;
            if( mcType==201 ) return Wall_9;
            if( mcType==202 ) return Carved_3;
            if( mcType==203 ){
                switch(mcState) {
                    case 0: return StairPurpur+2;
                    case 1: return StairPurpur+0;
                    case 2: return StairPurpur+1;
                    case 3: return StairPurpur+3;
                    case 4: return StairPurpur+6;
                    case 5: return StairPurpur+4;
                    case 6: return StairPurpur+5;
                    case 7: return StairPurpur+7;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }                    
            }                                                                        
            if( mcType==204 ) return Wall_9;
            if( mcType==205 ) {               // half block slabs
                switch(mcState) {
                    case 0:  return SlabPurpur;
                    case 8:  return SlabPurpur_Up;
                    default: throw new Exception("invalid state " + mcState + " for mcType " + mcType);
                }
            }
            if( mcType==206 ) return Wall_5;
            if( mcType==207 ) return Beet;
        }
        else if( mcType < 224 ) {
            if( mcType==208 ) return Block.Path;
            if( mcType==209 ) return Stone_4;
            if( mcType==210 ) return Tresor;
            if( mcType==211 ) return Tresor;
            if( mcType==212 ) return Ice;
            if( mcType==213 ) return Lava;
            if( mcType==214 ) return Lava;
            if( mcType==215 ) return Wall_8;
            if( mcType==216 ) return Ashlar_4;
            if( mcType==217 ) return Mystic_Flower;
            if( mcType==218 ) return OracleUsed;
            if( mcType==219 ) return Glass_White;      // shulker box
            if( mcType==220 ) return Glass_Orange;
            if( mcType==221 ) return Glass_Magenta;
            if( mcType==222 ) return Glass_LightBlue;                
            if( mcType==223 ) return Glass_Yellow;                
        }
        else if( mcType < 240 ) {
            if( mcType==224 ) return Glass_Lime;
            if( mcType==225 ) return Glass_Pink;
            if( mcType==226 ) return Glass_Gray;                
            if( mcType==227 ) return Glass_LightGray;
            if( mcType==228 ) return Glass_Cyan;
            if( mcType==229 ) return Glass_Purple;
            if( mcType==230 ) return Glass_Blue;                
            if( mcType==231 ) return Glass_Brown;
            if( mcType==232 ) return Glass_Green;
            if( mcType==233 ) return Glass_Red;
            if( mcType==234 ) return Glass_Black;

            if( mcType==235 ) return Glass_White;      // glazed terracotta
            if( mcType==236 ) return Glass_Orange;
            if( mcType==237 ) return Glass_Magenta;
            if( mcType==238 ) return Glass_LightBlue;                
        }
        else if( mcType < 256 ) {
            if( mcType==239 ) return Glass_Yellow;                
            if( mcType==240 ) return Glass_Lime;
            if( mcType==241 ) return Glass_Pink;
            if( mcType==242 ) return Glass_Gray;                
            if( mcType==243 ) return Glass_LightGray;
            if( mcType==244 ) return Glass_Cyan;
            if( mcType==245 ) return Glass_Purple;
            if( mcType==246 ) return Glass_Blue;                
            if( mcType==247 ) return Glass_Brown;
            if( mcType==248 ) return Glass_Green;
            if( mcType==249 ) return Glass_Red;
            if( mcType==250 ) return Glass_Black;
            if( mcType==251 ) return Ashlar;
            if( mcType==252 ) return Ashlar;
            if( mcType==253 ) return NoBlock;
            if( mcType==254 ) return NoBlock;
            if( mcType==255 ) return Mystic_Flower;
        }

        throw new Exception("missing type translation for " + mcType + " : " + mcState);
    }
    
}