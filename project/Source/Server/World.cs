namespace Eltisa.Server; 

using System;
using System.Text;
using Eltisa.Models;
using Eltisa.Tools;
using Eltisa.Administration;
using Eltisa.Server.Blocks;
using static Eltisa.Administration.Configuration;
using static Eltisa.Models.Constants;


static public class World {

    private static readonly PeriodicThread maintenanceThread = new PeriodicThread(RegionStoreTime, () => {
        Persist();
        FreeCache();
    });

    private static readonly Object changeLock = new Object();

    private static RegionPersister regionPersister;
    private static RegionCreator   regionCreator;
    private static RegionCache     regionCache;
    private static BlockProvider   blockProvider;
    private static BlockController blockController;
    private static BlockPermit     blockPermit;
    private static BlockNotify     blockNotify;


    public static void Initialize(string regionDirectory) {
        regionPersister = new RegionPersister(regionDirectory);
        regionCreator   = new RegionCreator(regionPersister);
        regionCache     = new RegionCache(regionCreator);
        blockProvider   = new BlockProvider(regionCache);
        blockController = new BlockController(blockProvider);
        blockPermit     = new BlockPermit(blockController);
        blockNotify     = new BlockNotify(blockPermit);
    }


    static World() {
        Initialize(Configuration.RegionDirectory);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // change
    ///////////////////////////////////////////////////////////////////////////////////////////


    public static Change[] AddBlock(Actor actor, WorldPoint pos, ushort blockInfo) {    
        if(pos.IsNotAPoint())  return NoChanges;
        lock(changeLock) {
            return blockNotify.CreateBlock(actor, pos, blockInfo);
        }
    }


    public static Change[] RemoveVisibleBlock(Actor actor, WorldPoint pos) {    
        if(pos.IsNotAPoint())  return NoChanges;
        lock(changeLock) {
            return blockNotify.DeleteBlock(actor, pos);
            // TODO if block has resource, delete it
        }
    }


    public static Change[] ChangeStateOfVisibleBlock(Actor actor, WorldPoint pos, ushort blockInfo) {    
        if(pos.IsNotAPoint())  return NoChanges;
        lock(changeLock) {
            return blockNotify.UpdateBlock(actor, pos, blockInfo);
        }
    }


    public static Change[] SwitchBlocks(Actor actor, WorldPoint[] positions) {    
        lock(changeLock) {
            return blockNotify.SwitchBlocks(actor, positions);
        }
    }


    public static void ClearChunk(WorldPoint pos) {
        throw new NotImplementedException();
    }


    public static Chunk GetChunk(Actor actor, RegionPoint regionPos, ChunkPoint chunkPos) {
        if(regionPos.IsNotAPoint())  return null;
        if(chunkPos.IsNotAPoint())  return null;
        return blockNotify.ReadChunk(actor, regionPos, chunkPos);
    }


    public static Block GetBlock(Actor actor, WorldPoint pos) {
        if(pos.IsNotAPoint())  return BlockDescription.NoBlock;
        return blockNotify.ReadBlock(actor, pos);
    }


    public static string GetDescription() {
        StringBuilder sb = new StringBuilder();
        sb.AppendLine();
        sb.AppendLine("Regions loaded:  NOT IMPLEMENTED");
        sb.AppendLine("Regions changed: NOT IMPLEMENTED");
        return sb.ToString();
    }



    ///////////////////////////////////////////////////////////////////////////////////////////
    // persist
    ///////////////////////////////////////////////////////////////////////////////////////////


    public static int Persist() {
        lock(changeLock) {
            #if DEBUG
                return regionCache.WriteRegions(true);
            #else
                return regionCache.WriteRegions(false);
            #endif                                                
        }
    }


    public static void FreeCache() {
        regionCache.FreeUnusedRegions(100, RegionReleaseTime);
    }        



    public static void StartMaintenanceThread() {
        maintenanceThread.Start();
    }


    public static void StopMaintenanceThread() {
        maintenanceThread.RequestStop();
    }

}