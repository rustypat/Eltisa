namespace Eltisa.Server; 

using System;
using System.Text;
using Eltisa.Models;
using Eltisa.Tools;
using Eltisa.Administration;
using Eltisa.Server.Blocks;
using Eltisa.Server.Resources;
using Eltisa.Communication;
using static Eltisa.Administration.Configuration;

static public class World {

    private static BlockServer      blockServer;
    private static ResourceServer   resourceServer;
    private static ChatServer       chatServer;
    private static VideoChatServer  videoChatServer;


    private static readonly PeriodicThread maintenanceThread = new PeriodicThread(CacheStoreTime, () => {
        blockServer.Persist();
        resourceServer.Persist();
        blockServer.FreeCache(100, CacheReleaseTime);
        resourceServer.FreeCache(100, CacheReleaseTime);
    });


    public static void Initialize(string regionDirectory, string resourceDirectory) {
        blockServer           = new BlockServer(regionDirectory);
        resourceServer        = new ResourceServer(resourceDirectory);
        chatServer            = new ChatServer();
        videoChatServer       = new VideoChatServer();
    }


    static World() {
        Initialize(Configuration.RegionDirectory, Configuration.ResourceDirectory);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // block services
    ///////////////////////////////////////////////////////////////////////////////////////////


    public static Change[] AddBlock(Actor actor, WorldPoint pos, ushort blockInfo) {    
        return blockServer.CreateBlock(actor, pos, blockInfo);
    }


    public static Change[] RemoveVisibleBlock(Actor actor, WorldPoint pos) {    
        return blockServer.DeleteBlock(actor, pos);
        // TODO if block has resource, delete it
    }


    public static Change[] ChangeStateOfVisibleBlock(Actor actor, WorldPoint pos, ushort blockInfo) {    
        return blockServer.UpdateBlock(actor, pos, blockInfo);
    }


    public static Change[] SwitchBlocks(Actor actor, WorldPoint[] positions) {    
        return blockServer.SwitchBlocks(actor, positions);
    }


    public static void ClearChunk(WorldPoint pos) {
        throw new NotImplementedException();
    }


    public static Chunk GetChunk(Actor actor, RegionPoint regionPos, ChunkPoint chunkPos) {
        return blockServer.ReadChunk(actor, regionPos, chunkPos);
    }


    public static Block GetBlock(Actor actor, WorldPoint pos) {
        return blockServer.ReadBlock(actor, pos);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // resource services
    ///////////////////////////////////////////////////////////////////////////////////////////


    public static ResourceResponse CreateResource(Actor actor, WorldPoint pos, ushort blockType, string password, byte[] data) {
        return resourceServer.CreateResource(actor, pos, blockType, password, data);
    }

    public static ResourceResult ReadResource(Actor actor, WorldPoint pos, ushort blockType, string password) {
        return resourceServer.ReadResource(actor, pos, blockType, password);
    }

    public static ResourceResponse WriteResource(Actor actor, WorldPoint pos, ushort blockType, string password, byte[] data) {
        return resourceServer.WriteResource(actor, pos, blockType, password, data);
    }

    public static ResourceResponse UpdateResource(Actor actor, WorldPoint pos, ushort blockType, string password, string newPassword, byte[] newData) {
        return resourceServer.UpdateResource(actor, pos, blockType, password, newPassword, newData);
    }

    public static ResourceResponse DeleteResource(Actor actor, WorldPoint pos, ushort blockType, string password) {
        return resourceServer.DeleteResource(actor, pos, blockType, password);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // chat services
    ///////////////////////////////////////////////////////////////////////////////////////////

    public static void SendChatMessage(Actor sender, string message) {
        chatServer.SendChatMessage(sender, message);
    }


    public static void HandleVideoChatMessage(HomeSocket senderSocket, int vcMessageType, string receiverName, string jsonMessage) {
        videoChatServer.HandleVideoChatMessage(senderSocket, vcMessageType, receiverName, jsonMessage);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////
    // varia
    ///////////////////////////////////////////////////////////////////////////////////////////

    public static void Persist() {
        blockServer.Persist();
        resourceServer.Persist();       
    }

 
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