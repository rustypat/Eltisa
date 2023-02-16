namespace Eltisa.Communication; 

using System;
using System.Linq;
using System.Security.Authentication;
using Eltisa.Models;
using Eltisa.Tools;
using Eltisa.Server;
using Eltisa.Server.Players;
using Eltisa.Administration;
using static System.Diagnostics.Debug;
using static Eltisa.Administration.Configuration;
using static Eltisa.Communication.Constant;
using static Eltisa.Communication.MessageId;

public static class InMessageHandler {

    delegate void MessageHandler(HomeSocket socket, byte[] message);

    private static int maxMessageId = Enum.GetValues(typeof(MessageId)).Cast<int>().Max();
    private static MessageHandler[] messageHandlers = new MessageHandler[maxMessageId+1];

    static InMessageHandler() {
        for(int i=0; i < maxMessageId; i++) messageHandlers[i] = HandleUnknownMessage;

        messageHandlers[(int)MoveActor] = HandleMoveActor;
        messageHandlers[(int)GetChunksRequest] = HandleGetChunks;
        messageHandlers[(int)AddBlock] = HandleAddBlock;
        messageHandlers[(int)RemoveBlock] = HandleRemoveBlock;
        messageHandlers[(int)ChangeBlock] = HandleChangeBlock;
        messageHandlers[(int)SwitchBlock] = HandleSwitchBlocks;
        messageHandlers[(int)ChatMessageRequest] = HandleChatMessage;
        messageHandlers[(int)VideoChatMessageRequest] = HandleVideoChatMessage;
        messageHandlers[(int)ListActorsRequest] = HandleListActors;
        messageHandlers[(int)LoginRequest] = HandleLogin;
        messageHandlers[(int)CreateResourceRequest] = HandleCreateResourceRequest;
        messageHandlers[(int)ReadResourceRequest] = HandleReadResourceRequest;
        messageHandlers[(int)WriteResourceRequest] = HandleWriteResourceRequest;
        messageHandlers[(int)UpdateResourceRequest] = HandleUpdateResourceRequest;
        messageHandlers[(int)DeleteResourceRequest] = HandleDeleteResourceRequest;
    }


    public static void HandleSocketMessage(HomeSocket socket, byte[] message) {
        var messageId = message[0];  // works only on Intel type processors!!

        if(messageId < 0 || messageId > maxMessageId) {
            var exception = new Exception("received unknown message of type " + message[0]);
            Log.Error(exception);
            #if DEBUG
                throw exception;
            #endif
        }

        messageHandlers[messageId](socket, message);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////
    // handle received messages
    ///////////////////////////////////////////////////////////////////////////////////////////


    static void HandleUnknownMessage(HomeSocket socket, byte[] message) {
            var exception = new Exception("received unknown message of type " + message[0]);
            Log.Error(exception);
            #if DEBUG
                throw exception;
            #endif
    }


    static void HandleLogin(HomeSocket socket, byte[] inBuffer) {
        var inMessage = InMessage.ToLoginMessage(inBuffer);

        (Actor actor, string errorMessage) = ActorStore.CreateActor(inMessage.Name, inMessage.Password, socket);
        if(actor == null) {
            byte[] outMessage = OutMessage.createLoginMessage(null, errorMessage);
            socket.SendMessageAsync(outMessage);            
            throw new AuthenticationException("login failed for " + inMessage.Name + ", closing connection");
        }
        else {
            socket.SetActor(actor);
            byte[] outMessage = OutMessage.createLoginMessage(actor, null);
            socket.SendMessageAsync(outMessage);  
            Log.Info(actor.Name + " logged in");
            OutMessageHandler.SendActorJoinedNotification(actor);
        }
    }


    static void HandleMoveActor(HomeSocket socket, byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);

        int messageId              = reader.ReadInt();
        Assert(messageId == (int)MessageId.MoveActor);
        var x = reader.ReadFloat();
        var y = reader.ReadFloat();
        var z = reader.ReadFloat();
        var orientation = reader.ReadFloat();
        int endTag                 = reader.ReadInt();
        Assert(endTag    == EndTag);            

        var actor          = socket.GetActor();
        actor.Turn(orientation);
        var couldMoveActor = actor.Move(x, y, z);
        if(couldMoveActor) {
            OutMessageHandler.SendActorMovedNotificationToRange(actor);
        }
        else {
            // TODO send reject move message to sender
        }
    }


