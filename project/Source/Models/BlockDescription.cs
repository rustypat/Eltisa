namespace Eltisa.Models;     

using System;



public static class BlockDescription {

    public const int    MaxBlockDefinition       = 8192-1;     // for max 16 categories
    public const int    MaxSolidBlockDefinition  = 4096-1;     // for max 8 solid categories

    // category 0: landscape

    // the first type is reserved for special no block values!
    public const ushort Air                  = 0;
    public const ushort Invalid              = 1;
    public const ushort Unknown              = 7;

    public const ushort Rock                 = 8;
    public const ushort Gravel               = 8+1;
    public const ushort Grit                 = 8+2;
    public const ushort Lava                 = 8+3;        
    public const ushort LavaPink             = 8+4;        
    public const ushort LavaBrown            = 8+5;
    public const ushort GravelGreen          = 8+6;

    public const ushort Stone                = 16;
    public const ushort Stone_1              = 16+1;
    public const ushort Stone_2              = 16+2;
    public const ushort Stone_3              = 16+3;
    public const ushort Stone_4              = 16+4;
    public const ushort Stone_5              = 16+5;

    public const ushort Sand                 = 24;
    public const ushort Sand_1               = 24+1;
    public const ushort Sand_2               = 24+2;
    public const ushort Sand_3               = 24+3;
    public const ushort Sand_4               = 24+4;

    public const ushort Dirt                 = 32;
    public const ushort Dirt_1               = 32+1;
    public const ushort Dirt_2               = 32+2;
    public const ushort Dirt_3               = 32+3;
    public const ushort Dirt_4               = 32+4;        
    public const ushort Dirt_5               = 32+5;        

    public const ushort Clay_White           = 40;        
    public const ushort Clay_Orange          = 40+1;        
    public const ushort Clay_Magenta         = 40+2;        
    public const ushort Clay_LightBlue       = 40+3;        
    public const ushort Clay_Yellow          = 40+4;        
    public const ushort Clay_Lime            = 40+5;        
    public const ushort Clay_Pink            = 40+6;        
    public const ushort Clay_Gray            = 40+7;        

    public const ushort Water                = 48;
    public const ushort Ice                  = 48+1;
    public const ushort Snow                 = 48+2;
    public const ushort Waterlily            = 48+3;
    
    public const ushort GrassBlock           = 56;

    public const ushort Clay_LightGray       = 64+0;  
    public const ushort Clay_Cyan            = 64+1;  
    public const ushort Clay_Purple          = 64+2;  
    public const ushort Clay_Blue            = 64+3;  
    public const ushort Clay_Brown           = 64+4;  
    public const ushort Clay_Green           = 64+5;  
    public const ushort Clay_Red             = 64+6;  
    public const ushort Clay_Black           = 64+7;  

    public const ushort Leaves               = 72;
    public const ushort Leaves_1             = 72+1;
    public const ushort Leaves_2             = 72+2;

    public const ushort Ore                  = 80;
    public const ushort Ore_1                = 80+1;
    public const ushort Ore_2                = 80+2;
    public const ushort Ore_3                = 80+3;
    public const ushort Ore_4                = 80+4;
    public const ushort Ore_5                = 80+5;
    public const ushort Ore_6                = 80+6;

    public const ushort Log_1                = 88;
    public const ushort Log_2                = 96;
    public const ushort Log_3                = 104;
    public const ushort Log_4                = 112;
    public const ushort Log_5                = 120;
    public const ushort Log_6                = 128;

    // category 1: plants and things
    public const ushort JackOLantern         = 512;
    public const ushort JackOLantern_On      = 512+1;
    public const ushort Melon                = 520;
    public const ushort Pumpkin              = 520+1;

    public const ushort Drawer               = 528;
    public const ushort TableStone           = 528+1;
    public const ushort TableIron            = 528+2;
    public const ushort Shelf                = 536;

    public const ushort Box                  = 544;
    public const ushort Box_1                = 544+1;
    public const ushort Box_2                = 544+2;
    public const ushort Box_3                = 544+3;
    public const ushort Box_4                = 544+4;
    public const ushort Box_5                = 544+5;

