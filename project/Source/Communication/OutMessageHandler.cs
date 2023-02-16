namespace Eltisa.Communication; 

using System;
using Eltisa.Models;
using Eltisa.Tools;
using Eltisa.Server.Players;
using static Eltisa.Administration.Configuration;
using static Eltisa.Communication.Constant;


public static class OutMessageHandler {

    private static int messageCounter;


    public static void SendBlocksChangedNotification(WorldPoint position, Change[] changes) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((int)MessageId.BlocksChangedNotification);
        builder.WriteInt(messageCounter);
        builder.WriteInt(changes.Length);
        foreach(var change in changes) {
            builder.WriteInt(change.Position.X);
            builder.WriteInt(change.Position.Y);
            builder.WriteInt(change.Position.Z);
            builder.WriteUint(change.Block.GetData());
        }
        builder.WriteInt(EndTag);

        byte[] message = builder.ToArray();
        SendMessageToRange(message, position, ClientCacheBlockRadius);                        
    }



    public static void SendCreateResourceResponse(HomeSocket socket, WorldPoint position, ushort blockType, ResourceResponse result) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((int)MessageId.CreateResourceResponse);
        builder.WriteInt(messageCounter);
        builder.WriteInt(position.X);
        builder.WriteInt(position.Y);
        builder.WriteInt(position.Z);
        builder.WriteUShort(blockType);
        builder.WriteUShort((ushort)result);
        builder.WriteInt(EndTag);

        byte[] message = builder.ToArray();
        SendMessageTo(socket, message);                        
    }



    public static void SendReadResourceResponse(HomeSocket socket, WorldPoint position, ushort blockType, ResourceResult result, int targetId) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((int)MessageId.ReadResourceResponse);
        builder.WriteInt(messageCounter);
        builder.WriteInt(position.X);
        builder.WriteInt(position.Y);
        builder.WriteInt(position.Z);
        builder.WriteInt(targetId);
        builder.WriteUShort(blockType);
        builder.WriteUShort((ushort)result.Response);
        builder.WriteUShort(result.Resource != null ? (ushort)result.Resource.AccessRights : (ushort)0);
        builder.WriteUShort(result.Resource != null ? result.Resource.BlockType : (ushort)0);
        builder.WriteBytes(result.Resource?.Data);
        builder.WriteInt(EndTag);
        byte[] message = builder.ToArray();
        SendMessageTo(socket, message);                        
    }



    public static void SendWriteResourceResponse(HomeSocket socket, WorldPoint position, ushort blockType, ResourceResponse result) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((int)MessageId.WriteResourceResponse);
        builder.WriteInt(messageCounter);
        builder.WriteInt(position.X);
        builder.WriteInt(position.Y);
        builder.WriteInt(position.Z);
        builder.WriteUShort(blockType);
        builder.WriteUShort((ushort)result);
        builder.WriteInt(EndTag);

        byte[] message = builder.ToArray();
        SendMessageTo(socket, message);                        
    }


    public static void SendUpdateResourceResponse(HomeSocket socket, WorldPoint position, ushort blockType, ResourceResponse result) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((int)MessageId.UpdateResourceResponse);
        builder.WriteInt(messageCounter);
        builder.WriteInt(position.X);
        builder.WriteInt(position.Y);
        builder.WriteInt(position.Z);
        builder.WriteUShort(blockType);
        builder.WriteUShort((ushort)result);
        builder.WriteInt(EndTag);

        byte[] message = builder.ToArray();
        SendMessageTo(socket, message);                        
    }


    public static void SendDeleteResourceResponse(HomeSocket socket, WorldPoint position, ushort blockType, ResourceResponse result) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((int)MessageId.DeleteResourceResponse);
        builder.WriteInt(messageCounter);
        builder.WriteInt(position.X);
        builder.WriteInt(position.Y);
        builder.WriteInt(position.Z);
        builder.WriteUShort(blockType);
        builder.WriteUShort((ushort)result);
        builder.WriteInt(EndTag);

        byte[] message = builder.ToArray();
        SendMessageTo(socket, message);                        
    }



    ///////////////////////////////////////////////////////////////////////////////////////////////
    /// sender methods
    ///////////////////////////////////////////////////////////////////////////////////////////////

    public static void SendMessageTo(HomeSocket socket, byte[] message) {
        socket.SendMessageAsync(message);
    }


    public static void SendMessageToAll(byte[] message) {
        foreach(var actor in ActorStore.GetActors()) {
            actor.Socket?.SendMessageAsync(message);
        }
    }
    

    public static void SendMessageToAll(byte[] message, Actor excludeActor ) {
        foreach(var actor in ActorStore.GetActors()) {
            if(actor == excludeActor) continue;
            actor.Socket?.SendMessageAsync(message);
        }
    }
    

    public static void SendMessageToRange(byte[] message, WorldPoint pos, int chebishevDistance ) {
        foreach(var actor in ActorStore.GetActors()) {
            if(actor.Position.ChebishevDistanceIsSmallerThan(pos, chebishevDistance)) {
                actor.Socket?.SendMessageAsync(message);
            }
        }
    }
    

    public static void SendMessageToRange(byte[] message, WorldPoint pos, int chebishevDistance, Actor excludeActor ) {
        foreach(var actor in ActorStore.GetActors()) {
            if(actor == excludeActor) continue;
            if(actor.Position.ChebishevDistanceIsSmallerThan(pos, chebishevDistance)) {
                actor.Socket?.SendMessageAsync(message);
            }
        }
    }
 
}