    static void HandleAddBlock(HomeSocket socket, byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);

        int messageId              = reader.ReadInt();
        Assert(messageId == (int)MessageId.AddBlock);
        int x                      = reader.ReadInt();
        int y                      = reader.ReadInt();
        int z                      = reader.ReadInt();
        ushort blockDescription    = reader.ReadUShort();
        int endTag                 = reader.ReadInt();
        Assert(endTag    == EndTag);            

        var position = new WorldPoint(x, y, z);        
        World.AddBlock(socket.GetActor(), position, blockDescription);
    }


    static void HandleRemoveBlock(HomeSocket socket, byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);

        int messageId              = reader.ReadInt();
        Assert(messageId == (int)MessageId.RemoveBlock);
        int x                      = reader.ReadInt();
        int y                      = reader.ReadInt();
        int z                      = reader.ReadInt();
        int endTag                 = reader.ReadInt();
        Assert(endTag    == EndTag);            

        var position     = new WorldPoint(x, y, z);
        World.RemoveVisibleBlock(socket.GetActor(), position);
    }


    static void HandleChangeBlock(HomeSocket socket, byte[] inBuffer) {
        var reader = new ArrayReader(inBuffer);

        int messageId              = reader.ReadInt();
        Assert(messageId == (int)MessageId.ChangeBlock);
        int x                      = reader.ReadInt();
        int y                      = reader.ReadInt();
        int z                      = reader.ReadInt();
        ushort blockDescription    = reader.ReadUShort();
        int endTag                 = reader.ReadInt();
        Assert(endTag    == EndTag);            

        var position = new WorldPoint(x, y, z);
        World.ChangeStateOfVisibleBlock(socket.GetActor(), position, blockDescription);
    }


    static void HandleSwitchBlocks(HomeSocket socket, byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        
        int messageId              = reader.ReadInt();
        Assert(messageId == (int)MessageId.SwitchBlock);
        
        int switchCount            = reader.ReadInt() / 3;            
        if(switchCount > Configuration.MaxSwitches)  throw new ArgumentOutOfRangeException("switchCount is out of range: " + switchCount);

        var switchPositions        = new WorldPoint[switchCount];
        for(int i=0; i < switchCount; i++) {
            var x = reader.ReadInt();
            var y = reader.ReadInt();
            var z = reader.ReadInt();
            switchPositions[i] = new WorldPoint(x, y, z);
        }
        int endTag                 = reader.ReadInt();
        Assert(endTag    == EndTag);            

        var actor = socket.GetActor();
        World.SwitchBlocks(socket.GetActor(), switchPositions);
    }


    static void HandleGetChunks(HomeSocket socket, byte[] inBuffer) {
        var inMessage         = InMessage.ToGetChunksMessage(inBuffer);
        var requestChunkCount = inMessage.Chunks.Length;

        Chunk[] chunks        = new Chunk[requestChunkCount];
        int responseChunkCount= 0;

        for(int i=0; i < requestChunkCount; i++ ) {
            Chunk chunk         = World.GetChunk(socket.GetActor(), inMessage.Regions[i], inMessage.Chunks[i]);
            if(chunk != null) {
                chunks[i] = chunk;
                responseChunkCount++;
            }

        }
        var chunksMessage = OutMessage.createChunksMessage(inMessage.RequestId, inMessage.Regions, chunks, responseChunkCount);
        socket.SendMessageAsync(chunksMessage);
    }


    static void HandleChatMessage(HomeSocket socket, byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        int messageId              = reader.ReadInt();
        Assert(messageId == (int)MessageId.ChatMessageRequest);
        var message                = reader.ReadString();
        var receiver               = reader.ReadString();
        int endTag                 = reader.ReadInt();
        Assert(endTag    == EndTag);            
        
        var actor        = socket.GetActor();

        if( actor == null                 ) return;
        if( !message.IsDefined() ) return;

        if( message[0] == '@' ) {
            HandleDedicatedChatMessage(actor, message);
        }
        else if( message[0] == '$' && Policy.CanAdministrate(actor) ) {
            HandleAdministratorCommand(actor, message);
        }
        else {
            OutMessageHandler.SendChatMessageToAll(actor.Name, message);
        }

    }


    static void HandleVideoChatMessage(HomeSocket socket, byte[] inBuffer) {
        var inMessage    = InMessage.ToVideoChatMessage(inBuffer);
        var sender       = socket.GetActor();
        var receiver     = ActorStore.GetActor(inMessage.Receiver);

        if(sender == null) return;
        Assert(sender.Name == inMessage.Sender);
        Assert(receiver == null || receiver.Name == inMessage.Receiver);

        if(receiver == null) {
            var chatMessage  = OutMessage.createVideoChatMessage(inMessage.Receiver, inMessage.Sender, (int)InMessage.VideoChatMessage.Type.StopChat, "\"can't find " + inMessage.Receiver + "\"");
            sender.Socket.SendMessageAsync(chatMessage);
        }
        else if( !Policy.CanVideoChat(sender, receiver) ) {
            var chatMessage  = OutMessage.createVideoChatMessage(inMessage.Receiver, inMessage.Sender, (int)InMessage.VideoChatMessage.Type.StopChat, "\"to protect children, visitors may not video chat with citizen\"");
            sender.Socket.SendMessageAsync(chatMessage);
        }
        else {
            var chatMessage  = OutMessage.createVideoChatMessage(inMessage.Sender, inMessage.Receiver, inMessage.MessageType, inMessage.JsonMessage);
            receiver.Socket.SendMessageAsync(chatMessage);
        }
    }


    static void HandleListActors(HomeSocket socket, byte[] inBuffer) {
        var reader                 = new ArrayReader(inBuffer);
        int messageId              = reader.ReadInt();
        Assert(messageId == (int)MessageId.ListActorsRequest);
        int endTag                 = reader.ReadInt();
        Assert(endTag    == EndTag);            

        var (actors, count)   = ActorStore.GetActorsAndCount();
        OutMessageHandler.SendActorListResponse(socket, actors, count);
    }


    static void HandleCreateResourceRequest(HomeSocket socket, byte[] inBuffer) {
        var reader      = new ArrayReader(inBuffer);
        int messageId   = reader.ReadInt();
        Assert(messageId == (int)MessageId.CreateResourceRequest);
        int x           = reader.ReadInt();
        int y           = reader.ReadInt();
        int z           = reader.ReadInt();
        ushort blockType= reader.ReadUShort();
        string password = reader.ReadString();
        byte[] data     = reader.ReadBytes();
        int endTag      = reader.ReadInt();
        Assert(endTag == EndTag);         

        var position    = new WorldPoint(x, y, z);
        var result      = World.CreateResource(socket.GetActor(), position, blockType, password, data);
        OutMessageHandler.SendCreateResourceResponse(socket, position, blockType, result);
    }


    static void HandleReadResourceRequest(HomeSocket socket, byte[] inBuffer) {
        var reader      = new ArrayReader(inBuffer);
        int messageId   = reader.ReadInt();
        Assert(messageId == (int)MessageId.ReadResourceRequest);
        int x           = reader.ReadInt();
        int y           = reader.ReadInt();
        int z           = reader.ReadInt();
        int targetId    = reader.ReadInt();
        ushort blockType= reader.ReadUShort();
        string password = reader.ReadString();
        int endTag      = reader.ReadInt();
        Assert(endTag == EndTag);            

        var position    = new WorldPoint(x, y, z);
        var result      = World.ReadResource(socket.GetActor(), position, blockType, password);
        OutMessageHandler.SendReadResourceResponse(socket, position, blockType, result, targetId);
    }


    static void HandleWriteResourceRequest(HomeSocket socket, byte[] inBuffer) {
        var reader      = new ArrayReader(inBuffer);
        int messageId   = reader.ReadInt();
        Assert(messageId == (int)MessageId.WriteResourceRequest);
        int x           = reader.ReadInt();
        int y           = reader.ReadInt();
        int z           = reader.ReadInt();
        ushort blockType= reader.ReadUShort();
        string password = reader.ReadString();
        byte[] data     = reader.ReadBytes();
        int endTag      = reader.ReadInt();
        Assert(endTag == EndTag);        

        var position    = new WorldPoint(x, y, z);
        var response    = World.WriteResource(socket.GetActor(), position, blockType, password, data);
        OutMessageHandler.SendWriteResourceResponse(socket, position, blockType, response);
    }


    static void HandleUpdateResourceRequest(HomeSocket socket, byte[] inBuffer) {
        var reader      = new ArrayReader(inBuffer);
        int messageId   = reader.ReadInt();
        Assert(messageId == (int)MessageId.UpdateResourceRequest);
        int x           = reader.ReadInt();
        int y           = reader.ReadInt();
        int z           = reader.ReadInt();
        ushort blockType= reader.ReadUShort();
        string password = reader.ReadString();
        string newPassword = reader.ReadString();
        byte[] newData  = reader.ReadBytes();
        int endTag      = reader.ReadInt();
        Assert(endTag == EndTag);        

        var position    = new WorldPoint(x, y, z);
        var response    = World.UpdateResource(socket.GetActor(), position, blockType, password, newPassword, newData);
        OutMessageHandler.SendUpdateResourceResponse(socket, position, blockType, response);
    }


    static void HandleDeleteResourceRequest(HomeSocket socket, byte[] inBuffer) {
        var reader      = new ArrayReader(inBuffer);
        int messageId   = reader.ReadInt();
        Assert(messageId == (int)MessageId.DeleteResourceRequest);
        int x           = reader.ReadInt();
        int y           = reader.ReadInt();
        int z           = reader.ReadInt();
        ushort blockType= reader.ReadUShort();
        string password = reader.ReadString();
        int endTag      = reader.ReadInt();
        Assert(endTag == EndTag);      

        var position    = new WorldPoint(x, y, z);
        var response    = World.DeleteResource(socket.GetActor(), position, blockType, password);
        OutMessageHandler.SendDeleteResourceResponse(socket, position, blockType, response);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // sub handler
    ///////////////////////////////////////////////////////////////////////////////////////////


    static void HandleAdministratorCommand(Actor admin, string message) {
        if(message == "$store regions") {
            World.Persist();
            OutMessageHandler.SendChatMessageTo(admin.Socket, "System", "cache stored ");
        }
        else if(message == "$version") {
            OutMessageHandler.SendChatMessageTo(admin.Socket, "System", "Version " + Configuration.Version + "  " + Configuration.VersionType);
        }
    }


    static void HandleDedicatedChatMessage(Actor sender, string message) {
        string[] messageParts = message.Split(' ', 2);
        if( messageParts.Length < 2    ) return;
        if( messageParts[0].Length < 2 ) return;
        if( messageParts[1].Length < 1 ) return;

        string receiverName = messageParts[0].Substring(1);
        string dedicatedMessage = messageParts[1];

        Actor receiver = ActorStore.GetActor(receiverName);
        if( receiver != null) {
            OutMessageHandler.SendChatMessageTo(receiver.Socket, sender.Name, dedicatedMessage);
            OutMessageHandler.SendChatMessageTo(sender.Socket, sender.Name, dedicatedMessage);
            return;
        }
        else {
            OutMessageHandler.SendChatMessageTo(sender.Socket, "System", receiverName + " is unknown");                
            return;
        }            
    }


}


