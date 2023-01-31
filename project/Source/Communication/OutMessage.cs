namespace Eltisa.Communication; 

using System;
using System.Collections.Generic;
using Eltisa.Models;
using Eltisa.Tools;
using static System.Diagnostics.Debug;
using static Eltisa.Communication.Constant;


public static class OutMessage {

    public enum ActorChange { Login=1, Moved=2, Logout=3 };


    private static int messageCounter;


    public static byte[] createActorListMessage(IEnumerable<Actor> actors, int count) {
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
        return message;
    }


    public static byte[] createActorChangedMessage(Actor actor, ActorChange change) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt(   (int)MessageId.ActorChanged);
        builder.WriteInt(   messageCounter);
        builder.WriteInt(   (int)change);            
        builder.WriteInt(   actor.ID);
        builder.WriteString(actor.Name);         
        builder.WriteInt(   actor.Color);
        builder.WriteFloat( actor.PositionX);
        builder.WriteFloat( actor.PositionY);
        builder.WriteFloat( actor.PositionZ);
        builder.WriteFloat( actor.RotationY);
        builder.WriteInt(   EndTag);

        byte[] message = builder.ToArray();
        return message;
    }


    public static byte[] createLoginMessage(Actor actor, string errorMessage) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((byte)MessageId.LoginResponse);
        builder.WriteInt(messageCounter);
        if(actor != null) {
            builder.WriteInt(actor.ID);
            builder.WriteInt((int)actor.ActorType);
            builder.WriteString(actor.Name);     
            builder.WriteInt(actor.Color);    
        }
        else {
            builder.WriteInt(-1);
            builder.WriteInt((int)Actor.Type.NoActor);
            builder.WriteString(errorMessage);     
            builder.WriteInt(0);    
        }
        builder.WriteInt(EndTag);

        byte[] message = builder.ToArray();
        return message;
    }


    public static byte[] createChunksMessage(int requestId, RegionPoint[] positions, Chunk[] chunks, int chunkCount) {
        messageCounter += 1;
        Assert(positions.Length == chunks.Length);

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((int)MessageId.GetChunksResponse);
        builder.WriteInt(messageCounter);
        builder.WriteInt(requestId);
        builder.WriteInt(chunkCount);
        int chunkWritenCount = 0;
        for(int i=0; i < chunks.Length; i++) {
            var chunk = chunks[i];
            if(chunk == null) continue;
            
            var regionPosition   = positions[i];                
            chunkWritenCount++;

            // chunk position
            builder.WriteInt( regionPosition.Data );
            builder.WriteUShort( chunk.Position.Data );

            // visible block data
            builder.WriteUShort( (ushort) (chunk.BorderBlocks.Size()) );
            builder.WriteInt( chunk.TransparentBlocks.Size() );
            foreach(Block block in chunk.BorderBlocks.GetBlocks()) {
                builder.WriteUint(block.GetData());
            }
            foreach(Block block in chunk.TransparentBlocks.GetBlocks()) {
                builder.WriteUint(block.GetData());
            }
        }
        Assert(chunkCount == chunkWritenCount);
        builder.WriteInt(EndTag);

        byte[] message = builder.ToArray();
        return message;
    }


    public static byte[] createChatMessage(string sender, string text) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((byte)MessageId.ChatMessageResponse);
        builder.WriteInt(messageCounter);
        builder.WriteString(text);
        builder.WriteString(sender);
        builder.WriteInt(EndTag);

        byte[] message = builder.ToArray();
        return message;
    }


    public static byte[] createBlocksChangedMessage(Change[] changes) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((byte)MessageId.BlocksChangedNotification);
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
        return message;
    }


    public static byte[] createVideoChatMessage(string sender, string receiver, int messageType, string jsonMessage) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((byte)MessageId.VideoChatMessageResponse);
        builder.WriteInt(messageCounter);
        builder.WriteString(sender);
        builder.WriteString(receiver);            
        builder.WriteInt(messageType);
        builder.WriteString(jsonMessage);
        builder.WriteInt(EndTag);

        byte[] videoChatMessage = builder.ToArray();
        return videoChatMessage;
    }


}