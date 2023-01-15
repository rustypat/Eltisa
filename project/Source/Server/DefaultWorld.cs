namespace Eltisa.Source.Server; 

using System;
using Eltisa.Source.Models;
using static Eltisa.Source.Administration.Configuration;


public static class DefaultWorld {

    private static Random rand = new Random();

    public const int SeaLevel   = 32;    // in world coordinates
    public const int SeaBottom  = 0;
    public const int RockBottom = -WorldRadiusVertical+16;


    public static Chunk CreateChunk(WorldPoint position) {
        int y = position.GetChunkPointY();

        if( y == - ChunkRadiusVertical ) return CreateMagmaChunk(position.GetChunkPoint());
        else if( y  < 0 )                return CreateEarthChunk(position.GetChunkPoint());
        else if( y == 0 )                return CreateSeaChunk(position.GetChunkPoint());
        else if( y == 1 )                return CreateSeaSurfaceChunk(position.GetChunkPoint());
        else if( y  > 0 )                return CreateSkyChunk(position.GetChunkPoint());
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
        return new Chunk(position, BlockTypes.Lava);
    }


    private static bool IsModifiedMagmaChunk(Chunk chunk) {
        if(chunk.DefaultBlockDefinition != BlockTypes.Lava) return true;
        return chunk.IsModified();
    }


    private static Chunk CreateEarthChunk(ChunkPoint position) {
        return new Chunk(position, BlockTypes.Stone);
    }


    private static bool IsModifiedEarthChunk(Chunk chunk) {
        if(chunk.DefaultBlockDefinition != BlockTypes.Stone) return true;
        return chunk.IsModified();
    }


    private static Chunk CreateSeaChunk(ChunkPoint position) {
        return new Chunk(position, BlockTypes.Water);
    }


    private static bool IsModifiedSeaChunk(Chunk chunk) {
        if(chunk.DefaultBlockDefinition != BlockTypes.Water) return true;
        return chunk.IsModified();
    }


    private static Chunk CreateSeaSurfaceChunk(ChunkPoint position) {
        Chunk seaChunk = new Chunk(position, BlockTypes.Water);

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
        if(chunk.DefaultBlockDefinition != BlockTypes.Water) return true;
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
        if(chunk.DefaultBlockDefinition != BlockTypes.NoBlock) return true;
        return chunk.IsModified();
    }


    public static Block GetBlock(WorldPoint position) {
        if(     position.Y == SeaLevel-1) return new Block(position.GetBlockPoint(), BlockTypes.Water, Block.Faces.Top);
        else if(position.Y >= SeaLevel  ) return BlockTypes.NotABlock;
        else if(position.Y >= SeaBottom ) return new Block(position.GetBlockPoint(), BlockTypes.Water, Block.NoFaces);
        else if(position.Y >= RockBottom) return new Block(position.GetBlockPoint(), BlockTypes.Stone, Block.NoFaces);
        else                              return new Block(position.GetBlockPoint(), BlockTypes.Lava,  Block.NoFaces);
    }


    public static bool HasSolidBlock(WorldPoint position) {
        return position.Y < SeaLevel;
    }
}

