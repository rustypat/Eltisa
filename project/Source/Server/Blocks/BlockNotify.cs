namespace Eltisa.Server.Blocks; 

using System;
using Eltisa.Communication;
using Eltisa.Models;
using static Eltisa.Models.Constants;


class BlockNotify : IBlockAccess {

    private readonly IBlockAccess blockAccess;

    public BlockNotify(IBlockAccess blockAccess) {   
        this.blockAccess = blockAccess;     
    }


    public Change[] CreateBlock(Actor actor, WorldPoint worldPos, ushort blockDescription) {
        var changes = blockAccess.CreateBlock(actor, worldPos, blockDescription);
        if(changes != NoChanges) {
            OutMessageHandler.SendBlocksChangedNotification(worldPos, changes);
        }
        return changes;
    }


    public Block ReadBlock(Actor actor, WorldPoint worldPos) {
        var block = blockAccess.ReadBlock(actor, worldPos);
        return block;
    }


    public Change[] UpdateBlock(Actor actor, WorldPoint worldPos, ushort newBlockDefinition) {
        var changes =  blockAccess.UpdateBlock(actor, worldPos, newBlockDefinition);
        if(changes != NoChanges) {
            OutMessageHandler.SendBlocksChangedNotification(worldPos, changes);
        }
        return changes;
    }


    public Change[] SwitchBlocks(Actor actor, params WorldPoint[] worldPositions) {
        if(worldPositions.Length == 0) return NoChanges;
        var changes = blockAccess.SwitchBlocks(actor, worldPositions);
        if(changes != NoChanges) {
            OutMessageHandler.SendBlocksChangedNotification(worldPositions[0], changes);
        }
        return changes;
    }


    public Change[] DeleteBlock(Actor actor, WorldPoint worldPos) {
        var changes = blockAccess.DeleteBlock(actor, worldPos);
        if(changes != NoChanges) {
            OutMessageHandler.SendBlocksChangedNotification(worldPos, changes);
        }
        return changes;
    }


    public Chunk ReadChunk(Actor actor, RegionPoint regionPos, ChunkPoint chunkPos)  {
        var chunk = blockAccess.ReadChunk(actor, regionPos, chunkPos);
        return chunk;
    }

}


