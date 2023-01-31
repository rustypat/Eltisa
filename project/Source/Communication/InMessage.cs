namespace Eltisa.Communication; 

using System;
using Eltisa.Models;
using Eltisa.Tools;
using static System.Diagnostics.Debug;
using static Eltisa.Communication.Constant;

public static class InMessage {


    public class Login {
        public string     Name;
        public string     Password;
    }

    static public Login ToLoginMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        var loginMessage           = new Login();

        int messageId              = reader.ReadInt();
        Assert(messageId == (int)MessageId.LoginRequest);
        loginMessage.Name          = reader.ReadString();
        loginMessage.Password      = reader.ReadString();
        int endTag                 = reader.ReadInt();
        Assert(endTag    == EndTag);            

        return loginMessage;
    }        


    public class MoveActor {
        public float PositionX;
        public float PositionY;
        public float PositionZ;
        public float RotationY;
    }

    static public MoveActor ToMoveActorMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        var moveActorMessage       = new MoveActor();

        int messageId              = reader.ReadInt();
        Assert(messageId == (int)MessageId.MoveActor);
        moveActorMessage.PositionX = reader.ReadFloat();
        moveActorMessage.PositionY = reader.ReadFloat();
        moveActorMessage.PositionZ = reader.ReadFloat();
        moveActorMessage.RotationY = reader.ReadFloat();
        int endTag                 = reader.ReadInt();

        Assert(endTag    == EndTag);            
        return moveActorMessage;
    }
    

    public class ListActors {
    }

    static public ListActors ToListActorsMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        var message                = new ListActors();

        int messageId              = reader.ReadInt();
        Assert(messageId == (int)MessageId.ListActorsRequest);
        int endTag                 = reader.ReadInt();
        Assert(endTag    == EndTag);            

        return message;
    }
    

    public class GetChunks {
        public int            RequestId;
        public RegionPoint[]  Regions;
        public ChunkPoint[]   Chunks;
    }

    static public GetChunks ToGetChunksMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        var message                = new GetChunks();

        int messageId              = reader.ReadInt();
        Assert(messageId == (int)MessageId.GetChunksRequest);
        message.RequestId          = reader.ReadInt();
        int chunkCount             = reader.ReadInt();
        int regionCount            = reader.ReadInt();
        message.Regions            = new RegionPoint[chunkCount];
        message.Chunks             = new ChunkPoint[chunkCount];

        int k=0;
        for(int i=0; i < regionCount; i++) {
            int regionPoint        = reader.ReadInt();
            int regionChunkCount   = reader.ReadUShort();
            for(int j=0; j < regionChunkCount; j++) {
                ushort chunkPoint  = reader.ReadUShort();
                message.Regions[k] = new RegionPoint(regionPoint);
                message.Chunks[k]  = new ChunkPoint(chunkPoint);
                k++;
            }                
        }
        int endTag                 = reader.ReadInt();
        Assert(endTag    == EndTag);     

        return message;
    }    

    public class ChatMessage {
        public string Message;
    }

    static public ChatMessage ToChatMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        var message                = new ChatMessage();

        int messageId              = reader.ReadInt();
        message.Message            = reader.ReadString();
        int endTag                 = reader.ReadInt();

        Assert(messageId == (int)MessageId.ChatMessageRequest);
        Assert(endTag    == EndTag);            
        return message;
    }


    public class VideoChatMessage {
        public enum Type  {RequestChat= 1, StopChat= 2, SendSdpOffer= 3, SendSdpAnswer= 4, SendIce= 5};

        public string         Sender;
        public string         Receiver;
        public int            MessageType;
        public string         JsonMessage;
    }

    static public VideoChatMessage ToVideoChatMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        var message                = new VideoChatMessage();

        int messageId              = reader.ReadInt();
        Assert(messageId == (int)MessageId.VideoChatMessageRequest);
        message.Sender             = reader.ReadString();
        message.Receiver           = reader.ReadString();
        message.MessageType        = reader.ReadInt();
        message.JsonMessage            = reader.ReadString();
        int endTag                 = reader.ReadInt();
        Assert(endTag    == EndTag);            

        return message;
    }


    public class GetBlockResource {
        public int        PosX;
        public int        PosY;
        public int        PosZ;
        public int        Type;
        public string     Pwd;
    }

    static public GetBlockResource ToGetBlockResourceMessage(byte[] inBuffer) {
        var reader  = new ArrayReader(inBuffer);
        var message = new GetBlockResource();

        int messageId    = reader.ReadInt();
        Assert(messageId == (int)MessageId.GetBlockResourceRequest);
        message.PosX     = reader.ReadInt();
        message.PosY     = reader.ReadInt();
        message.PosZ     = reader.ReadInt();
        message.Type     = reader.ReadInt();
        message.Pwd      = reader.ReadString();
        int endTag       = reader.ReadInt();
        Assert(endTag    == EndTag);            

        return message;
    }
    

    public class SaveBlockResource {
        public int        PosX;
        public int        PosY;
        public int        PosZ;
        public int        Type;
        public string     Pwd;
        public string     NewPwd;
        public string     Text;
    }

    static public SaveBlockResource ToSaveBlockResourceMessage(byte[] inBuffer) {
        var reader  = new ArrayReader(inBuffer);
        var message = new SaveBlockResource();

        int messageId    = reader.ReadInt();
        message.PosX     = reader.ReadInt();
        message.PosY     = reader.ReadInt();
        message.PosZ     = reader.ReadInt();
        message.Type     = reader.ReadInt();
        message.Pwd      = reader.ReadString();
        message.NewPwd   = reader.ReadString();
        message.Text     = reader.ReadString();
        int endTag       = reader.ReadInt();

        Assert(messageId == (int)MessageId.SaveBlockResourceRequest);
        Assert(endTag    == EndTag);            
        return message;
    }
    
}