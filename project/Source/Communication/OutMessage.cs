namespace Eltisa.Communication; 

using System;
using System.Collections.Generic;
using Eltisa.Models;
using Eltisa.Tools;
using static System.Diagnostics.Debug;


public static class OutMessage {

    public enum ActorChange { Login=1, Moved=2, Logout=3 };

    const int EndTag = 666999;

    private enum OutMessageType{
        Login            = 11,
        ActorChanged     = 21,
        ActorList        = 23,
        Chunks           = 31,
        BlockAdded       = 33,
        BlockRemoved     = 35,
        BlocksChanged    = 37,
        Chat             = 41,
        VideoChat        = 43,
        BlockResource    = 51
    }

    private static int messageCounter;


    public static byte[] createActorListMessage(IEnumerable<Actor> actors, int count) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt(   (int)OutMessageType.ActorList);
        builder.WriteInt(   messageCounter);
        builder.WriteInt(   count);
        foreach(var actor in actors) {
            builder.WriteString(actor.Name);         
        }
        builder.WriteInt(   EndTag);

        byte[] message = builder.ToArray();
        Log.Trace("send message " + messageCounter + " actor list, length " + message.Length);
        return message;
    }


    public static byte[] createActorChangedMessage(Actor actor, ActorChange change) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt(   (int)OutMessageType.ActorChanged);
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
        Log.Trace("send message " + messageCounter + " move actor, length " + message.Length);
        return message;
    }


    public static byte[] createActorLogoutMessage(Actor actor) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt(   (int)OutMessageType.ActorChanged);
        builder.WriteInt(   messageCounter);
        builder.WriteInt(   (int)ActorChange.Logout);            
        builder.WriteInt(   actor.ID);
        builder.WriteString(actor.Name);         
        builder.WriteInt(   actor.Color);
        builder.WriteFloat( float.MaxValue);
        builder.WriteFloat( float.MaxValue);
        builder.WriteFloat( float.MaxValue);
        builder.WriteFloat( float.MaxValue);
        builder.WriteInt(   EndTag);

        byte[] message = builder.ToArray();
        Log.Trace("send message " + messageCounter + " delete actor, length " + message.Length);
        return message;
    }


    public static byte[] createLoginMessage(Actor actor, string errorMessage) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((byte)OutMessageType.Login);
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
        Log.Trace("send message " + messageCounter + " login reply, length " + message.Length);
        return message;
    }


    public static byte[] createChunksMessage(int requestId, RegionPoint[] positions, Chunk[] chunks, int chunkCount) {
        messageCounter += 1;
        Assert(positions.Length == chunks.Length);

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((int)OutMessageType.Chunks);
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
        Log.Trace("send message " + messageCounter + " chunk descriptions, length " + message.Length);
        return message;
    }


    public static byte[] createChatMessage(string sender, string text) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((byte)OutMessageType.Chat);
        builder.WriteInt(messageCounter);
        builder.WriteString(text);
        builder.WriteString(sender);
        builder.WriteInt(EndTag);

        byte[] message = builder.ToArray();
        Log.Trace("send message " + messageCounter + " chat message, length " + message.Length);
        return message;
    }


    public static byte[] createBlockAddedMessage(WorldPoint blockPos, Block block) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((byte)OutMessageType.BlockAdded);
        builder.WriteInt(messageCounter);
        builder.WriteInt(blockPos.X);
        builder.WriteInt(blockPos.Y);
        builder.WriteInt(blockPos.Z);
        builder.WriteUint(block.GetData());
        builder.WriteInt(EndTag);

        byte[] message = builder.ToArray();
        Log.Trace("send message " + messageCounter + " block added, length " + message.Length);
        return message;
    }


    public static byte[] createBlocksChangedMessage(WorldPoint blockPos, Block block) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((byte)OutMessageType.BlocksChanged);
        builder.WriteInt(messageCounter);
        builder.WriteInt(1);
        builder.WriteInt(blockPos.X);
        builder.WriteInt(blockPos.Y);
        builder.WriteInt(blockPos.Z);
        builder.WriteUint(block.GetData());
        builder.WriteInt(EndTag);

        byte[] message = builder.ToArray();
        Log.Trace("send message " + messageCounter + " blocks changed, length " + message.Length);
        return message;
    }


    public static byte[] createBlocksChangedMessage(int changedCount, WorldPoint[] positions, Block[] blocks) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((byte)OutMessageType.BlocksChanged);
        builder.WriteInt(messageCounter);
        builder.WriteInt(0);                 // fill in for change type
        builder.WriteInt(changedCount);
        for(int i=0; i < changedCount; i++) {
            WorldPoint pos   = positions[i];
            Block      block = blocks[i];
            builder.WriteInt(pos.X);
            builder.WriteInt(pos.Y);
            builder.WriteInt(pos.Z);
            builder.WriteUint(block.GetData());
        }
        builder.WriteInt(EndTag);

        byte[] message = builder.ToArray();
        Log.Trace("send message " + messageCounter + " blocks changed, length " + message.Length);
        return message;
    }


    public static byte[] createBlocksChangedMessage(Change[] changes) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((byte)OutMessageType.BlocksChanged);
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
        Log.Trace("send message " + messageCounter + " blocks changed, length " + message.Length);
        return message;
    }


    public static byte[] createBlockRemovedMessage(WorldPoint blockPos, Block[] neighbours) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((byte)OutMessageType.BlockRemoved);
        builder.WriteInt(messageCounter);
        builder.WriteInt(blockPos.X);
        builder.WriteInt(blockPos.Y);
        builder.WriteInt(blockPos.Z);
        foreach(Block block in neighbours) {
            builder.WriteUint(block.GetData());
        }
        builder.WriteInt(EndTag);

        byte[] message = builder.ToArray();
        Log.Trace("send message " + messageCounter + " block removed, length " + message.Length);
        return message;
    }


    public static byte[] createVideoChatMessage(string sender, string receiver, int messageType, string jsonMessage) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((byte)OutMessageType.VideoChat);
        builder.WriteInt(messageCounter);
        builder.WriteString(sender);
        builder.WriteString(receiver);            
        builder.WriteInt(messageType);
        builder.WriteString(jsonMessage);
        builder.WriteInt(EndTag);

        byte[] videoChatMessage = builder.ToArray();
        Log.Trace("send message " + messageCounter + " video chat message, length " + videoChatMessage.Length);
        return videoChatMessage;
    }


    public static byte[] createBlockResourceMessage(WorldPoint blockPos, int type, string text) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((byte)OutMessageType.BlockResource);
        builder.WriteInt(messageCounter);
        builder.WriteInt(blockPos.X);
        builder.WriteInt(blockPos.Y);
        builder.WriteInt(blockPos.Z);
        builder.WriteInt(type);
        builder.WriteString(text);
        builder.WriteInt(EndTag);

        byte[] message = builder.ToArray();
        Log.Trace("send message " + messageCounter + " block resource, length " + message.Length);
        return message;
    }


}