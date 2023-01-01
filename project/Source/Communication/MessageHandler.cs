// Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved
using System;
using System.IO;
using System.Threading.Tasks;
using System.Net.WebSockets;
using System.Threading;
using System.Collections.Generic;
using System.Security.Authentication;
using Microsoft.AspNetCore.Http;
using static System.Diagnostics.Debug;


using Eltisa.Source.Models;
using Eltisa.Source.Tools;
using Eltisa.Source.Server;
using Eltisa.Source.Administration;



namespace Eltisa.Source.Communication {

    public static class MessageHandler {


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
                socket.sendMessageAsync(outMessage);            
                throw new AuthenticationException("login failed for " + inMessage.Name + ", closing connection");
            }
            else {
                socket.SetActor(actor);
                byte[] outMessage = OutMessage.createLoginMessage(actor, null);
                socket.sendMessageAsync(outMessage);  
                Log.Info(actor.Name + " logged in");

                if( actor.Citizen != null && actor.Citizen.HasChatMessages() ) {
                    var chatMessages = actor.Citizen.GetChatMessages();
                    foreach(var chatMessage in chatMessages) {
                        outMessage = OutMessage.createChatMessage(chatMessage.Sender, chatMessage.Message);
                        socket.sendMessageAsync(outMessage);                          
                    }
                }

                byte[] loginMessage = OutMessage.createActorChangedMessage(actor, OutMessage.ActorChange.Login);
                HomeSocket.sendMessageToAll(loginMessage, actor);
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
                HomeSocket.sendMessageToEnvironment(newPos, actorMessage, actor);                
            }
            else {
                // TODO send reject move message to sender
            }
        }


        static void HandleRemoveBlock(HomeSocket socket, byte[] inBuffer) {
            var inMessage = InMessage.ToRemoveBlockMessage(inBuffer);
            var position     = new WorldPoint(inMessage.PosX, inMessage.PosY, inMessage.PosZ);
            if( !Policy.CanModifyBlock(socket.GetActor(), position)) return;

            Block removedBlock = World.RemoveVisibleBlock(position);
            if(removedBlock.IsNotABlock() ) return;
            if(removedBlock.HasResource() ) {
                ResourcePersister.DeleteText(position);
            }

            Block[] neighbours = new Block[6];
            neighbours[0] = World.GetBlock(position.Left());
            neighbours[1] = World.GetBlock(position.Right());
            neighbours[2] = World.GetBlock(position.Front());
            neighbours[3] = World.GetBlock(position.Back());
            neighbours[4] = World.GetBlock(position.Top());
            neighbours[5] = World.GetBlock(position.Bottom());

            var removeMessage = OutMessage.createBlockRemovedMessage(position, neighbours);
            HomeSocket.sendMessageToEnvironment(position, removeMessage);
        }


        static void HandleAddBlock(HomeSocket socket, byte[] inBuffer) {
            var inMessage = InMessage.ToAddBlockMessage(inBuffer);
            if(inMessage.BlockInfo >= Block.MaxBlockDefinition) return;
            var position = new WorldPoint(inMessage.PosX, inMessage.PosY, inMessage.PosZ);
            if( !Policy.CanModifyBlock(socket.GetActor(), position)) return;
            
            Block block = World.AddBlock(position, inMessage.BlockInfo);
            if(block.IsABlock()) {
                var addMessage = OutMessage.createBlockAddedMessage(position, block);
                HomeSocket.sendMessageToEnvironment(position, addMessage);
            }
        }


        static void HandleChangeBlock(HomeSocket socket, byte[] inBuffer) {
            var inMessage = InMessage.ToChangeBlockMessage(inBuffer);
            var position = new WorldPoint(inMessage.PosX, inMessage.PosY, inMessage.PosZ);
            if( !Policy.CanModifyBlock(socket.GetActor(), position)) return;

            Block block = World.ChangeStateOfVisibleBlock(position, inMessage.BlockInfo);
            if(block.IsABlock()) {
                var changeMessage = OutMessage.createBlocksChangedMessage(position, block);
                HomeSocket.sendMessageToEnvironment(position, changeMessage);
            }
        }


        static void HandleSwitchBlocks(HomeSocket socket, byte[] inBuffer) {
            var actor = socket.GetActor();
            var          inMessage          = InMessage.ToSwitchBlockMessage(inBuffer);
            Block[]      switchedBlocks     = new Block[32];
            WorldPoint[] switchedPositions  = new WorldPoint[32];
            int          switchedCount      = BlockActions.SwitchBlocks(inMessage, switchedPositions, switchedBlocks);
            if(switchedCount > 0) {
                var position      = inMessage.GetPosition(0);
                var changeMessage = OutMessage.createBlocksChangedMessage(switchedCount, switchedPositions, switchedBlocks);
                HomeSocket.sendMessageToEnvironment(position, changeMessage);
            }
        }


        static void HandleGetChunks(HomeSocket socket, byte[] inBuffer) {
            var inMessage         = InMessage.ToGetChunksMessage(inBuffer);
            var requestChunkCount = inMessage.Chunks.Length;

            Chunk[] chunks        = new Chunk[requestChunkCount];
            int responseChunkCount= 0;

            for(int i=0; i < requestChunkCount; i++ ) {
                Chunk chunk         = World.GetChunk(inMessage.Regions[i], inMessage.Chunks[i]);
                if(chunk != null) {
                    chunks[i] = chunk;
                    responseChunkCount++;
                }

            }
            var chunksMessage = OutMessage.createChunksMessage(inMessage.RequestId, inMessage.Regions, chunks, responseChunkCount);
            socket.sendMessageAsync(chunksMessage);
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
                ActorStore.sendMessageToAll(chatMessage);
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
                sender.Socket.sendMessageAsync(chatMessage);
            }
            else if( !Policy.CanVideoChat(sender, receiver) ) {
                var chatMessage  = OutMessage.createVideoChatMessage(inMessage.Receiver, inMessage.Sender, (int)InMessage.VideoChatMessage.Type.StopChat, "\"to protect children, visitors may not video chat with citizen\"");
                sender.Socket.sendMessageAsync(chatMessage);
            }
            else {
                var chatMessage  = OutMessage.createVideoChatMessage(inMessage.Sender, inMessage.Receiver, inMessage.MessageType, inMessage.JsonMessage);
                receiver.Socket.sendMessageAsync(chatMessage);
            }
        }


        static void HandleGetBlockResource(HomeSocket socket, byte[] inBuffer) {
            var inMessage    = InMessage.ToGetBlockResourceMessage(inBuffer);
            var position     = new WorldPoint(inMessage.PosX, inMessage.PosY, inMessage.PosZ);

            string text      = ResourcePersister.ReadText(position, inMessage.Type);
            if(text != null) {
                var blockResourceMessage = OutMessage.createBlockResourceMessage(position, inMessage.Type, text);
                HomeSocket.sendMessageToEnvironment(position, blockResourceMessage);
            }
        }


        static void HandleSaveBlockResource(HomeSocket socket, byte[] inBuffer) {
            var inMessage    = InMessage.ToSaveBlockResourceMessage(inBuffer);
            var position     = new WorldPoint(inMessage.PosX, inMessage.PosY, inMessage.PosZ);
            if( Policy.CanModifyBlock(socket.GetActor(), position)) {
                ResourcePersister.WriteText(position, inMessage.Type, inMessage.Text);
            }
        }


        static void HandleListActors(HomeSocket socket, byte[] inBuffer) {
            var inMessage         = InMessage.ToListActorsMessage(inBuffer);
            var (actors, count)   = ActorStore.GetActorsAndCount();
            var outMessage        = OutMessage.createActorListMessage(actors, count);
            socket.sendMessageAsync(outMessage);                          
        }


        ///////////////////////////////////////////////////////////////////////////////////////////
        // sub handler
        ///////////////////////////////////////////////////////////////////////////////////////////


        static void HandleAdministratorCommand(Actor admin, string message) {
            if(message == "$store regions") {
                int storedRegions = World.Persist();
                var chatMessage  = OutMessage.createChatMessage("System", "regions stored " +  storedRegions);
                admin.Socket.sendMessageAsync(chatMessage);
            }
            else if(message == "$version") {
                var chatMessage  = OutMessage.createChatMessage("System", "Version " + Configuration.Version + "  " + Configuration.VersionType);
                admin.Socket.sendMessageAsync(chatMessage);
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
                sender.Socket.sendMessageAsync(chatMessage);
                receiver.Socket.sendMessageAsync(chatMessage);
                return;
            }

            Citizen citizen = CitizenStore.GetCitizen(receiverName);
            if( citizen != null ) {
                citizen.AddChatMessage(sender.Name, dedicatedMessage);
                return;
            }
            
            {
                var chatMessage  = OutMessage.createChatMessage("System", receiverName + " is unknown");                
                sender.Socket.sendMessageAsync(chatMessage);                
                return;
            }            
        }


    }


}