    public const ushort Gem                  = 552;    // flight stone
    public const ushort Gem_1                = 552+1;
    public const ushort Gem_2                = 552+2;
    public const ushort Gem_3                = 552+3;
    public const ushort Gem_4                = 552+4;
    public const ushort Gem_5                = 552+5;  // light stone

    public const ushort Sponge               = 560;
    public const ushort Sponge_1             = 560+1;
    public const ushort Hayblock             = 560+2;
    public const ushort Ironblock            = 560+3;
    public const ushort Goldblock            = 560+4;
    public const ushort Cage                 = 560+5;

    public const ushort Radio                = 568;

    public const ushort Lamp                 = 576;
    public const ushort Lamp_On              = 576+1;

    public const ushort Felt_White           = 584+0;
    public const ushort Felt_Orange          = 584+1;  
    public const ushort Felt_Magenta         = 584+2;  
    public const ushort Felt_LightBlue       = 584+3;  
    public const ushort Felt_Yellow          = 584+4;  
    public const ushort Felt_Lime            = 584+5;  
    public const ushort Felt_Pink            = 584+6;  
    public const ushort Felt_Gray            = 584+7;  

    public const ushort ArrowVertical        = 592;
    public const ushort ArrowLateral         = 600;
    public const ushort ArrowLongitudinal    = 608;

    public const ushort Disco                = 616;
    public const ushort Ghost                = 624;
    public const ushort Ghost_1              = 624+1;
    public const ushort Mystic_Plant         = 632;
    public const ushort Mystic_Flower        = 632+1;
    public const ushort Stove                = 640;

    public const ushort Felt_LightGray       = 648+0;  
    public const ushort Felt_Cyan            = 648+1;  
    public const ushort Felt_Purple          = 648+2;  
    public const ushort Felt_Blue            = 648+3;  
    public const ushort Felt_Brown           = 648+4;  
    public const ushort Felt_Green           = 648+5;  
    public const ushort Felt_Red             = 648+6;  
    public const ushort Felt_Black           = 648+7;  

    public const ushort RailsLeftRight       = 656;  
    public const ushort RailsBackFront       = 656+1;  
    public const ushort RailsLeftBack        = 656+2;  
    public const ushort RailsBackRight       = 656+3;  
    public const ushort RailsRightFront      = 656+4;        
    public const ushort RailsFrontLeft       = 656+5;
    public const ushort RailGrit             = 656+6;   

    public const ushort RailSwitch_Left       = 664;
    public const ushort RailSwitch_Back       = 664+1;
    public const ushort RailSwitch_Right      = 664+2;
    public const ushort RailSwitch_Front      = 664+3;
    public const ushort RailSwitch_SwitchedLeft      = 664+4;
    public const ushort RailSwitch_SwitchedBack      = 664+5;
    public const ushort RailSwitch_SwitchedRight     = 664+6;
    public const ushort RailSwitch_SwitchedFront     = 664+7;

    public const ushort Portal               = 672;   
    public const ushort Music                = 680;   
    public const ushort Tetris               = 688;   

    public const ushort Glass_White          = 696+0;
    public const ushort Glass_Orange         = 696+1;  
    public const ushort Glass_Magenta        = 696+2;  
    public const ushort Glass_LightBlue      = 696+3;  
    public const ushort Glass_Yellow         = 696+4;  
    public const ushort Glass_Lime           = 696+5;  
    public const ushort Glass_Pink           = 696+6;  
    public const ushort Glass_Gray           = 696+7;  

    public const ushort Glass_LightGray      = 704+0;  
    public const ushort Glass_Cyan           = 704+1;  
    public const ushort Glass_Purple         = 704+2;  
    public const ushort Glass_Blue           = 704+3;  
    public const ushort Glass_Brown          = 704+4;  
    public const ushort Glass_Green          = 704+5;  
    public const ushort Glass_Red            = 704+6;  
    public const ushort Glass_Black          = 704+7;  

    public const ushort Caldron              = 712;
    public const ushort Caldron_On           = 712+1;

    public const ushort Tresor               = 720;

    public const ushort WindowBlock          = 728;
    public const ushort WindowBlock_1        = 728+1;


