namespace Eltisa.Server; 

using System;
using Eltisa.Administration;
using Eltisa.Communication;
using Eltisa.Models;
using Eltisa.Server.Players;
using Eltisa.Tools;

public class VideoChatServer {

    public void HandleVideoChatMessage(HomeSocket senderSocket, int vcMessageType, string receiverName, string jsonMessage) {
        var sender       = senderSocket.GetActor();
        var receiver     = ActorStore.GetActor(receiverName);

        if(sender == null) {
            return;
        }
        else if(receiver == null) {
            Log.Debug($"relay video message {vcMessageType} from {sender.Name} to {sender.Name}");
            OutMessageHandler.SendVideoChatMessageTo(senderSocket, (int)VideoChatMessageType.StopChat, receiverName, "\"can't find " + receiverName + "\"");
        }
        else if( !Policy.CanVideoChat(sender, receiver) ) {
            Log.Debug($"relay video message {vcMessageType} from {sender.Name} to {sender.Name}");
            OutMessageHandler.SendVideoChatMessageTo(senderSocket, (int)VideoChatMessageType.StopChat, receiverName, "\"to protect children, visitors may not video chat with citizen\"");
        }
        else {
            Log.Debug($"relay video message {vcMessageType} from {sender.Name} to {receiver.Name}");
            OutMessageHandler.SendVideoChatMessageTo(receiver.Socket, vcMessageType, sender.Name, jsonMessage);
        }
        
    }

}
