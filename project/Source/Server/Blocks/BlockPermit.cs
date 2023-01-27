namespace Eltisa.Server.Blocks; 

using System;
using Eltisa.Administration;
using Eltisa.Models;
using static Eltisa.Models.Constants;


public class BlockPermit : IBlockAccess {

    private readonly IBlockAccess blockAccess;

    public BlockPermit(IBlockAccess blockAccess) {   
        this.blockAccess = blockAccess;     
    }


    public Change[] CreateBlock(Actor actor, WorldPoint worldPos, ushort blockDescription) {
        if(Policy.CanEdit(actor, worldPos)) return blockAccess.CreateBlock(actor, worldPos, blockDescription);
        else                                return NoChanges;
    }


    public Block ReadBlock(Actor actor, WorldPoint worldPos) {
        return blockAccess.ReadBlock(actor, worldPos);
    }


    public Change[] UpdateBlock(Actor actor, WorldPoint worldPos, ushort newBlockDefinition) {
        if(Policy.CanEdit(actor, worldPos)) return blockAccess.UpdateBlock(actor, worldPos, newBlockDefinition);
        else                                return NoChanges;        
    }


    public Change[] SwitchBlocks(Actor actor, params WorldPoint[] worldPositions) {
        return blockAccess.SwitchBlocks(actor, worldPositions);
    }


    public Change[] DeleteBlock(Actor actor, WorldPoint worldPos) {
        if(Policy.CanEdit(actor, worldPos)) return blockAccess.DeleteBlock(actor, worldPos);
        else                                return NoChanges;                
    }


    public Chunk ReadChunk(Actor actor, RegionPoint regionPos, ChunkPoint chunkPos)  {
        return blockAccess.ReadChunk(actor, regionPos, chunkPos);
    }

}


