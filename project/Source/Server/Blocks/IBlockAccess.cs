namespace Eltisa.Server.Blocks; 

using System;
using Eltisa.Models;



public interface IBlockAccess {
    Change[] CreateBlock(Actor actor, WorldPoint worldPos, ushort blockInfo);
    Block ReadBlock(Actor actor, WorldPoint location);
    Chunk ReadChunk(Actor actor, RegionPoint regionPos, ChunkPoint chunkPos);
    Change[] UpdateBlock(Actor actor, WorldPoint worldPos, ushort newBlockState);
    Change[] SwitchBlocks(Actor actor, params WorldPoint[] worldPositions);
    Change[] DeleteBlock(Actor actor, WorldPoint location);
}


