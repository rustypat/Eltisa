namespace Eltisa.Source.Models; 

using System;
using System.Collections.Generic;
using Eltisa.Source.Administration;


public class Citizen {
    public string         Name;
    public string         Password;
    public Actor.Type     ActorType;
    public int            Color;
    private List<ChatMessage>      chatMessages;

    public Citizen() {}

    public Citizen(string name, string password, Actor.Type actorType, int color) {
        Name        = name;
        Password    = password;
        ActorType   = actorType;
        Color       = color;
    }


    public void AddChatMessage(string sender, string message) {
        if( chatMessages == null ) {
            chatMessages = new List<ChatMessage>();
        }
        if( chatMessages.Count < Configuration.MaxStoredChatMessages ) {
            ChatMessage chatMessage = new ChatMessage(sender, message);
            chatMessages.Add(chatMessage);
        }
    }

    public bool HasChatMessages() {
        if( chatMessages == null ) return false;
        return chatMessages.Count > 0;
    }
    

    public List<ChatMessage> GetChatMessages() {
        var chatMessagesList = chatMessages;
        chatMessages = null;
        return chatMessagesList;
    }

}