namespace Eltisa.Server.Blocks; 

using System;
using Eltisa.Models;
using static Eltisa.Models.Constants;


public class BlockServer : IBlockAccess {
    private static readonly Object changeLock = new Object();

    private RegionPersister regionPersister;
    private RegionCreator   regionCreator;
    private RegionCache     regionCache;
    private BlockProvider   blockProvider;
    private BlockControl    blockController;
    private BlockPermit     blockPermit;
    private BlockNotify     blockNotify;

    public BlockServer(string regionDirectory) {
        regionPersister      = new RegionPersister(regionDirectory);
        regionCreator        = new RegionCreator(regionPersister);
        regionCache          = new RegionCache(regionCreator);
        blockProvider        = new BlockProvider(regionCache);
        blockController      = new BlockControl(blockProvider);
        blockPermit          = new BlockPermit(blockController);
        blockNotify          = new BlockNotify(blockPermit);
    }

    public Change[] CreateBlock(Actor actor, WorldPoint pos, ushort blockInfo) {    
        if(pos.IsNotAPoint())  return NoChanges;
        lock(changeLock) {
            return blockNotify.CreateBlock(actor, pos, blockInfo);
        }
    }


    public Change[] DeleteBlock(Actor actor, WorldPoint pos) {    
        if(pos.IsNotAPoint())  return NoChanges;
        lock(changeLock) {
            return blockNotify.DeleteBlock(actor, pos);
        }
    }


    public Change[] UpdateBlock(Actor actor, WorldPoint pos, ushort blockInfo) {    
        if(pos.IsNotAPoint())  return NoChanges;
        lock(changeLock) {
            return blockNotify.UpdateBlock(actor, pos, blockInfo);
        }
    }


    public Change[] SwitchBlocks(Actor actor, WorldPoint[] positions) {    
        lock(changeLock) {
            return blockNotify.SwitchBlocks(actor, positions);
        }
    }


    public Chunk ReadChunk(Actor actor, RegionPoint regionPos, ChunkPoint chunkPos) {
        if(regionPos.IsNotAPoint())  return null;
        if(chunkPos.IsNotAPoint())  return null;
        return blockNotify.ReadChunk(actor, regionPos, chunkPos);
    }


    public Block ReadBlock(Actor actor, WorldPoint pos) {
        if(pos.IsNotAPoint())  return BlockDescription.NoBlock;
        return blockNotify.ReadBlock(actor, pos);
    }


    public void     Persist()  {
        lock(changeLock) {
            regionCache.PersistRegions();
        }
    }  


    public void FreeCache(int regionsToKeep, int unusedSinceMilliseconds) {
        regionCache.FreeRegions(regionsToKeep, unusedSinceMilliseconds);
    }
}