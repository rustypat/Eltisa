namespace Eltisa.Communication; 

using System;
using Eltisa.Models;
using Eltisa.Tools;
using Eltisa.Server.Players;
using static Eltisa.Administration.Configuration;
using static Eltisa.Communication.Constant;
using System.Collections.Generic;

public static class OutMessageHandler {

    private static int messageCounter;



    public static void SendActorListResponse(HomeSocket socket, IEnumerable<Actor> actors, int count) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt(   (int)MessageId.ListActorsResponse);
        builder.WriteInt(   messageCounter);
        builder.WriteInt(   count);
        foreach(var actor in actors) {
            builder.WriteString(actor.Name);         
        }
        builder.WriteInt(   EndTag);

        byte[] message = builder.ToArray();
        SendMessageTo(socket, message);
    }


    public static void SendActorMovedNotificationToRange(Actor actor) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt(   (int)MessageId.ActorMoved);
        builder.WriteInt(   messageCounter);
        builder.WriteInt(   actor.ID);
        builder.WriteFloat( actor.PositionX);
        builder.WriteFloat( actor.PositionY);
        builder.WriteFloat( actor.PositionZ);
        builder.WriteFloat( actor.RotationY);
        builder.WriteInt(   EndTag);

        byte[] message = builder.ToArray();
        var pos = new WorldPoint(actor.PositionX, actor.PositionY, actor.PositionZ);
        SendMessageToRange(message, pos, ClientCacheBlockRadius, actor);
    }


    public static void SendActorJoinedNotification(Actor actor) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt(   (int)MessageId.ActorJoined);
        builder.WriteInt(   messageCounter);
        builder.WriteInt(   actor.ID);
        builder.WriteInt(   (int)actor.ActorType);
        builder.WriteInt(   actor.Color);
        builder.WriteString(actor.Name);         
        builder.WriteInt(   EndTag);

        byte[] message = builder.ToArray();
        SendMessageToAll(message);
    }


    public static void SendActorLeftNotification(Actor actor) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt(   (int)MessageId.ActorLeft);
        builder.WriteInt(   messageCounter);
        builder.WriteInt(   actor.ID);
        builder.WriteString(actor.Name);         
        builder.WriteInt(   EndTag);
        byte[] message = builder.ToArray();
        SendMessageToAll(message);
    }



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