namespace Eltisa.Source.Server; 

using System;
using Eltisa.Source.Models;


public class BlockController : IBlockAccess {

    private readonly BlockProvider blockProvider;
    private readonly ChangedBlock[] noChange = {};

    public BlockController(BlockProvider blockProvider) {   
        this.blockProvider = blockProvider;     
    }


    public ChangedBlock[] CreateBlock(Actor actor, WorldPoint worldPos, ushort blockDescription) {
        var newBlock = blockProvider.CreateBlock(worldPos, blockDescription);
        if(newBlock.IsInvalid()) return noChange;
        else                     return new ChangedBlock[]{new ChangedBlock(worldPos, newBlock) };
    }


    public Block ReadBlock(Actor actor, WorldPoint worldPos) {
        return blockProvider.ReadBlock(worldPos);
    }


    public ChangedBlock[] UpdateBlock(Actor actor, WorldPoint worldPos, ushort newBlockDefinition) {
        var newBlock = blockProvider.UpdateBlock(worldPos, newBlockDefinition);
        if(newBlock.IsInvalid()) return noChange;
        else                     return new ChangedBlock[]{new ChangedBlock(worldPos, newBlock) };
    }


    public ChangedBlock[] SwitchBlocks(Actor actor, params WorldPoint[] worldPos) {
        throw new NotImplementedException();
    }


    public ChangedBlock[] DeleteBlock(Actor actor, WorldPoint worldPos) {
        var newBlock = blockProvider.DeleteBlock(worldPos);
        if(newBlock.IsInvalid()) return noChange;
        else                     return new ChangedBlock[]{new ChangedBlock(worldPos, BlockDescription.NoBlock) };
  }


    public Chunk ReadChunk(Actor actor, WorldPoint worldPos)  {
        return blockProvider.ReadChunk(worldPos);
    }

}