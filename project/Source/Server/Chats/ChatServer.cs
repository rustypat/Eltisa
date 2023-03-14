namespace Eltisa.Server; 

using System;
using Eltisa.Models;
using Eltisa.Tools;
using Eltisa.Server.Players;
using Eltisa.Administration;
using Eltisa.Communication;



public class ChatServer {

    public void SendChatMessage(Actor sender, string message) {
        if( sender == null ) return;
        if( !message.IsDefined() ) return;

        if( message[0] == '@' ) {
            HandleDedicatedChatMessage(sender, message);
        }
        else if( message[0] == '$' && Policy.CanAdministrate(sender) ) {
            HandleAdministratorCommand(sender, message);
        }
        else {
            OutMessageHandler.SendChatMessageToAll(sender.Name, message);
        }
        
    }


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
