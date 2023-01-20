namespace Eltisa.Models; 

using System;

public class ChatMessage {

    public readonly string Sender;
    public readonly string Message;
    

    public ChatMessage(string sender, string message) {
        Sender      = sender;
        Message     = message;
    }
}