namespace Eltisa.Source.Server; 

using System;
using Eltisa.Source.Models;


public class BlockProvider {

    private readonly IRegionAccess regionAccess;
    private readonly Object changeLock = new Object();

    public BlockProvider(IRegionAccess regionAccess) {   
        this.regionAccess = regionAccess;     
    }


    public Block CreateBlock(WorldPoint worldPos, ushort blockDescription) {
        if(worldPos.IsNotAPoint())  return BlockDescription.NoBlock;
        RegionPoint regionPos = worldPos.GetRegionPoint();
        Region region         = regionAccess.ReadRegion(regionPos);
        ChunkPoint chunkPos   = worldPos.GetChunkPoint();
        Chunk chunk           = region.GetChunk(chunkPos);
        BlockPoint blockPos   = worldPos.GetBlockPoint();

        lock(changeLock) {
            region.SetChanged();

            if(chunk == null) {
                chunk = DefaultWorld.CreateChunk(worldPos);
                region.SetChunk(chunk);
            }

            if(chunk.HasBlockAt(blockPos) ) return BlockDescription.InvalidBlock;

            if(Block.IsTransparent(blockDescription)) {
                var faces = DetermineVisibleFacesOfBlock(chunk, blockPos, worldPos);
                return chunk.CreateTransparentBlock(blockPos, blockDescription, faces);
            }
            else {  // solid block
                var faces = RemoveVisibleFacesOfNeighbours(chunk, blockPos, worldPos);
                return chunk.CreateSolidBlock(blockPos, blockDescription, faces);
            }
        }        
    }


    public Block ReadBlock(WorldPoint worldPos) {
        if(worldPos.IsNotAPoint())  return BlockDescription.NoBlock;
        RegionPoint regionPos = worldPos.GetRegionPoint();
        Region region         = regionAccess.ReadRegion(regionPos);
        ChunkPoint chunkPos   = worldPos.GetChunkPoint();
        Chunk chunk           = region.GetChunk(chunkPos);
        if(chunk != null) return chunk.GetBlock(worldPos.GetBlockPoint());
        else              return DefaultWorld.GetBlock(worldPos);        
    }


    public Block UpdateBlock(WorldPoint worldPos, ushort newBlockDefinition) {
        if(worldPos.IsNotAPoint())  return BlockDescription.NoBlock;
        RegionPoint regionPos = worldPos.GetRegionPoint();
        Region region         = regionAccess.ReadRegion(regionPos);
        ChunkPoint chunkPos   = worldPos.GetChunkPoint();
        Chunk chunk           = region.GetChunk(chunkPos);
        BlockPoint blockPos   = worldPos.GetBlockPoint();

        lock(changeLock) {
            region.SetChanged();  // not entirely correct here

            if(chunk == null) {
                chunk = DefaultWorld.CreateChunk(worldPos);
                region.SetChunk(chunk);
            }

            var block = chunk.UpdateSolidBlock(blockPos, newBlockDefinition);
            if(block.IsABlock()) return block;

            block = chunk.UpdateTransparentBlock(blockPos, newBlockDefinition);
            if(block.IsABlock()) return block;

            // change block failed
            return BlockDescription.InvalidBlock;
        }        
    }


    /// <summaryY
    /// ATTENTION: can only delete transparent blocks or solid blocks, that are visible
    /// </summary>
    public Block DeleteBlock(WorldPoint worldPos) {
        if(worldPos.IsNotAPoint())  return BlockDescription.NoBlock;
        RegionPoint regionPos = worldPos.GetRegionPoint();
        Region region         = regionAccess.ReadRegion(regionPos);
        ChunkPoint chunkPos   = worldPos.GetChunkPoint();
        Chunk chunk           = region.GetChunk(chunkPos);
        BlockPoint blockPos   = worldPos.GetBlockPoint();

        lock(changeLock) {
            region.SetChanged();  // not entirely correct here

            if(chunk == null) {
                chunk = DefaultWorld.CreateChunk(worldPos);
                region.SetChunk(chunk);
            }

            var block = chunk.DeleteTransparentBlock(blockPos);
            if(block.IsABlock()) {
                return block;
            }

            block = chunk.DeleteSolidBlock(blockPos);
            if(block.IsABlock()) {
                AddVisibleFacesToNeighbours(chunk, blockPos, worldPos);
                return block;
            }

            // delete block failed
            return BlockDescription.InvalidBlock;
        }        
    }


