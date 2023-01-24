namespace Eltisa.Communication; 

using System;
using System.Security.Authentication;
using Eltisa.Models;
using Eltisa.Tools;
using Eltisa.Server;
using Eltisa.Server.Players;
using Eltisa.Administration;
using static System.Diagnostics.Debug;
using static Eltisa.Administration.Configuration;


public static class InMessageHandler {


    public static void HandleSocketMessage(HomeSocket socket, byte[] message, int messageLength) {
        if(message[0] == InMessage.MoveActor.Id) {
            Log.Trace("receive message MoveActor of length " + messageLength);
            HandleMoveActor(socket, message);
        }
        else if(message[0] == InMessage.GetChunks.Id) {
            Log.Trace("receive message GetChunks of length " + messageLength);
            HandleGetChunks(socket, message);
        }
        else if(message[0] == InMessage.AddBlock.Id) {
            Log.Trace("receive message AddBlock of length " + messageLength);
            HandleAddBlock(socket, message);
        }
        else if(message[0] == InMessage.RemoveBlock.Id) {
            Log.Trace("receive message RemoveBlock of length " + messageLength);
            HandleRemoveBlock(socket, message);
        }
        else if(message[0] == InMessage.ChangeBlock.Id) {
            Log.Trace("receive message ChangeBlock of length " + messageLength);
            HandleChangeBlock(socket, message);
        }
        else if(message[0] == InMessage.SwitchBlocks.Id) {
            Log.Trace("receive message SwitchBlock of length " + messageLength);
            HandleSwitchBlocks(socket, message);
        }
        else if(message[0] == InMessage.GetBlockResource.Id) {
            Log.Trace("receive message GetBlockResource of length " + messageLength);
            HandleGetBlockResource(socket, message);
        }
        else if(message[0] == InMessage.SaveBlockResource.Id) {
            Log.Trace("receive message SaveBlockResource of length " + messageLength);
            HandleSaveBlockResource(socket, message);
        }
        else if(message[0] == InMessage.ChatMessage.Id) {
            Log.Trace("receive message ChatMessage of length " + messageLength);
            HandleChatMessage(socket, message);
        }
        else if(message[0] == InMessage.VideoChatMessage.Id) {
            Log.Trace("receive message VideoChatMessage of length " + messageLength);
            HandleVideoChatMessage(socket, message);
        }
        else if(message[0] == InMessage.ListActors.Id) {
            Log.Trace("receive message ListActors of length " + messageLength);
            HandleListActors(socket, message);
        }
        else if(message[0] == InMessage.Login.Id) {
            Log.Trace("receive message Login of length " + messageLength);
            HandleLogin(socket, message);
        }
        else {
            var exception = new Exception("received unknown message of type " + message[0]);
            Log.Error(exception);
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // handle received messages
    ///////////////////////////////////////////////////////////////////////////////////////////


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

            if( actor.Citizen != null && actor.Citizen.HasChatMessages() ) {
                var chatMessages = actor.Citizen.GetChatMessages();
                foreach(var chatMessage in chatMessages) {
                    outMessage = OutMessage.createChatMessage(chatMessage.Sender, chatMessage.Message);
                    socket.SendMessageAsync(outMessage);                          
                }
            }

            byte[] loginMessage = OutMessage.createActorChangedMessage(actor, OutMessage.ActorChange.Login);
            OutMessageHandler.SendMessageToAll(loginMessage, actor);
        }
    }


    static void HandleMoveActor(HomeSocket socket, byte[] inBuffer) {
        var inMessage      = InMessage.ToMoveActorMessage(inBuffer);
        var actor          = socket.GetActor();

        actor.Turn(inMessage.RotationY);
        var couldMoveActor = actor.Move(inMessage.PositionX, inMessage.PositionY, inMessage.PositionZ);
        if(couldMoveActor) {
            var actorMessage   = OutMessage.createActorChangedMessage(actor, OutMessage.ActorChange.Moved);
            var newPos         = new WorldPoint(actor.PositionX, actor.PositionY, actor.PositionZ);
            OutMessageHandler.SendMessageToRange(actorMessage, newPos, ClientCacheBlockRadius, actor);                
        }
        else {
            // TODO send reject move message to sender
        }
    }


    static void HandleRemoveBlock(HomeSocket socket, byte[] inBuffer) {
        var inMessage = InMessage.ToRemoveBlockMessage(inBuffer);
        var position     = new WorldPoint(inMessage.PosX, inMessage.PosY, inMessage.PosZ);
        World.RemoveVisibleBlock(socket.GetActor(), position);
    }