    // category 2: buildings
    public const ushort Wall                 = 1024;
    public const ushort Wall_1               = 1024+1;
    public const ushort Wall_2               = 1024+2;
    public const ushort Wall_3               = 1024+3;
    public const ushort Wall_4               = 1024+4;
    public const ushort Wall_5               = 1024+5;
    public const ushort Wall_6               = 1024+6;
    public const ushort Wall_7               = 1024+7;
    
    public const ushort Wall_8               = 1032;
    public const ushort Wall_9               = 1032+1;
    public const ushort Wall_10              = 1032+2;
    public const ushort Wall_11              = 1032+3;
    public const ushort Wall_12              = 1032+4;
    public const ushort Wall_13              = 1032+5;

    public const ushort Ashlar               = 1040;
    public const ushort Ashlar_1             = 1040+1;
    public const ushort Ashlar_2             = 1040+2;
    public const ushort Ashlar_3             = 1040+3;
    public const ushort Ashlar_4             = 1040+4;
    public const ushort Ashlar_5             = 1040+5;
    public const ushort Ashlar_6             = 1040+6;

    public const ushort Pillar               = 1048;

    public const ushort Oracle               = 1056;
    public const ushort OracleUsed           = 1056+1;
    public const ushort Carved               = 1064;
    public const ushort Carved_1             = 1064+1;
    public const ushort Carved_2             = 1064+2;
    public const ushort Carved_3             = 1064+3;
    public const ushort Carved_4             = 1064+4;

    public const ushort Furnace              = 1072;
    public const ushort Furnace_On           = 1072+1;


    // category 8,9,10: transparent blocks
    public const ushort Window               = 4096;
    public const ushort Window_1             = 4096+1;

    public const ushort Door1                = 4104;
    public const ushort Door2                = 4112;
    public const ushort Door3                = 4120;
    public const ushort Door4                = 4128;
    public const ushort Door5                = 4136;

    public const ushort FREE3                = 4144;
    public const ushort FREE4                = 4152;
    public const ushort FREE5                = 4160;
    public const ushort FREE6                = 4168;
    public const ushort FREE7                = 4176;

    public const ushort Grass                = 4184;
    public const ushort Fern                 = 4184+1;
    public const ushort DryBush              = 4184+2;
    public const ushort Mushroom_1           = 4184+3;
    public const ushort Mushroom_2           = 4184+4;
    public const ushort Wheat                = 4184+5;
    public const ushort Grain                = 4184+6;
    public const ushort Sapling              = 4184+7;
    
    public const ushort Flower               = 4192;
    public const ushort Flower_1             = 4192+1;
    public const ushort Flower_2             = 4192+2;
    public const ushort Flower_3             = 4192+3;
    public const ushort Flower_4             = 4192+4;
    public const ushort Flower_5             = 4192+5;
    public const ushort Flower_6             = 4192+6;
    public const ushort Flower_7             = 4192+7;

    public const ushort Carrots              = 4200;
    public const ushort Potatoes             = 4200+1;
    public const ushort Reeds                = 4200+2;
    public const ushort Cactus               = 4200+3;
    public const ushort Beanstalk            = 4200+4;
    public const ushort Grapevine            = 4200+5;
    public const ushort DryFlower            = 4200+6;

    public const ushort SpyderWeb_Left       = 4208;     
    public const ushort SpyderWeb_Back       = 4208+1;     
    public const ushort SpyderWeb_Right      = 4208+2;     
    public const ushort SpyderWeb_Front      = 4208+3;     
    public const ushort SpyderWeb_Bottom     = 4208+4;     
    public const ushort SpyderWeb_Up         = 4208+5;         

    public const ushort BedFeet_Left         = 4216;
    public const ushort BedFeet_Back         = 4216+1;
    public const ushort BedFeet_Right        = 4216+2;
    public const ushort BedFeet_Front        = 4216+3;
    
    public const ushort BedHead_Right        = 4224;
    public const ushort BedHead_Front        = 4224+1;
    public const ushort BedHead_Left         = 4224+2;
    public const ushort BedHead_Back         = 4224+3;

