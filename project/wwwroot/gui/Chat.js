'use strict';

function Chat(body) {

    const chatRoot      = document.createElement("div");
    const chatMessages  = document.createElement("div");
    const chatInput     = document.createElement("input");

    initialize();

    function initialize() {
        chatRoot.id     = "chatRoot";
        chatMessages.id = "chatMessages";
        chatInput.id    = "chatInput";
        chatInput.type  = "text";
        chatInput.maxLength = "" + Config.maxChatMessageLength;
        chatInput.value = "";   
        
        chatRoot.appendChild(chatMessages);
        chatRoot.appendChild(chatInput);

        body.appendChild(chatRoot);        
    }


    this.getText = function() {
        const text = chatInput.value;
        chatInput.value = "";
        return text;
    }


    this.setFocus = function() {
        chatInput.focus();
    }


    this.addText = function(text) {
        if( chatInput.value.length >= Config.maxChatMessageLength ) return false;
        if( text == " " && chatInput.value.length == 0            ) return false;
 
        chatInput.value += text;
        chatInput.scrollLeft = chatInput.scrollWidth        
        return true;
    }


    this.deleteLast = function() {
        const length = chatInput.value.length;
        if(length > 0) {
            chatInput.value=chatInput.value.substring(0, length-1)
        }
    }


    this.addMessage = function(sender, message) {
        const paragraph                     = document.createElement("p");
        paragraph.id                        = "chatParagraph";

        const senderTextNode                = GuiTools.createText(paragraph, sender + ": ");
        senderTextNode.style.color          = "#FFFFFF";
        senderTextNode.style.textShadow     = "1px 1px 4px #000000";
        const messageTextNode               = GuiTools.createText(paragraph, message);
        messageTextNode.style.color         = "#000000";
        //messageTextNode.style.textShadow    = "-1px -1px 7px #FFFFFF, -1px 1px 7px #FFFFFF, 1px -1px 7px #FFFFFF, 1px 1px 7px #FFFFFF";
        messageTextNode.style.textShadow    = "0px 0px 7px #FFFFFF";

        chatMessages.appendChild(paragraph);
    
        if(chatMessages.childElementCount > 50) {
            chatMessages.removeChild(chatMessages.getElementsByTagName('p')[0]);
        }    
    }


    
}
