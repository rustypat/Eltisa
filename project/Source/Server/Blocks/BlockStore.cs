namespace Eltisa.Server.Blocks; 

using System;
using Eltisa.Communication;
using Eltisa.Models;
using static Eltisa.Models.Constants;


public class BlockStore : IBlockAccess {
    private RegionPersister regionPersister;
    private RegionCreator   regionCreator;
    private RegionCache     regionCache;
    private BlockProvider   blockProvider;
    private BlockControl    blockController;
    private BlockPermit     blockPermit;
    private BlockNotify     blockNotify;

    public BlockStore(string regionDirectory) {
        regionPersister      = new RegionPersister(regionDirectory);
        regionCreator        = new RegionCreator(regionPersister);
        regionCache          = new RegionCache(regionCreator);
        blockProvider        = new BlockProvider(regionCache);
        blockController      = new BlockControl(blockProvider);
        blockPermit          = new BlockPermit(blockController);
        blockNotify          = new BlockNotify(blockPermit);
    }

    public Change[] CreateBlock(Actor actor, WorldPoint worldPos, ushort blockInfo)      => blockNotify.CreateBlock(actor, worldPos, blockInfo);
    public Change[] DeleteBlock(Actor actor, WorldPoint location)                        => blockNotify.DeleteBlock(actor, location);
    public Block    ReadBlock(Actor actor, WorldPoint location)                          => blockNotify.ReadBlock(actor, location);
    public Chunk    ReadChunk(Actor actor, RegionPoint regionPos, ChunkPoint chunkPos)   => blockNotify.ReadChunk(actor, regionPos, chunkPos);
    public Change[] SwitchBlocks(Actor actor, params WorldPoint[] worldPositions)        => blockNotify.SwitchBlocks(actor, worldPositions);
    public Change[] UpdateBlock(Actor actor, WorldPoint worldPos, ushort newBlockState)  => blockNotify.UpdateBlock(actor, worldPos, newBlockState);
    public void     Persist()                                                            => regionCache.PersistRegions();
    public void     FreeCache(int regionsToKeep, int unusedSinceMilliseconds)            => regionCache.FreeRegions(regionsToKeep, unusedSinceMilliseconds);
}