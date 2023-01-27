namespace Eltisa.Communication; 

using System;
using Eltisa.Models;
using Eltisa.Tools;
using Eltisa.Administration;
using static System.Diagnostics.Debug;


public static class InMessage {

    public const int EndTag = 666999;

    public class Login {
        public const byte Id = 10;
        public string     Name;
        public string     Password;
    }

    static public Login ToLoginMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        var loginMessage           = new Login();

        int messageId              = reader.ReadInt();
        loginMessage.Name          = reader.ReadString();
        loginMessage.Password      = reader.ReadString();
        int endTag                 = reader.ReadInt();

        Assert(messageId == Login.Id);
        Assert(endTag    == EndTag);            
        return loginMessage;
    }        


    public class MoveActor {
        public const byte Id = 20;
        public float PositionX;
        public float PositionY;
        public float PositionZ;
        public float RotationY;
    }

    static public MoveActor ToMoveActorMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        var moveActorMessage       = new MoveActor();

        int messageId              = reader.ReadInt();
        moveActorMessage.PositionX = reader.ReadFloat();
        moveActorMessage.PositionY = reader.ReadFloat();
        moveActorMessage.PositionZ = reader.ReadFloat();
        moveActorMessage.RotationY = reader.ReadFloat();
        int endTag                 = reader.ReadInt();

        Assert(messageId == MoveActor.Id);
        Assert(endTag    == EndTag);            
        return moveActorMessage;
    }
    

    public class ListActors {
        public const byte Id = 22;
    }

    static public ListActors ToListActorsMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        var message                = new ListActors();

        int messageId              = reader.ReadInt();
        int endTag                 = reader.ReadInt();

        Assert(messageId == ListActors.Id);
        Assert(endTag    == EndTag);            
        return message;
    }
    

    public class GetChunks {
        public const byte     Id             = 30;
        public int            RequestId;
        public RegionPoint[]  Regions;
        public ChunkPoint[]   Chunks;
    }

    static public GetChunks ToGetChunksMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        var message                = new GetChunks();

        int messageId              = reader.ReadInt();
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

        Assert(messageId == GetChunks.Id);
        Assert(endTag    == EndTag);            
        return message;
    }


    public class AddBlock {
        public const byte Id = 32;
        public int  PosX;
        public int  PosY;
        public int  PosZ;
        public ushort BlockInfo;
    }

    static public AddBlock ToAddBlockMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        var addBlockMessage        = new AddBlock();

        int messageId              = reader.ReadInt();
        addBlockMessage.PosX       = reader.ReadInt();
        addBlockMessage.PosY       = reader.ReadInt();
        addBlockMessage.PosZ       = reader.ReadInt();
        addBlockMessage.BlockInfo  = reader.ReadUShort();
        int endTag                 = reader.ReadInt();

        Assert(messageId == AddBlock.Id);
        Assert(endTag    == EndTag);            
        return addBlockMessage;
    }
    

    public class RemoveBlock {
        public const byte Id = 34;
        public int  PosX;
        public int  PosY;
        public int  PosZ;
    }

    static public RemoveBlock ToRemoveBlockMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        var removeBlockMessage     = new RemoveBlock();

        int messageId              = reader.ReadInt();
        removeBlockMessage.PosX    = reader.ReadInt();
        removeBlockMessage.PosY    = reader.ReadInt();
        removeBlockMessage.PosZ    = reader.ReadInt();
        int endTag                 = reader.ReadInt();

        Assert(messageId == RemoveBlock.Id);
        Assert(endTag    == EndTag);            
        return removeBlockMessage;
    }
    

    public class ChangeBlock {
        public const byte Id = 36;
        public int  PosX;
        public int  PosY;
        public int  PosZ;
        public ushort BlockInfo;
    }

    static public ChangeBlock ToChangeBlockMessage(byte[] inBuffer) {
        var reader = new ArrayReader(inBuffer);
        var changeBlockMessage = new ChangeBlock();

        int messageId              = reader.ReadInt();
        changeBlockMessage.PosX    = reader.ReadInt();
        changeBlockMessage.PosY    = reader.ReadInt();
        changeBlockMessage.PosZ    = reader.ReadInt();
        changeBlockMessage.BlockInfo = reader.ReadUShort();
        int endTag                 = reader.ReadInt();

        Assert(messageId == ChangeBlock.Id);
        Assert(endTag    == EndTag);            
        return changeBlockMessage;
    }
    

    public class SwitchBlocks {
        public const byte Id = 38;
        public readonly WorldPoint[] Positions;

        public SwitchBlocks(int numberOfBlocksToSwitch) {
            Positions = new WorldPoint[numberOfBlocksToSwitch];
        }
    }

    static public SwitchBlocks ToSwitchBlockMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        int messageId              = reader.ReadInt();
        int switchCount            = reader.ReadInt() / 3;            

        if(switchCount > Configuration.MaxSwitches) {
            throw new ArgumentOutOfRangeException("switchCount is out of range: " + switchCount);
        }

        var switchBlockMessage     = new SwitchBlocks(switchCount);

        for(int i=0; i < switchCount; i++) {
            var x = reader.ReadInt();
            var y = reader.ReadInt();
            var z = reader.ReadInt();
            var pos = new WorldPoint(x, y, z);
            switchBlockMessage.Positions[i] = pos;
        }
        int endTag                 = reader.ReadInt();
        Assert(messageId == SwitchBlocks.Id);
        Assert(endTag    == EndTag);            
        return switchBlockMessage;
    }
    

    public class ChatMessage {
        public const byte Id = 42;
        public string Message;
    }

    static public ChatMessage ToChatMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        var message                = new ChatMessage();

        int messageId              = reader.ReadInt();
        message.Message            = reader.ReadString();
        int endTag                 = reader.ReadInt();

        Assert(messageId == ChatMessage.Id);
        Assert(endTag    == EndTag);            
        return message;
    }


    public class VideoChatMessage {
        public enum Type  {RequestChat= 1, StopChat= 2, SendSdpOffer= 3, SendSdpAnswer= 4, SendIce= 5};

        public const byte     Id = 44;
        public string         Sender;
        public string         Receiver;
        public int            MessageType;
        public string         JsonMessage;
    }

    static public VideoChatMessage ToVideoChatMessage(byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        var message                = new VideoChatMessage();

        int messageId              = reader.ReadInt();
        message.Sender             = reader.ReadString();
        message.Receiver           = reader.ReadString();
        message.MessageType        = reader.ReadInt();
        message.JsonMessage            = reader.ReadString();
        int endTag                 = reader.ReadInt();

        Assert(messageId == VideoChatMessage.Id);
        Assert(endTag    == EndTag);            
        return message;
    }


    public class GetBlockResource {
        public const byte Id = 52;
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
        message.PosX     = reader.ReadInt();
        message.PosY     = reader.ReadInt();
        message.PosZ     = reader.ReadInt();
        message.Type     = reader.ReadInt();
        message.Pwd      = reader.ReadString();
        int endTag       = reader.ReadInt();

        Assert(messageId == GetBlockResource.Id);
        Assert(endTag    == EndTag);            
        return message;
    }
    

    public class SaveBlockResource {
        public const byte Id = 54;
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

        Assert(messageId == SaveBlockResource.Id);
        Assert(endTag    == EndTag);            
        return message;
    }
    
}