    public Chunk ReadChunk(WorldPoint worldPos)  {
        RegionPoint regionPos = worldPos.GetRegionPoint();
        Region region         = regionAccess.ReadRegion(regionPos);
        ChunkPoint chunkPos   = worldPos.GetChunkPoint();
        Chunk chunk           = region.GetChunk(chunkPos);

        if(chunk == null) {
            chunk = DefaultWorld.CreateChunk(worldPos);
            region.SetChunk(chunk);
        }
        return chunk;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // face management
    ///////////////////////////////////////////////////////////////////////////////////////////


    private Block.Faces DetermineVisibleFacesOfBlock(Chunk chunk, BlockPoint blockPos, WorldPoint  worldPos) {
        Block.Faces faces = Block.NoFaces;
        
        if(blockPos.IsMostLeft()) {
            var leftPos = worldPos.Left();
            if(!ReadChunk(leftPos).HasSolidBlockAt(leftPos.GetBlockPoint()) )       faces |= Block.Faces.Left;
        }
        else {
            if(!chunk.HasSolidBlockAt(blockPos.Left()) )                            faces |= Block.Faces.Left;
        }

        if(blockPos.IsMostRight()) {
            var rightPos = worldPos.Left();
            if(!ReadChunk(rightPos).HasSolidBlockAt(rightPos.GetBlockPoint()) )     faces |= Block.Faces.Right;
        }
        else {
            if(!chunk.HasSolidBlockAt(blockPos.Right()) )                           faces |= Block.Faces.Right;
        }

        if(blockPos.IsMostBack()) {
            var backPos = worldPos.Back();
            if(!ReadChunk(backPos).HasSolidBlockAt(backPos.GetBlockPoint()) )       faces |= Block.Faces.Back;
        }
        else {
            if(!chunk.HasSolidBlockAt(blockPos.Back()) )                            faces |= Block.Faces.Back;
        }

        if(blockPos.IsMostFront()) {
            var frontPos = worldPos.Front();
            if(!ReadChunk(frontPos).HasSolidBlockAt(frontPos.GetBlockPoint()) )     faces |= Block.Faces.Front;
        }
        else {
            if(!chunk.HasSolidBlockAt(blockPos.Front())  )                          faces |= Block.Faces.Front;
        }

        if(blockPos.IsMostBottom()) {
            var bottomPos = worldPos.Bottom();
            if(!ReadChunk(bottomPos).HasSolidBlockAt(bottomPos.GetBlockPoint()) )   faces |= Block.Faces.Bottom;
        }
        else {
            if(!chunk.HasSolidBlockAt(blockPos.Bottom()) )                          faces |= Block.Faces.Bottom;
        }

        if(blockPos.IsMostTop()) {
            var topPos = worldPos.Top();
            if(!ReadChunk(topPos).HasSolidBlockAt(topPos.GetBlockPoint()) )         faces |= Block.Faces.Top;
        }
        else {
            if(!chunk.HasSolidBlockAt(blockPos.Top()) )                             faces |= Block.Faces.Top;
        }
        
        return faces;
    }


    private Block.Faces RemoveVisibleFacesOfNeighbours(Chunk chunk, BlockPoint blockPos, WorldPoint  worldPos) {
        Block.Faces faces = Block.NoFaces;

        Block neighbour;
        
        if(blockPos.IsMostLeft())   neighbour = ReadChunk(worldPos.Left()).RemoveFace(worldPos.Left().GetBlockPoint(),  Block.Faces.Right);
        else                        neighbour = chunk.RemoveFace(blockPos.Left(),  Block.Faces.Right);
        if(!neighbour.IsSolid())    faces |= Block.Faces.Left;

        if(blockPos.IsMostRight())  neighbour = ReadChunk(worldPos.Right()).RemoveFace(worldPos.Right().GetBlockPoint(), Block.Faces.Left);
        else                        neighbour = chunk.RemoveFace(blockPos.Right(), Block.Faces.Left);
        if(!neighbour.IsSolid())    faces |= Block.Faces.Right;
        
        if(blockPos.IsMostBack())   neighbour = ReadChunk(worldPos.Back()).RemoveFace(worldPos.Back().GetBlockPoint(),  Block.Faces.Front);
        else                        neighbour = chunk.RemoveFace(blockPos.Back(),  Block.Faces.Front);
        if(!neighbour.IsSolid())    faces |= Block.Faces.Back;
        
        if(blockPos.IsMostFront())  neighbour = ReadChunk(worldPos.Front()).RemoveFace(worldPos.Front().GetBlockPoint(), Block.Faces.Back);
        else                        neighbour = chunk.RemoveFace(blockPos.Front(), Block.Faces.Back);
        if(!neighbour.IsSolid())    faces |= Block.Faces.Front;
        
        if(blockPos.IsMostBottom()) neighbour = ReadChunk(worldPos.Bottom()).RemoveFace(worldPos.Bottom().GetBlockPoint(),Block.Faces.Top); 
        else                        neighbour = chunk.RemoveFace(blockPos.Bottom(),Block.Faces.Top); 
        if(!neighbour.IsSolid())    faces |= Block.Faces.Bottom;
        
        if(blockPos.IsMostTop())    neighbour = ReadChunk(worldPos.Top()).RemoveFace(worldPos.Top().GetBlockPoint(),   Block.Faces.Bottom); 
        else                        neighbour = chunk.RemoveFace(blockPos.Top(),   Block.Faces.Bottom); 
        if(!neighbour.IsSolid())    faces |= Block.Faces.Top;
        
        return faces;
    }


    private void AddVisibleFacesToNeighbours(Chunk chunk, BlockPoint blockPos, WorldPoint  worldPos) {
        if(blockPos.IsMostLeft())   ReadChunk(worldPos.Left()).AddFace(worldPos.Left().GetBlockPoint(),  Block.Faces.Right);
        else                        chunk.AddFace(blockPos.Left(),  Block.Faces.Right);
        if(blockPos.IsMostRight())  ReadChunk(worldPos.Right()).AddFace(worldPos.Right().GetBlockPoint(), Block.Faces.Left);
        else                        chunk.AddFace(blockPos.Right(), Block.Faces.Left);
        if(blockPos.IsMostBack())   ReadChunk(worldPos.Back()).AddFace(worldPos.Back().GetBlockPoint(),  Block.Faces.Front);
        else                        chunk.AddFace(blockPos.Back(),  Block.Faces.Front);            
        if(blockPos.IsMostFront())  ReadChunk(worldPos.Front()).AddFace(worldPos.Front().GetBlockPoint(), Block.Faces.Back);
        else                        chunk.AddFace(blockPos.Front(), Block.Faces.Back);
        if(blockPos.IsMostBottom()) ReadChunk(worldPos.Bottom()).AddFace(worldPos.Bottom().GetBlockPoint(),Block.Faces.Top); 
        else                        chunk.AddFace(blockPos.Bottom(),Block.Faces.Top);
        if(blockPos.IsMostTop())    ReadChunk(worldPos.Top()).AddFace(worldPos.Top().GetBlockPoint(),   Block.Faces.Bottom); 
        else                        chunk.AddFace(blockPos.Top(),   Block.Faces.Bottom);
    }        



}
