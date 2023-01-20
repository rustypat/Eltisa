namespace Eltisa.Source.Server.Blocks; 

using System;
using Eltisa.Source.Models;



public interface IBlockAccess {
    Changed[] CreateBlock(Actor actor, WorldPoint worldPos, ushort blockInfo);
    Block ReadBlock(Actor actor, WorldPoint location);
    Chunk ReadChunk(Actor actor, WorldPoint location);
    Changed[] UpdateBlock(Actor actor, WorldPoint worldPos, ushort newBlockState);
    Changed[] SwitchBlocks(Actor actor, params WorldPoint[] worldPositions);
    Changed[] DeleteBlock(Actor actor, WorldPoint location);
}