    public const ushort Table                = 4232;
    public const ushort Chair                = 4240;

    public const ushort Bars_BackFront       = 4248; 
    public const ushort Bars_LeftRight       = 4248+1;
    public const ushort Bars_LeftBack        = 4248+2;
    public const ushort Bars_BackRight       = 4248+3;
    public const ushort Bars_RightFront      = 4248+4;
    public const ushort Bars_FrontLeft       = 4248+5;
    public const ushort Bars_Cross           = 4248+6;

    public const ushort Fence_BackFront      = 4256; 
    public const ushort Fence_LeftRight      = 4256+1;
    public const ushort Fence_LeftBack       = 4256+2;
    public const ushort Fence_BackRight      = 4256+3;
    public const ushort Fence_RightFront     = 4256+4;
    public const ushort Fence_FrontLeft      = 4256+5;
    public const ushort Fence_Cross          = 4256+6;
    public const ushort Fence_Pole           = 4256+7;

    public const ushort Glass_BackFront      = 4264; 
    public const ushort Glass_LeftRight      = 4264+1;
    public const ushort Glass_LeftBack       = 4264+2;
    public const ushort Glass_BackRight      = 4264+3;
    public const ushort Glass_RightFront     = 4264+4;
    public const ushort Glass_FrontLeft      = 4264+5;
    public const ushort Glass_Cross          = 4264+6;

    public const ushort Ladder_Left          = 4272;
    public const ushort Ladder_Back          = 4272+1;
    public const ushort Ladder_Right         = 4272+2;
    public const ushort Ladder_Front         = 4272+3;
    public const ushort Fire                 = 4280;

    public const ushort TorchFloor           = 4288;
    public const ushort TorchFloor_Off       = 4288+1;
    
    public const ushort TorchWall_Left       = 4296;
    public const ushort TorchWall_Back       = 4296+1;
    public const ushort TorchWall_Right      = 4296+2;
    public const ushort TorchWall_Front      = 4296+3;
    public const ushort TorchWall_LeftOff    = 4296+4;
    public const ushort TorchWall_BackOff    = 4296+5;
    public const ushort TorchWall_RightOff   = 4296+6;
    public const ushort TorchWall_FrontOff   = 4296+7;
    
    public const ushort Gate_BackFront       = 4304;
    public const ushort Gate_LeftRight       = 4304+1;
    public const ushort Gate_BackFrontOpen   = 4304+2;
    public const ushort Gate_LeftRightOpen   = 4304+3;

    public const ushort TrapDoor1_Left       = 4312;
    public const ushort TrapDoor1_Back       = 4312+1;
    public const ushort TrapDoor1_Right      = 4312+2;
    public const ushort TrapDoor1_Front      = 4312+3;
    public const ushort TrapDoor1_LeftOpen   = 4312+4;
    public const ushort TrapDoor1_BackOpen   = 4312+5;
    public const ushort TrapDoor1_RightOpen  = 4312+6;
    public const ushort TrapDoor1_FrontOpen  = 4312+7;

    public const ushort TrapDoor2_Left       = 4320;
    public const ushort TrapDoor2_Back       = 4320+1;
    public const ushort TrapDoor2_Right      = 4320+2;
    public const ushort TrapDoor2_Front      = 4320+3;
    public const ushort TrapDoor2_LeftOpen   = 4320+4;
    public const ushort TrapDoor2_BackOpen   = 4320+5;
    public const ushort TrapDoor2_RightOpen  = 4320+6;
    public const ushort TrapDoor2_FrontOpen  = 4320+7;

    public const ushort TrapDoor3_Left       = 4328;
    public const ushort TrapDoor3_Back       = 4328+1;
    public const ushort TrapDoor3_Right      = 4328+2;
    public const ushort TrapDoor3_Front      = 4328+3;
    public const ushort TrapDoor3_LeftOpen   = 4328+4;
    public const ushort TrapDoor3_BackOpen   = 4328+5;
    public const ushort TrapDoor3_RightOpen  = 4328+6;
    public const ushort TrapDoor3_FrontOpen  = 4328+7;

    public const ushort Painting             = 4336;
    public const ushort Fur                  = 4344;

