namespace Eltisa.Server.Blocks; 

using System;
using Eltisa.Administration;
using Eltisa.Models;
using Eltisa.Server.Players;
using static Eltisa.Server.Blocks.Constants;


public class BlockNotify : IBlockAccess {

    private readonly IBlockAccess blockAccess;

    public BlockNotify(IBlockAccess blockAccess) {   
        this.blockAccess = blockAccess;     
    }


    public Changed[] CreateBlock(Actor actor, WorldPoint worldPos, ushort blockDescription) {
        var changes = blockAccess.CreateBlock(actor, worldPos, blockDescription);
        if(changes != NoChanges) {
            ActorStore.SendMessageToRange(message, worldPos, Configuration.ClientCacheBlockRadius);
        }
        return changes;
    }


    public Block ReadBlock(Actor actor, WorldPoint worldPos) {
        return blockAccess.ReadBlock(actor, worldPos);
    }


    public Changed[] UpdateBlock(Actor actor, WorldPoint worldPos, ushort newBlockDefinition) {
        if(CanModifyBlock(actor, worldPos)) return blockAccess.UpdateBlock(actor, worldPos, newBlockDefinition);
        else                                return NoChanges;        
    }


    public Changed[] SwitchBlocks(Actor actor, params WorldPoint[] worldPositions) {
        return blockAccess.SwitchBlocks(actor, worldPositions);
    }


    public Changed[] DeleteBlock(Actor actor, WorldPoint worldPos) {
        if(CanModifyBlock(actor, worldPos)) return blockAccess.DeleteBlock(actor, worldPos);
        else                                return NoChanges;                
    }


    public Chunk ReadChunk(Actor actor, WorldPoint worldPos)  {
        return blockAccess.ReadChunk(actor, worldPos);
    }

}


