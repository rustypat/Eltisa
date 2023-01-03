using System;

namespace Eltisa.Source.Models {

    public class ChatMessage {

        public readonly string Sender;
        public readonly string Message;
        

        public ChatMessage(string sender, string message) {
            Sender      = sender;
            Message     = message;
        }
    }

}