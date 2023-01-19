namespace Eltisa.Source.Server; 

using System;
using Eltisa.Source.Models;


public readonly record struct ChangedBlock(WorldPoint position, Block newBlock);



public interface IBlockAccess {
    ChangedBlock[] CreateBlock(Actor actor, WorldPoint worldPos, ushort blockInfo);
    Block ReadBlock(Actor actor, WorldPoint location);
    Chunk ReadChunk(Actor actor, WorldPoint location);
    ChangedBlock[] UpdateBlock(Actor actor, WorldPoint worldPos, ushort newBlockState);
    ChangedBlock[] SwitchBlocks(Actor actor, params WorldPoint[] worldPositions);
    ChangedBlock[] DeleteBlock(Actor actor, WorldPoint location);
}


