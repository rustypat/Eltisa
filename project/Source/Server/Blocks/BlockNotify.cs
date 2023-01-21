namespace Eltisa.Server.Blocks; 

using System;
using Eltisa.Models;
using static Eltisa.Server.Blocks.Constants;


public class BlockNotify : IBlockAccess {

    private readonly IBlockAccess blockAccess;

    public BlockNotify(IBlockAccess blockAccess) {   
        this.blockAccess = blockAccess;     
    }


    public Changed[] CreateBlock(Actor actor, WorldPoint worldPos, ushort blockDescription) {
        var changes = blockAccess.CreateBlock(actor, worldPos, blockDescription);
        if(changes != NoChanges) {
            //TODO send message
        }
        return changes;
    }


    public Block ReadBlock(Actor actor, WorldPoint worldPos) {
        var block = blockAccess.ReadBlock(actor, worldPos);
        if(!block.IsInvalid()) {
            // TODO return result
        }
        return block;
    }


    public Changed[] UpdateBlock(Actor actor, WorldPoint worldPos, ushort newBlockDefinition) {
        var changes =  blockAccess.UpdateBlock(actor, worldPos, newBlockDefinition);
        if(changes != NoChanges) {
            //TODO send message
        }
        return changes;
    }


    public Changed[] SwitchBlocks(Actor actor, params WorldPoint[] worldPositions) {
        var changes = blockAccess.SwitchBlocks(actor, worldPositions);
        if(changes != NoChanges) {
            //TODO send message
        }
        return changes;
    }


    public Changed[] DeleteBlock(Actor actor, WorldPoint worldPos) {
        var changes = blockAccess.DeleteBlock(actor, worldPos);
        if(changes != NoChanges) {
            //TODO send message
        }
        return changes;
    }


    public Chunk ReadChunk(Actor actor, WorldPoint worldPos)  {
        var chunk = blockAccess.ReadChunk(actor, worldPos);
        // TODO return result
        return chunk;
    }

}


