namespace Eltisa.Server; 

using System;
using Eltisa.Models;
using static Eltisa.Administration.Configuration;


public static class DefaultWorld {

    private static Random rand = new Random();

    public const int SeaLevel     = 32;    // in world coordinates
    public const int SeaBottom    = 0;
    public const int RockBottom   = -WorldRadiusVertical+16;
    public const int WorldBottom  = -WorldRadiusVertical;


    public static Block GetBlock(WorldPoint position) {
        if(position.Y >= SeaLevel  )       return BlockDescription.NoBlock;
        else if(position.Y == SeaLevel-1)  return new Block(position.GetBlockPoint(), BlockDescription.Water, Block.Faces.Top);
        else if(position.Y >= SeaBottom )  return new Block(position.GetBlockPoint(), BlockDescription.Water, Block.NoFaces);
        else if(position.Y >= RockBottom)  return new Block(position.GetBlockPoint(), BlockDescription.Stone, Block.NoFaces);
        else if(position.Y >= WorldBottom) return new Block(position.GetBlockPoint(), BlockDescription.Lava,  Block.NoFaces);
        else                               return BlockDescription.NoBlock;
    }


    public static bool HasSolidBlock(WorldPoint position) {
        return position.Y < SeaLevel;
    }


    public static Chunk CreateChunk(WorldPoint position) {
        int y = position.GetChunkPointY();

        if( y == - ChunkRadiusVertical ) return CreateMagmaChunk(position.GetChunkPoint());
        else if( y  < 0 )                return CreateEarthChunk(position.GetChunkPoint());
        else if( y == 0 )                return CreateSeaChunk(position.GetChunkPoint());
        else if( y == 1 )                return CreateSeaSurfaceChunk(position.GetChunkPoint());
        else if( y  > 0 )                return CreateSkyChunk(position.GetChunkPoint());
        else throw new Exception("this should never happen");
    }


    public static Chunk CreateChunk(RegionPoint regionPos, ChunkPoint chunkPos) {
        int y = regionPos.Y * chunkPos.Y * 16;

        if( y == - ChunkRadiusVertical ) return CreateMagmaChunk(chunkPos);
        else if( y  < 0 )                return CreateEarthChunk(chunkPos);
        else if( y == 0 )                return CreateSeaChunk(chunkPos);
        else if( y == 1 )                return CreateSeaSurfaceChunk(chunkPos);
        else if( y  > 0 )                return CreateSkyChunk(chunkPos);
        else throw new Exception("this should never happen");
    }


    public static bool IsModifiedChunk(Chunk chunk) {
        if( chunk.Position.Y == - ChunkRadiusVertical ) return IsModifiedMagmaChunk(chunk);
        else if( chunk.Position.Y  < 0 )                return IsModifiedEarthChunk(chunk);
        else if( chunk.Position.Y == 0 )                return IsModifiedSeaChunk(chunk);
        else if( chunk.Position.Y == 1 )                return IsModifiedSeaSurfaceChunk(chunk);
        else if( chunk.Position.Y  > 0 )                return IsModifiedSkyChunk(chunk);
        else throw new Exception("this should never happen");
    }


    private static Chunk CreateMagmaChunk(ChunkPoint position) {
        return new Chunk(position, BlockDescription.Lava);
    }


    private static bool IsModifiedMagmaChunk(Chunk chunk) {
        if(chunk.DefaultBlockDefinition != BlockDescription.Lava) return true;
        return chunk.IsModified();
    }


    private static Chunk CreateEarthChunk(ChunkPoint position) {
        return new Chunk(position, BlockDescription.Stone);
    }


    private static bool IsModifiedEarthChunk(Chunk chunk) {
        if(chunk.DefaultBlockDefinition != BlockDescription.Stone) return true;
        return chunk.IsModified();
    }


    private static Chunk CreateSeaChunk(ChunkPoint position) {
        return new Chunk(position, BlockDescription.Water);
    }


    private static bool IsModifiedSeaChunk(Chunk chunk) {
        if(chunk.DefaultBlockDefinition != BlockDescription.Water) return true;
        return chunk.IsModified();
    }


    private static Chunk CreateSeaSurfaceChunk(ChunkPoint position) {
        Chunk seaChunk = new Chunk(position, BlockDescription.Water);

        int y = ChunkSize - 1;
        for(int x=0; x < ChunkSize; x++) {
            for(int z=0; z < ChunkSize; z++) {
                BlockPoint blockPos = new BlockPoint(x, y, z);
                seaChunk.AddFace(blockPos, Block.Faces.Top);  
            }
        }
        return seaChunk;
    }


    private static bool IsModifiedSeaSurfaceChunk(Chunk chunk) {
        if(chunk.DefaultBlockDefinition != BlockDescription.Water) return true;
        if(chunk.BlockCount != ChunkVolume) return true;
        if(chunk.BorderBlocks.Size() != ChunkSize * ChunkSize) return true;
        if(chunk.InnerBlocks.Size() > 0) return true;
        if(chunk.EmptyBlocks.Size() > 0) return true;
        return true;
    }


    public static Chunk CreateSkyChunk(ChunkPoint position) {
        return new Chunk(position);
    }


    private static bool IsModifiedSkyChunk(Chunk chunk) {
        if(chunk.DefaultBlockDefinition != BlockDescription.Air) return true;
        return chunk.IsModified();
    }


}

