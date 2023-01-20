namespace Eltisa.Source.Server.Blocks; 

using System;
using Eltisa.Source.Models;
using static Eltisa.Source.Models.BlockDescription;
using static Eltisa.Source.Server.Blocks.Constants;


public class BlockController : IBlockAccess {

    private readonly BlockProvider blockProvider;

    public BlockController(BlockProvider blockProvider) {   
        this.blockProvider = blockProvider;     
    }


    public Changed[] CreateBlock(Actor actor, WorldPoint worldPos, ushort blockDescription) {
        return blockProvider.CreateBlock(worldPos, blockDescription);
    }


    public Block ReadBlock(Actor actor, WorldPoint worldPos) {
        return blockProvider.ReadBlock(worldPos);
    }


    public Changed[] UpdateBlock(Actor actor, WorldPoint worldPos, ushort newBlockDefinition) {
        var newBlock = blockProvider.UpdateBlock(worldPos, newBlockDefinition);
        if(newBlock.IsInvalid()) return NoChanges;
        else                     return new Changed[]{new Changed(worldPos, newBlock) };
    }


    public Changed[] SwitchBlocks(Actor actor, params WorldPoint[] worldPositions) {
        var switchList = new Changed[worldPositions.Length];
        int switchCount = 0;
        
        foreach(var worldPos in worldPositions) {
            var block = blockProvider.ReadBlock(worldPos);
            if( block.IsInvalid()) continue;
            var newDefinition = GetSwitchDefinition(block.Definition);
            if(newDefinition == 0) continue;
            var newBlock = blockProvider.UpdateBlock(worldPos, newDefinition);
            if( newBlock.IsInvalid()) continue;
            switchList[switchCount++] = new Changed(worldPos, newBlock);        
        }
        if(switchCount < worldPositions.Length) switchList = switchList[0..switchCount];
        return switchList;
    }


    public Changed[] DeleteBlock(Actor actor, WorldPoint worldPos) {
        return blockProvider.DeleteBlock(worldPos);
    }