    public const ushort Scripture_Left       = 4352+0;         // attaches left
    public const ushort Scripture_Back       = 4352+1;         // attaches back
    public const ushort Scripture_Right      = 4352+2;         // attaches right
    public const ushort Scripture_Front      = 4352+3;         // attaches front
    public const ushort ScriptureUsed_Left   = 4352+4;         // attaches left
    public const ushort ScriptureUsed_Back   = 4352+5;         // attaches back
    public const ushort ScriptureUsed_Right  = 4352+6;         // attaches right
    public const ushort ScriptureUsed_Front  = 4352+7;         // attaches front

    public const ushort RailsUp_Left         = 4368;  
    public const ushort RailsUp_Back         = 4368+1;  
    public const ushort RailsUp_Right        = 4368+2;  
    public const ushort RailsUp_Front        = 4368+3;  
    public const ushort RailsUp_HighLeft     = 4368+4;  
    public const ushort RailsUp_HighBack     = 4368+5;  
    public const ushort RailsUp_HighRight    = 4368+6;  
    public const ushort RailsUp_HighFront    = 4368+7;      

    public const ushort Book                 = 4376;

    public const ushort Sign_Left            = 4384;
    public const ushort Sign_Back            = 4384+1;
    public const ushort Sign_Right           = 4384+2;
    public const ushort Sign_Front           = 4384+3;

    public const ushort SignWall_Left        = 4392;
    public const ushort SignWall_Back        = 4392+1;
    public const ushort SignWall_Right       = 4392+2;
    public const ushort SignWall_Front       = 4392+3;

    public const ushort Window1              = 4720;
    public const ushort Window1_1            = 4720+1;
    
    public const ushort TorchFloor1          = 4728;
    public const ushort TorchFloor1_Off      = 4728+1;

    public const ushort StairWood            = 4736;
    public const ushort StairCobblestone     = 4744;
    public const ushort StairBrick           = 4752;
    public const ushort StairBrickStone      = 4760;
    public const ushort StairBrickRed        = 4768;
    public const ushort StairSandstone       = 4776;
    public const ushort StairMarmor          = 4784;
    public const ushort StairWoodDark        = 4792;
    public const ushort StairWoodRed         = 4800;
    public const ushort StairSandRed         = 4808;
    public const ushort StairPurpur          = 4816;
    public const ushort StairTile            = 4824;
    public const ushort StairWoodLight       = 4832;

    public const ushort SnowCover            = 4840;
    public const ushort StoneCover           = 4848;
    public const ushort WoodCover            = 4856;
    public const ushort IronCover            = 4864;
    public const ushort SandCover            = 4872;
    public const ushort ObsidianCover        = 4880;

    public const ushort FenceSolid           = 4888;
    public const ushort GateSolid            = 4896;
    public const ushort GateSolid_1          = 4896+1;
    public const ushort GateSolid_Open       = 4896+2;
    public const ushort GateSolid_1Open      = 4896+3;

    public const ushort Cake                 = 4904;
    public const ushort AlchemyLab           = 4904+1;
    public const ushort FlowerPot            = 4904+2;

    public const ushort RoseBush             = 4912;
    public const ushort Sunflower            = 4912+1;
    public const ushort GrassBush            = 4912+2;
    public const ushort Lilac                = 4912+3;        // Flieder
    public const ushort Beet                 = 4912+4;        // Rüben
    public const ushort BeetBig              = 4912+5;

    public const ushort Panel_BackFront      = 4920; 
    public const ushort Panel_LeftRight      = 4920+1;
    public const ushort Panel_LeftBack       = 4920+2;
    public const ushort Panel_BackRight      = 4920+3;
    public const ushort Panel_RightFront     = 4920+4;
    public const ushort Panel_FrontLeft      = 4920+5;
    public const ushort Panel_Cross          = 4920+6;

    public const ushort SlabStone            = 4928;
    public const ushort SlabStone_Up         = 4928+1;
    public const ushort SlabSandstone        = 4928+2;
    public const ushort SlabSandstone_Up     = 4928+3;
    public const ushort SlabCobblestone      = 4928+4;
    public const ushort SlabCobblestone_Up   = 4928+5;
    public const ushort SlabBrick            = 4928+6;
    public const ushort SlabBrick_Up         = 4928+7;

