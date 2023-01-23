namespace Eltisa.Server.Blocks; 

using System;
using Eltisa.Models;
using Eltisa.Tools;
using static Eltisa.Models.Constants;

public class BlockProvider {

    private readonly IRegionAccess regionAccess;

    public BlockProvider(IRegionAccess regionAccess) {   
        this.regionAccess = regionAccess;     
    }


    public Change[] CreateBlock(WorldPoint worldPos, ushort blockDescription) {
        if(worldPos.IsNotAPoint())  return NoChanges;
        RegionPoint regionPos = worldPos.GetRegionPoint();
        Region region         = regionAccess.ReadRegion(regionPos);
        ChunkPoint chunkPos   = worldPos.GetChunkPoint();
        Chunk chunk           = region.GetChunk(chunkPos);
        BlockPoint blockPos   = worldPos.GetBlockPoint();

        lock(region) {
            region.SetChanged();

            if(chunk == null) {
                chunk = DefaultWorld.CreateChunk(worldPos);
                region.SetChunk(chunk);
            }

            if(chunk.HasBlockAt(blockPos) ) return NoChanges;

            if(Block.IsTransparent(blockDescription)) {
                var faces = DetermineVisibleFacesOfBlock(chunk, blockPos, worldPos);
                var block =  chunk.CreateTransparentBlock(blockPos, blockDescription, faces);
                return new Change[] { new Change(worldPos, block)};
            }
            else {  // solid block
                var (faces, changes) = RemoveVisibleFacesOfNeighbours(chunk, blockPos, worldPos);
                var block = chunk.CreateSolidBlock(blockPos, blockDescription, faces);
                return changes.Add(new Change(worldPos, block));
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


    public Change[] UpdateBlock(WorldPoint worldPos, ushort newBlockDefinition) {
        if(worldPos.IsNotAPoint())  return NoChanges;
        RegionPoint regionPos = worldPos.GetRegionPoint();
        Region region         = regionAccess.ReadRegion(regionPos);
        ChunkPoint chunkPos   = worldPos.GetChunkPoint();
        Chunk chunk           = region.GetChunk(chunkPos);
        BlockPoint blockPos   = worldPos.GetBlockPoint();

        lock(region) {
            region.SetChanged();  // not entirely correct here

            if(chunk == null) {
                chunk = DefaultWorld.CreateChunk(worldPos);
                region.SetChunk(chunk);
            }

            var block = chunk.UpdateSolidBlock(blockPos, newBlockDefinition);
            if(block.IsBlock()) return new Change[] { new Change(worldPos, block)};;

            block = chunk.UpdateTransparentBlock(blockPos, newBlockDefinition);
            if(block.IsBlock()) return new Change[] { new Change(worldPos, block)};;

            // change block failed
            return NoChanges;
        }        
    }


    /// <summaryY
    /// ATTENTION: can only delete transparent blocks or solid blocks, that are visible
    /// </summary>
    public Change[]  DeleteBlock(WorldPoint worldPos) {
        if(worldPos.IsNotAPoint())  return NoChanges;
        RegionPoint regionPos = worldPos.GetRegionPoint();
        Region region         = regionAccess.ReadRegion(regionPos);
        ChunkPoint chunkPos   = worldPos.GetChunkPoint();
        Chunk chunk           = region.GetChunk(chunkPos);
        BlockPoint blockPos   = worldPos.GetBlockPoint();

        lock(region) {
            region.SetChanged();  // not entirely correct here

            if(chunk == null) {
                chunk = DefaultWorld.CreateChunk(worldPos);
                region.SetChunk(chunk);
            }

            var block = chunk.DeleteTransparentBlock(blockPos);
            if(block.IsBlock()) {
                block.ClearFacesCategoryTypeStatus();
                return new Change[] { new Change(worldPos, block) };
            }

            block = chunk.DeleteSolidBlock(blockPos);
            if(block.IsBlock()) {
                var changes = AddVisibleFacesToNeighbours(chunk, blockPos, worldPos);
                block.ClearFacesCategoryTypeStatus();
                return changes.Add(new Change(worldPos, block));
            }

            // delete block failed
            return NoChanges;
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


    private (Block.Faces, Change[]) RemoveVisibleFacesOfNeighbours(Chunk centerChunk, BlockPoint blockPos, WorldPoint  worldPos) {
        Block.Faces faces = Block.NoFaces;

        WorldPoint pos;
        Block      neighbour;
        Change[]  changes = new Change[6];
        int        changeCount = 0;
        
        pos = worldPos.Left();
        if(blockPos.IsMostLeft())   neighbour = ReadChunk(pos).RemoveFace(pos.GetBlockPoint(),  Block.Faces.Right);
        else                        neighbour = centerChunk.RemoveFace(blockPos.Left(),  Block.Faces.Right);
        if(!neighbour.IsSolid())    faces |= Block.Faces.Left;
        if(neighbour.IsBlock())     changes[changeCount++] = new Change(pos, neighbour);

        pos = worldPos.Right();
        if(blockPos.IsMostRight())  neighbour = ReadChunk(pos).RemoveFace(pos.GetBlockPoint(), Block.Faces.Left);
        else                        neighbour = centerChunk.RemoveFace(blockPos.Right(), Block.Faces.Left);
        if(!neighbour.IsSolid())    faces |= Block.Faces.Right;
        if(neighbour.IsBlock())     changes[changeCount++] = new Change(pos, neighbour);
        
        pos = worldPos.Back();
        if(blockPos.IsMostBack())   neighbour = ReadChunk(pos).RemoveFace(pos.GetBlockPoint(), Block.Faces.Front);
        else                        neighbour = centerChunk.RemoveFace(blockPos.Back(), Block.Faces.Front);
        if(!neighbour.IsSolid())    faces |= Block.Faces.Back;
        if(neighbour.IsBlock())     changes[changeCount++] = new Change(pos, neighbour);
        
        pos = worldPos.Front();
        if(blockPos.IsMostFront())  neighbour = ReadChunk(pos).RemoveFace(pos.GetBlockPoint(), Block.Faces.Back);
        else                        neighbour = centerChunk.RemoveFace(blockPos.Front(), Block.Faces.Back);
        if(!neighbour.IsSolid())    faces |= Block.Faces.Front;
        if(neighbour.IsBlock())     changes[changeCount++] = new Change(pos, neighbour);
        
        pos = worldPos.Bottom();
        if(blockPos.IsMostBottom()) neighbour = ReadChunk(pos).RemoveFace(pos.GetBlockPoint(), Block.Faces.Top); 
        else                        neighbour = centerChunk.RemoveFace(blockPos.Bottom(), Block.Faces.Top); 
        if(!neighbour.IsSolid())    faces |= Block.Faces.Bottom;
        if(neighbour.IsBlock())     changes[changeCount++] = new Change(pos, neighbour);
        
        pos = worldPos.Top();
        if(blockPos.IsMostTop())    neighbour = ReadChunk(pos).RemoveFace(pos.GetBlockPoint(), Block.Faces.Bottom); 
        else                        neighbour = centerChunk.RemoveFace(blockPos.Top(), Block.Faces.Bottom); 
        if(!neighbour.IsSolid())    faces |= Block.Faces.Top;
        if(neighbour.IsBlock())     changes[changeCount++] = new Change(pos, neighbour);
        
        if(changeCount < 6) changes = changes[0..changeCount];
        return (faces, changes);
    }


    private Change[] AddVisibleFacesToNeighbours(Chunk chunk, BlockPoint blockPos, WorldPoint  worldPos) {
        WorldPoint pos;
        Block      neighbour;
        Change[]  changes = new Change[6];
        int        changeCount = 0;

        pos = worldPos.Left();
        if(blockPos.IsMostLeft())   neighbour = ReadChunk(pos).AddFace(pos.GetBlockPoint(), Block.Faces.Right);
        else                        neighbour = chunk.AddFace(blockPos.Left(),  Block.Faces.Right);
        if(neighbour.IsBlock())     changes[changeCount++] = new Change(pos, neighbour);

        pos = worldPos.Right();
        if(blockPos.IsMostRight())  neighbour = ReadChunk(pos).AddFace(pos.GetBlockPoint(), Block.Faces.Left);
        else                        neighbour = chunk.AddFace(blockPos.Right(), Block.Faces.Left);
        if(neighbour.IsBlock())     changes[changeCount++] = new Change(pos, neighbour);

        pos = worldPos.Back();
        if(blockPos.IsMostBack())   neighbour = ReadChunk(pos).AddFace(pos.GetBlockPoint(),  Block.Faces.Front);
        else                        neighbour = chunk.AddFace(blockPos.Back(),  Block.Faces.Front);            
        if(neighbour.IsBlock())     changes[changeCount++] = new Change(pos, neighbour);

        pos = worldPos.Front();
        if(blockPos.IsMostFront())  neighbour = ReadChunk(pos).AddFace(pos.GetBlockPoint(), Block.Faces.Back);
        else                        neighbour = chunk.AddFace(blockPos.Front(), Block.Faces.Back);
        if(neighbour.IsBlock())     changes[changeCount++] = new Change(pos, neighbour);

        pos = worldPos.Bottom();
        if(blockPos.IsMostBottom()) neighbour = ReadChunk(pos).AddFace(pos.GetBlockPoint(),Block.Faces.Top); 
        else                        neighbour = chunk.AddFace(blockPos.Bottom(),Block.Faces.Top);
        if(neighbour.IsBlock())     changes[changeCount++] = new Change(pos, neighbour);

        pos = worldPos.Top();
        if(blockPos.IsMostTop())    neighbour = ReadChunk(pos).AddFace(pos.GetBlockPoint(), Block.Faces.Bottom); 
        else                        neighbour = chunk.AddFace(blockPos.Top(),   Block.Faces.Bottom);
        if(neighbour.IsBlock())     changes[changeCount++] = new Change(pos, neighbour);

        if(changeCount < 6) changes = changes[0..changeCount];
        return changes;
    }        

}