    public Chunk ReadChunk(Actor actor, WorldPoint worldPos)  {
        return blockProvider.ReadChunk(worldPos);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // switch table
    ///////////////////////////////////////////////////////////////////////////////////////////


    private static ushort[]  switchTable = new ushort[BlockDescription.MaxBlockDefinition];


    private  static void addSwitch(ushort blockDefinition, ushort blockDefinition1) {
        switchTable[blockDefinition]  = blockDefinition1;
        switchTable[blockDefinition1] = blockDefinition;
    }


    private static ushort GetSwitchDefinition(ushort oldDefinition) {
        if(oldDefinition >= BlockDescription.MaxBlockDefinition) return 0;
        else return switchTable[oldDefinition];
    }


    static BlockController() {
        addSwitch(JackOLantern,    JackOLantern_On);
        addSwitch(Oracle,          OracleUsed);
        addSwitch(Lamp,            Lamp_On);
        addSwitch(Sponge,          Sponge_1);
        addSwitch(Furnace,         Furnace_On);
        addSwitch(Ghost,           Ghost_1);
        addSwitch(Caldron,         Caldron_On);

        addSwitch(Door1+0,         Door1+7);
        addSwitch(Door1+1,         Door1+4);
        addSwitch(Door1+2,         Door1+5);
        addSwitch(Door1+3,         Door1+6);
    
        addSwitch(Door2+0,         Door2+7);
        addSwitch(Door2+1,         Door2+4);
        addSwitch(Door2+2,         Door2+5);
        addSwitch(Door2+3,         Door2+6);
    
        addSwitch(Door3+0,         Door3+7);
        addSwitch(Door3+1,         Door3+4);
        addSwitch(Door3+2,         Door3+5);
        addSwitch(Door3+3,         Door3+6);
    
        addSwitch(Door4+0,         Door4+7);
        addSwitch(Door4+1,         Door4+4);
        addSwitch(Door4+2,         Door4+5);
        addSwitch(Door4+3,         Door4+6);
    
        addSwitch(Door5+0,         Door5+7);
        addSwitch(Door5+1,         Door5+4);
        addSwitch(Door5+2,         Door5+5);
        addSwitch(Door5+3,         Door5+6);
    
        addSwitch(TorchFloor,      TorchFloor_Off);
        addSwitch(TorchFloor1,     TorchFloor1_Off);

        addSwitch(TorchWall_Left,  TorchWall_LeftOff);
        addSwitch(TorchWall_Right, TorchWall_RightOff);
        addSwitch(TorchWall_Back,  TorchWall_BackOff);
        addSwitch(TorchWall_Front, TorchWall_FrontOff);

        addSwitch(Gate_BackFront,            Gate_BackFrontOpen);
        addSwitch(Gate_LeftRight,          Gate_LeftRightOpen);
        addSwitch(GateSolid,       GateSolid_Open);
        addSwitch(GateSolid_1,     GateSolid_1Open);
        addSwitch(GateWhite,       GateWhite_Open);
        addSwitch(GateWhite_1,     GateWhite_1Open);

        addSwitch(TrapDoor1_Left,   TrapDoor1_LeftOpen);            
        addSwitch(TrapDoor1_Right,  TrapDoor1_RightOpen);            
        addSwitch(TrapDoor1_Back,   TrapDoor1_BackOpen);            
        addSwitch(TrapDoor1_Front,  TrapDoor1_FrontOpen);            

        addSwitch(TrapDoor2_Left,  TrapDoor2_LeftOpen);            
        addSwitch(TrapDoor2_Right, TrapDoor2_RightOpen);            
        addSwitch(TrapDoor2_Back,  TrapDoor2_BackOpen);            
        addSwitch(TrapDoor2_Front, TrapDoor2_FrontOpen);            

        addSwitch(TrapDoor3_Left,  TrapDoor3_LeftOpen);            
        addSwitch(TrapDoor3_Right, TrapDoor3_RightOpen);            
        addSwitch(TrapDoor3_Back,  TrapDoor3_BackOpen);            
        addSwitch(TrapDoor3_Front, TrapDoor3_FrontOpen);            

        addSwitch(Scripture_Left,  ScriptureUsed_Left);                                    
        addSwitch(Scripture_Back,  ScriptureUsed_Back);                                    
        addSwitch(Scripture_Right, ScriptureUsed_Right);                                    
        addSwitch(Scripture_Front, ScriptureUsed_Front);                                    

        addSwitch(RailSwitch_Left, RailSwitch_SwitchedLeft);
        addSwitch(RailSwitch_Back, RailSwitch_SwitchedBack);
        addSwitch(RailSwitch_Right,RailSwitch_SwitchedRight);
        addSwitch(RailSwitch_Front,RailSwitch_SwitchedFront);

        addSwitch(Lever_Left,      Lever_LeftOn);
        addSwitch(Lever_Back,      Lever_BackOn);
        addSwitch(Lever_Right,     Lever_RightOn);
        addSwitch(Lever_Front,     Lever_FrontOn);
        addSwitch(Lever_Bottom,    Lever_BottomOn);
        addSwitch(Lever_BottomT,   Lever_BottomTOn);
        addSwitch(Lever_Top,       Lever_TopOn);
        addSwitch(Lever_TopT,      Lever_TopTOn);            

        addSwitch(ButtonLED_Left,      ButtonLED_LeftOn);
        addSwitch(ButtonLED_Back,      ButtonLED_BackOn);
        addSwitch(ButtonLED_Right,     ButtonLED_RightOn);
        addSwitch(ButtonLED_Front,     ButtonLED_FrontOn);
        addSwitch(ButtonLED_Bottom,    ButtonLED_BottomOn);
        addSwitch(ButtonLED_Top,       ButtonLED_TopOn);

        addSwitch(ButtonStone_Left,      ButtonStone_LeftOn);
        addSwitch(ButtonStone_Back,      ButtonStone_BackOn);
        addSwitch(ButtonStone_Right,     ButtonStone_RightOn);
        addSwitch(ButtonStone_Front,     ButtonStone_FrontOn);
        addSwitch(ButtonStone_Bottom,    ButtonStone_BottomOn);
        addSwitch(ButtonStone_Top,       ButtonStone_TopOn);

        addSwitch(ButtonWood_Left,      ButtonWood_LeftOn);
        addSwitch(ButtonWood_Back,      ButtonWood_BackOn);
        addSwitch(ButtonWood_Right,     ButtonWood_RightOn);
        addSwitch(ButtonWood_Front,     ButtonWood_FrontOn);
        addSwitch(ButtonWood_Bottom,    ButtonWood_BottomOn);
        addSwitch(ButtonWood_Top,       ButtonWood_TopOn);
    }

}