    public const ushort SlabMarmor           = 4936;
    public const ushort SlabMarmor_Up        = 4936+1;
    public const ushort SlabWood             = 4936+2;
    public const ushort SlabWood_Up          = 4936+3;
    public const ushort SlabWoodRed          = 4936+4;
    public const ushort SlabWoodRed_Up       = 4936+5;
    public const ushort SlabWoodDark         = 4936+6;
    public const ushort SlabWoodDark_Up      = 4936+7;

    public const ushort SlabWoodLight        = 4944;
    public const ushort SlabWoodLight_Up     = 4944+1;
    public const ushort SlabPurpur           = 4944+2;
    public const ushort SlabPurpur_Up        = 4944+3;
    
    
    public const ushort Cocoa_Left           = 4952;
    public const ushort Cocoa_Back           = 4952+1;
    public const ushort Cocoa_Right          = 4952+2;
    public const ushort Cocoa_Front          = 4952+3;

    public const ushort Lever_Left           = 4960;
    public const ushort Lever_LeftOn         = 4960+1;
    public const ushort Lever_Back           = 4960+2;
    public const ushort Lever_BackOn         = 4960+3;
    public const ushort Lever_Right          = 4960+4;
    public const ushort Lever_RightOn        = 4960+5;
    public const ushort Lever_Front          = 4960+6;
    public const ushort Lever_FrontOn        = 4960+7;

    public const ushort Lever_Bottom         = 4968;
    public const ushort Lever_BottomOn       = 4968+1;
    public const ushort Lever_BottomT        = 4968+2;
    public const ushort Lever_BottomTOn      = 4968+3;
    public const ushort Lever_Top            = 4968+4;
    public const ushort Lever_TopOn          = 4968+5;
    public const ushort Lever_TopT           = 4968+6;
    public const ushort Lever_TopTOn         = 4968+7;

    public const ushort ButtonLED_Left       = 4976;
    public const ushort ButtonLED_LeftOn     = 4976+1;
    public const ushort ButtonLED_Back       = 4976+2;
    public const ushort ButtonLED_BackOn     = 4976+3;
    public const ushort ButtonLED_Right      = 4976+4;
    public const ushort ButtonLED_RightOn    = 4976+5;
    public const ushort ButtonLED_Front      = 4976+6;
    public const ushort ButtonLED_FrontOn    = 4976+7;

    public const ushort ButtonLED_Bottom     = 4984;
    public const ushort ButtonLED_BottomOn   = 4984+1;
    public const ushort ButtonLED_Top        = 4984+2;
    public const ushort ButtonLED_TopOn      = 4984+3;

    public const ushort ButtonStone_Left     = 4992;
    public const ushort ButtonStone_LeftOn   = 4992+1;
    public const ushort ButtonStone_Back     = 4992+2;
    public const ushort ButtonStone_BackOn   = 4992+3;
    public const ushort ButtonStone_Right    = 4992+4;
    public const ushort ButtonStone_RightOn  = 4992+5;
    public const ushort ButtonStone_Front    = 4992+6;
    public const ushort ButtonStone_FrontOn  = 4992+7;

    public const ushort ButtonStone_Bottom   = 5000;
    public const ushort ButtonStone_BottomOn = 5000+1;
    public const ushort ButtonStone_Top      = 5000+2;
    public const ushort ButtonStone_TopOn    = 5000+3;

    public const ushort ButtonWood_Left      = 5008;
    public const ushort ButtonWood_LeftOn    = 5008+1;
    public const ushort ButtonWood_Back      = 5008+2;
    public const ushort ButtonWood_BackOn    = 5008+3;
    public const ushort ButtonWood_Right     = 5008+4;
    public const ushort ButtonWood_RightOn   = 5008+5;
    public const ushort ButtonWood_Front     = 5008+6;
    public const ushort ButtonWood_FrontOn   = 5008+7;

    public const ushort ButtonWood_Bottom    = 5016;
    public const ushort ButtonWood_BottomOn  = 5016+1;
    public const ushort ButtonWood_Top       = 5016+2;
    public const ushort ButtonWood_TopOn     = 5016+3;

