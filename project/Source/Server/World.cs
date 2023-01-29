namespace Eltisa.Server; 

using System;
using System.Text;
using Eltisa.Models;
using Eltisa.Tools;
using Eltisa.Administration;
using Eltisa.Server.Blocks;
using static Eltisa.Administration.Configuration;
using static Eltisa.Models.Constants;
using Eltisa.Server.Resources;

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
    private static BlockControl    blockController;
    private static BlockPermit     blockPermit;
    private static BlockNotify     blockNotify;


    private static ResourcePersister resourcePersister;
    private static ResourceCache     resourceCache;
    private static ResourceControl   resourceControl;


    public static void Initialize(string regionDirectory, string resourceDirectory) {
        regionPersister      = new RegionPersister(regionDirectory);
        regionCreator        = new RegionCreator(regionPersister);
        regionCache          = new RegionCache(regionCreator);
        blockProvider        = new BlockProvider(regionCache);
        blockController      = new BlockControl(blockProvider);
        blockPermit          = new BlockPermit(blockController);
        blockNotify          = new BlockNotify(blockPermit);

        resourcePersister    = new ResourcePersister(regionDirectory);
        resourceCache        = new ResourceCache(resourcePersister);
        resourceControl      = new ResourceControl(resourceCache);
    }


    static World() {
        Initialize(Configuration.RegionDirectory, Configuration.ResourceDirectory);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // block services
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
    // resource services
    ///////////////////////////////////////////////////////////////////////////////////////////

    public static string ReadText(WorldPoint blockPosition, int requestedType, string password=null) {
        return resourcePersister.ReadText(blockPosition, requestedType, password);
    }


    public static void WriteText(WorldPoint blockPosition, int type, string text, string password="", string newPassword="") {
        resourcePersister.WriteText(blockPosition, type, text, password, newPassword);
    }




    public static ResourceResponse CreateResource(Actor actor, WorldPoint pos, int blockType, string password, byte[] data) {
        return resourceControl.CreateResource(actor, pos, blockType, password, data);
    }

    public static ResourceResult ReadResource(Actor actor, WorldPoint pos, int blockType, string password) {
        return resourceControl.ReadResource(actor, pos, blockType, password);
    }

    public static ResourceResponse WriteResource(Actor actor, WorldPoint pos, int blockType, string password, byte[] data) {
        return resourceControl.WriteResource(actor, pos, blockType, password, data);
    }

    public static ResourceResponse UpdateResource(Actor actor, WorldPoint pos, int blockType, string password, string newPassword, byte[] newData) {
        return resourceControl.UpdateResource(actor, pos, blockType, password, newPassword, newData);
    }

    public static ResourceResponse DeleteResource(Actor actor, WorldPoint pos, int blockType, string password) {
        return resourceControl.DeleteResource(actor, pos, blockType, password);
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
        regionCache.FreeRegions(100, RegionReleaseTime);
    }        



    public static void StartMaintenanceThread() {
        maintenanceThread.Start();
    }


    public static void StopMaintenanceThread() {
        maintenanceThread.RequestStop();
    }

}