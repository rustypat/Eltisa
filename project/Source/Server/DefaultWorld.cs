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
        int y = position.GetChunkWorldPointY();

        if( y == - ChunkRadiusVertical ) return CreateMagmaChunk(position.GetChunkPoint());
        else if( y  < 0 )                return CreateEarthChunk(position.GetChunkPoint());
        else if( y == 0 )                return CreateSeaChunk(position.GetChunkPoint());
        else if( y == 1 )                return CreateSeaSurfaceChunk(position.GetChunkPoint());
        else if( y  > 1 )                return CreateSkyChunk(position.GetChunkPoint());
        else throw new Exception("this should never happen");
    }


    public static Chunk CreateChunk(RegionPoint regionPos, ChunkPoint chunkPos) {
        int y = (regionPos.Y * 16) + chunkPos.Y;

        if( y == - ChunkRadiusVertical ) return CreateMagmaChunk(chunkPos);
        else if( y  < 0 )                return CreateEarthChunk(chunkPos);
        else if( y == 0 )                return CreateSeaChunk(chunkPos);
        else if( y == 1 )                return CreateSeaSurfaceChunk(chunkPos);
        else if( y  > 1 )                return CreateSkyChunk(chunkPos);
        else throw new Exception("this should never happen");
    }


    public static bool IsDefaultChunk(RegionPoint regionPos, Chunk chunk) {
        int y = (regionPos.Y * 16) + chunk.Position.Y;
        if( y == - ChunkRadiusVertical ) return IsDefaultMagmaChunk(chunk);
        else if( y  < 0 )                return IsDefaultEarthChunk(chunk);
        else if( y == 0 )                return IsDefaultSeaChunk(chunk);
        else if( y == 1 )                return IsDefaultSeaSurfaceChunk(chunk);
        else if( y  > 0 )                return IsDefaultSkyChunk(chunk);
        else throw new Exception("this should never happen");
    }


    private static Chunk CreateMagmaChunk(ChunkPoint position) {
        return new Chunk(position, BlockDescription.Lava);
    }


    private static bool IsDefaultMagmaChunk(Chunk chunk) {
        if(chunk.DefaultBlockDefinition != BlockDescription.Lava) return false;
        if(chunk.BlockCount != ChunkVolume) return false;
        if(chunk.BorderBlocks.Size() != 0) return false;
        if(chunk.InnerBlocks.Size() != 0) return false;
        if(chunk.EmptyBlocks.Size() != 0) return false;
        return true;
    }


    private static Chunk CreateEarthChunk(ChunkPoint position) {
        return new Chunk(position, BlockDescription.Stone);
    }


    private static bool IsDefaultEarthChunk(Chunk chunk) {
        if(chunk.DefaultBlockDefinition != BlockDescription.Stone) return false;
        if(chunk.BlockCount != ChunkVolume) return false;
        if(chunk.BorderBlocks.Size() != 0) return false;
        if(chunk.InnerBlocks.Size() != 0) return false;
        if(chunk.EmptyBlocks.Size() != 0) return false;
        return true;
    }


    private static Chunk CreateSeaChunk(ChunkPoint position) {
        return new Chunk(position, BlockDescription.Water);
    }


    public static bool IsDefaultSeaChunk(Chunk chunk) {
        if(chunk.DefaultBlockDefinition != BlockDescription.Water) return false;
        if(chunk.BlockCount != ChunkVolume) return false;
        if(chunk.BorderBlocks.Size() != 0) return false;
        if(chunk.InnerBlocks.Size() != 0) return false;
        if(chunk.EmptyBlocks.Size() != 0) return false;
        return true;
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


    public static bool IsDefaultSeaSurfaceChunk(Chunk chunk) {
        if(chunk.DefaultBlockDefinition != BlockDescription.Water) return false;
        if(chunk.BlockCount != ChunkVolume) return false;
        if(chunk.BorderBlocks.Size() != ChunkSize * ChunkSize) return false;   
        if(chunk.InnerBlocks.Size() > 0) return false;
        if(chunk.EmptyBlocks.Size() > 0) return false;
        return !chunk.IsModified();
    }


    public static Chunk CreateSkyChunk(ChunkPoint position) {
        return new Chunk(position);
    }


    private static bool IsDefaultSkyChunk(Chunk chunk) {
        if(chunk.DefaultBlockDefinition != BlockDescription.Air) return false;
        if(chunk.BlockCount != 0) return false;
        return true;
    }


}