    public const ushort Pyramid_Left         = 5024;
    public const ushort Pyramid_Back         = 5024+1;
    public const ushort Pyramid_Right        = 5024+2;
    public const ushort Pyramid_Front        = 5024+3;
    public const ushort Pyramid_Bottom       = 5024+4;
    public const ushort Pyramid_Top          = 5024+5;

    public const ushort Banner1              = 5032;          // left, left-back, back, back-right, right, right-front, front, front-left
    public const ushort Banner2              = 5040;
    public const ushort Banner3              = 5048;
    public const ushort Banner4              = 5056;

    public const ushort Banner5_Left         = 5064;        
    public const ushort Banner5_LeftBack     = 5064+1;        
    public const ushort Banner5_Back         = 5064+2;        
    public const ushort Banner5_BackRight    = 5064+3;        
    public const ushort Banner5_Right        = 5064+4;        
    public const ushort Banner5_RightFront   = 5064+5;        
    public const ushort Banner5_Front        = 5064+6;        
    public const ushort Banner5_FrontLeft    = 5064+7;        

    public const ushort Path                 = 5072;

    public const ushort Pole_Left            = 5080+0;
    public const ushort Pole_Back            = 5080+1;
    public const ushort Pole_Right           = 5080+2;
    public const ushort Pole_Front           = 5080+3;
    public const ushort Pole_Bottom          = 5080+4;
    public const ushort Pole_Top             = 5080+5;

    public const ushort PoleLong             = 5088;

    public const ushort FenceWhite           = 5096;
    public const ushort GateWhite            = 5104;
    public const ushort GateWhite_1          = 5104+1;
    public const ushort GateWhite_Open       = 5104+2;
    public const ushort GateWhite_1Open      = 5104+3;

    public const ushort Fence_Special_NoLeft = 5112+0;
    public const ushort Fence_Special_NoBack = 5112+1;
    public const ushort Fence_Special_NoRight= 5112+2;
    public const ushort Fence_Special_NoFront= 5112+3;
    public const ushort Fence_Special_Left   = 5112+4;
    public const ushort Fence_Special_Back   = 5112+5;
    public const ushort Fence_Special_Right  = 5112+6;
    public const ushort Fence_Special_Front  = 5112+7;
    
    public const ushort Horse                = 5128;
    public const ushort GlassBlock           = 5136;

    // category 15, special controll blocks (ex. mc import)
    public const ushort MC_TrapDoor1_Lower_Left       = 7168;
    public const ushort MC_TrapDoor1_Lower_Back       = 7168+1;
    public const ushort MC_TrapDoor1_Lower_Right      = 7168+2;
    public const ushort MC_TrapDoor1_Lower_Front      = 7168+3;
    public const ushort MC_TrapDoor1_Lower_LeftOpen   = 7168+4;
    public const ushort MC_TrapDoor1_Lower_BackOpen   = 7168+5;
    public const ushort MC_TrapDoor1_Lower_RightOpen  = 7168+6;
    public const ushort MC_TrapDoor1_Lower_FrontOpen  = 7168+7;

    public const ushort MC_TrapDoor2_Lower_Left       = 7176;
    public const ushort MC_TrapDoor2_Lower_Back       = 7176+1;
    public const ushort MC_TrapDoor2_Lower_Right      = 7176+2;
    public const ushort MC_TrapDoor2_Lower_Front      = 7176+3;
    public const ushort MC_TrapDoor2_Lower_LeftOpen   = 7176+4;
    public const ushort MC_TrapDoor2_Lower_BackOpen   = 7176+5;
    public const ushort MC_TrapDoor2_Lower_RightOpen  = 7176+6;
    public const ushort MC_TrapDoor2_Lower_FrontOpen  = 7176+7;

    public const ushort MC_UpperDoor_RightAttached    = 7184;
    public const ushort MC_UpperDoor_LeftAttached     = 7184+1;
    
    public static readonly Block NoBlock      = new Block(Air);
    public static readonly Block InvalidBlock = new Block(Invalid);
}