namespace Eltisa.Source.Server; 

using System;
using Eltisa.Source.Models;


public interface IBlockAccess {
    void CreateBlock();
    Block ReadBlock(WorldPoint location);
    void ReadBlockChunk();
    void UpdateBlock();
    void DeleteBlock();

}



public class BlockServer : IBlockAccess {

    private readonly IRegionAccess regionAccess;


    public BlockServer(IRegionAccess regionAccess) {   
        this.regionAccess = regionAccess;     
    }


    public void CreateBlock() {
        
    }


    public Block ReadBlock(WorldPoint worldPos) {
        if(worldPos.IsNotAPoint())  return BlockDescription.NotABlock;
        RegionPoint regionPos = worldPos.GetRegionPoint();
        Region region         = regionAccess.ReadRegion(regionPos);
        ChunkPoint chunkPos   = worldPos.GetChunkPoint();
        Chunk chunk           = region.GetChunk(chunkPos);
        if(chunk != null) return chunk.GetBlock(worldPos.GetBlockPoint());
        else              return DefaultWorld.GetBlock(worldPos);        
    }


    public void UpdateBlock() {
        
    }


    public void DeleteBlock() {
        
    }


    public void ReadBlockChunk() {

    }


}
