namespace Eltisa.Communication; 

using System;
using Eltisa.Models;
using Eltisa.Tools;
using static System.Diagnostics.Debug;
using static Eltisa.Communication.Constant;


public static class OutMessage {


    private static int messageCounter;


    public enum LoginResponse {
        Ok,
        LoginFailed,
    }


    public static byte[] createLoginMessage(Actor actor, string errorMessage) {
        messageCounter += 1;

        ArrayWriter builder = new ArrayWriter();   
        builder.WriteInt((byte)MessageId.LoginResponse);
        builder.WriteInt(messageCounter);
        if(actor != null) {
            builder.WriteInt((int)LoginResponse.Ok);
            builder.WriteInt(actor.ID);
            builder.WriteInt((int)actor.ActorType);
            builder.WriteString(actor.Name);     
            builder.WriteInt(actor.Color);    
        }
        else {
            builder.WriteInt((int)LoginResponse.LoginFailed);
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

}