'use strict';


function TresorViewer(viewManager, serverIn, serverOut, player) {
    let blockPos;
    let blockData;    
    const self   = this;

    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_Space]   = close;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;

    // gui elements
    const baseDiv            = GuiTools.createOverlay(null, CLR_GlossyLight);
    const panel              = GuiTools.createCenteredPanel(baseDiv, "700px", "615px").setGradient('#ababab', '#4b4b4b');

    const textAreaPass       = GuiTools.createEditField(panel, null, "600px", "30px", "Passwort", eventHandlersTextareaPass);
    GuiTools.createLineBreak(panel);
    const textArea           = GuiTools.createTextArrea(panel, "600px", "500px");
    GuiTools.createLineBreak(panel);  
    textArea.disabled = true;  



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