namespace Eltisa.Server; 

using System;
using System.Text;
using Eltisa.Models;
using Eltisa.Tools;
using Eltisa.Administration;
using Eltisa.Server.Blocks;
using Eltisa.Server.Resources;
using static Eltisa.Administration.Configuration;
using static Eltisa.Models.Constants;

static public class World {

    private static readonly PeriodicThread maintenanceThread = new PeriodicThread(CacheStoreTime, () => {
        blockStore.Persist();
        resourceStore.Persist();
        blockStore.FreeCache(100, CacheReleaseTime);
        resourceStore.FreeCache(100, CacheReleaseTime);
     });

    private static BlockStore      blockStore;
    private static ResourceStore   resourceStore;


    public static void Initialize(string regionDirectory, string resourceDirectory) {
        blockStore           = new BlockStore(regionDirectory);
        resourceStore        = new ResourceStore(resourceDirectory);
    }


    static World() {
        Initialize(Configuration.RegionDirectory, Configuration.ResourceDirectory);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // block services
    ///////////////////////////////////////////////////////////////////////////////////////////


    public static Change[] AddBlock(Actor actor, WorldPoint pos, ushort blockInfo) {    
        return blockStore.CreateBlock(actor, pos, blockInfo);
    }


    public static Change[] RemoveVisibleBlock(Actor actor, WorldPoint pos) {    
        return blockStore.DeleteBlock(actor, pos);
        // TODO if block has resource, delete it
    }


    public static Change[] ChangeStateOfVisibleBlock(Actor actor, WorldPoint pos, ushort blockInfo) {    
        return blockStore.UpdateBlock(actor, pos, blockInfo);
    }


    public static Change[] SwitchBlocks(Actor actor, WorldPoint[] positions) {    
        return blockStore.SwitchBlocks(actor, positions);
    }


    public static void ClearChunk(WorldPoint pos) {
        throw new NotImplementedException();
    }


    public static Chunk GetChunk(Actor actor, RegionPoint regionPos, ChunkPoint chunkPos) {
        return blockStore.ReadChunk(actor, regionPos, chunkPos);
    }


    public static Block GetBlock(Actor actor, WorldPoint pos) {
        return blockStore.ReadBlock(actor, pos);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // resource services
    ///////////////////////////////////////////////////////////////////////////////////////////


    public static ResourceResponse CreateResource(Actor actor, WorldPoint pos, ushort blockType, string password, byte[] data) {
        return resourceStore.CreateResource(actor, pos, blockType, password, data);
    }

    public static ResourceResult ReadResource(Actor actor, WorldPoint pos, ushort blockType, string password) {
        return resourceStore.ReadResource(actor, pos, blockType, password);
    }

    public static ResourceResponse WriteResource(Actor actor, WorldPoint pos, ushort blockType, string password, byte[] data) {
        return resourceStore.WriteResource(actor, pos, blockType, password, data);
    }

    public static ResourceResponse UpdateResource(Actor actor, WorldPoint pos, ushort blockType, string password, string newPassword, byte[] newData) {
        return resourceStore.UpdateResource(actor, pos, blockType, password, newPassword, newData);
    }

    public static ResourceResponse DeleteResource(Actor actor, WorldPoint pos, ushort blockType, string password) {
        return resourceStore.DeleteResource(actor, pos, blockType, password);
    }



    ///////////////////////////////////////////////////////////////////////////////////////////
    // persist
    ///////////////////////////////////////////////////////////////////////////////////////////


 
    public static void StartMaintenanceThread() {
        maintenanceThread.Start();
    }


    public static void StopMaintenanceThread() {
        maintenanceThread.RequestStop();
    }


    public static string GetDescription() {
        StringBuilder sb = new StringBuilder();
        sb.AppendLine();
        sb.AppendLine("Regions loaded:  NOT IMPLEMENTED");
        sb.AppendLine("Regions changed: NOT IMPLEMENTED");
        return sb.ToString();
    }

}