    static void HandleAddBlock(HomeSocket socket, byte[] inBuffer) {
        var inMessage = InMessage.ToAddBlockMessage(inBuffer);
        var position = new WorldPoint(inMessage.PosX, inMessage.PosY, inMessage.PosZ);        
        World.AddBlock(socket.GetActor(), position, inMessage.BlockInfo);
    }


    static void HandleChangeBlock(HomeSocket socket, byte[] inBuffer) {
        var inMessage = InMessage.ToChangeBlockMessage(inBuffer);
        var position = new WorldPoint(inMessage.PosX, inMessage.PosY, inMessage.PosZ);
        World.ChangeStateOfVisibleBlock(socket.GetActor(), position, inMessage.BlockInfo);
    }


    static void HandleSwitchBlocks(HomeSocket socket, byte[] inBuffer) {
        var actor = socket.GetActor();
        var          inMessage          = InMessage.ToSwitchBlockMessage(inBuffer);        
        World.SwitchBlocks(socket.GetActor(), inMessage.Positions);
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
        var inMessage    = InMessage.ToChatMessage(inBuffer);
        var actor        = socket.GetActor();

        if( actor == null                 ) return;
        if( inMessage.Message.Length == 0 ) return;

        if( inMessage.Message[0] == '@' ) {
            HandleDedicatedChatMessage(actor, inMessage.Message);
        }
        else if( inMessage.Message[0] == '$' && Policy.CanAdministrate(actor) ) {
            HandleAdministratorCommand(actor, inMessage.Message);
        }
        else {
            var chatMessage  = OutMessage.createChatMessage(actor.Name, inMessage.Message);
            OutMessageHandler.SendMessageToAll(chatMessage);
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


    static void HandleGetBlockResource(HomeSocket socket, byte[] inBuffer) {
        var inMessage    = InMessage.ToGetBlockResourceMessage(inBuffer);
        var position     = new WorldPoint(inMessage.PosX, inMessage.PosY, inMessage.PosZ);

        string text      = ResourcePersister.ReadText(position, inMessage.Type, inMessage.Pwd);
        if(text != null) {
            var blockResourceMessage = OutMessage.createBlockResourceMessage(position, inMessage.Type, text);
            OutMessageHandler.SendMessageToRange(blockResourceMessage, position, ClientCacheBlockRadius);                
        }
    }


    static void HandleSaveBlockResource(HomeSocket socket, byte[] inBuffer) {
        var inMessage    = InMessage.ToSaveBlockResourceMessage(inBuffer);
        var position     = new WorldPoint(inMessage.PosX, inMessage.PosY, inMessage.PosZ);
        if( Policy.CanModifyBlock(socket.GetActor(), position)) {
            ResourcePersister.WriteText(position, inMessage.Type, inMessage.Text, inMessage.Pwd, inMessage.NewPwd);
        }
    }


    static void HandleListActors(HomeSocket socket, byte[] inBuffer) {
        var inMessage         = InMessage.ToListActorsMessage(inBuffer);
        var (actors, count)   = ActorStore.GetActorsAndCount();
        var outMessage        = OutMessage.createActorListMessage(actors, count);
        socket.SendMessageAsync(outMessage);                          
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // sub handler
    ///////////////////////////////////////////////////////////////////////////////////////////


    static void HandleAdministratorCommand(Actor admin, string message) {
        if(message == "$store regions") {
            int storedRegions = World.Persist();
            var chatMessage  = OutMessage.createChatMessage("System", "regions stored " +  storedRegions);
            admin.Socket.SendMessageAsync(chatMessage);
        }
        else if(message == "$version") {
            var chatMessage  = OutMessage.createChatMessage("System", "Version " + Configuration.Version + "  " + Configuration.VersionType);
            admin.Socket.SendMessageAsync(chatMessage);
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
            var chatMessage  = OutMessage.createChatMessage(sender.Name,dedicatedMessage);                
            sender.Socket.SendMessageAsync(chatMessage);
            receiver.Socket.SendMessageAsync(chatMessage);
            return;
        }

        Citizen citizen = CitizenStore.GetCitizen(receiverName);
        if( citizen != null ) {
            citizen.AddChatMessage(sender.Name, dedicatedMessage);
            return;
        }
        
        {
            var chatMessage  = OutMessage.createChatMessage("System", receiverName + " is unknown");                
            sender.Socket.SendMessageAsync(chatMessage);                
            return;
        }            
    }


}


