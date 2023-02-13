'use strict';


function TresorViewer(viewManager, serverIn, serverOut, player) {
    var blockPos;
    var blockData;    
    const self   = this;

    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_Space]   = close;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;

    // gui elements
    const baseDiv            = GuiTools.createOverlayTransparent();
    const textAreaPass       = GuiTools.createTextInput(baseDiv, null, "50%", "5%", "left", "Passwort", eventHandlersTextareaPass);
    GuiTools.createLineBreak(baseDiv);
    const textArea           = GuiTools.createTextArrea(baseDiv, "50%", "65%");
    GuiTools.createLineBreak(baseDiv);  
    textArea.disabled = true;  

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    

    function close()  {
        viewManager.unshow(self);
    }


    this.enable = function() {
        blockPos      = player.getTargetPos();
        if( blockPos == null ) return;

        textArea.value       = "";
        textAreaPass.value   = "";

        
        serverIn.receiveResourceHandler = updateText;   
        getBlockResource();          
    }
    
    
    this.disable = function() {
        serverIn.receiveResourceHandler = null;
    }
    

    function updateText(messageType, blockType, resourceResponse, text) {
        if(resourceResponse === SR_Ok)              textArea.value    = text;
        if(resourceResponse === SR_PasswordInvalid) textArea.value    = "Password Invalid";
    }

    function eventHandlersTextareaPass(event) {
        if (event.code === "Enter" && document.activeElement === textAreaPass) getBlockResource();
    }

    function getBlockResource() {
        let pwd = textAreaPass.value.trim();
        serverOut.requestReadResource(blockPos, Block.Tresor, pwd);
    }
}