'use strict';


function ChatViewer(serverIn, serverOut) {
    const self               = this;

    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_Return] = sendMessageHandler;
    eventHandlers[EV_Keyboard_Any]    = addTextHandler;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => chatRoot;

    // gui elements
    const chatRoot      = GuiTools.createPanel(null, '400px', '100%', null, '0px', '0px', null)
                                  .setDisplay('table-cell').setVerticalAlign('bottom');
    const chatMessages  = GuiTools.createPanel(chatRoot, '400px', 'auto', null, '0px', '30px', null)
                                  .setOverflow('hidden').setPaddingLeft('2px');
    const chatInput     = GuiTools.createTextInput(chatRoot, Config.maxChatMessageLength, '390px', 'auto', null, '0px', '0px', null, CLR_GlossyLight)
                                  .setPaddingBottom('2px');

    serverIn.receiveChatHandler = receiveMessageHandler

    
    this.addText = function(text) {
        if( chatInput.value.length >= Config.maxChatMessageLength ) return false;
        if( text == " " && chatInput.value.length == 0            ) return false;
 
        chatInput.value += text;
        chatInput.scrollLeft = chatInput.scrollWidth        
    }


    function addTextHandler(key) {
        self.addText(key);
    }


    function sendMessageHandler() {
        if( chatInput.value == "") return true;
        serverOut.requestChat(chatInput.value);
        chatInput.value = "";
    }


    function receiveMessageHandler(message, sender) {
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
