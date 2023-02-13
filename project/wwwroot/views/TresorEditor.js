'use strict';


function TresorEditor(viewManager, serverIn, serverOut, player) {
    var blockPos;
    var blockData;
    var noKeyPressed;    
    let pwd;
    const self   = this;
    let saveType = "Update";

    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_F3]   = cancelAction;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;

    // gui elements
    const baseDiv            = GuiTools.createOverlayTransparent();
    const textAreaPass       = GuiTools.createTextInput(baseDiv, null, "50%", "5%", "left", "Passwort", eventHandlersTextareaPass);
    GuiTools.createLineBreak(baseDiv);
    const textArea           = GuiTools.createTextArrea(baseDiv, "50%", "65%", changeAction);
    GuiTools.createLineBreak(baseDiv);    
    const buttonDiv          = GuiTools.createDiv(baseDiv);        
    const saveButton         = GuiTools.createButton(buttonDiv, "save",   saveAction);
    const cancelButton       = GuiTools.createButton(buttonDiv, "cancel", cancelAction);

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    

    function saveAction()  {
        const text = textArea.value.trim();
        const newPassword = textAreaPass.value.trim();


        if(saveType === "Update") serverOut.requestUpdateResource(blockPos, Block.Tresor, pwd, newPassword, text);
        if(saveType === "Write")  serverOut.requestWriteResource( blockPos, Block.Tresor, newPassword, text); 
        viewManager.unshow(self);
    }


    function cancelAction()  {
        viewManager.unshow(self);
    }


    function changeAction() {
        saveButton.disabled = false;
        noKeyPressed = false;
    }


    this.enable = function() {
        blockPos      = player.getTargetPos();
        if( blockPos == null ) return;

        textArea.value       = "";
        textAreaPass.value   = "";
        noKeyPressed         = true;
        saveButton.disabled  = true;
        pwd                  = undefined;

        
        serverIn.receiveResourceHandler = updateText;   
        getBlockResource();          
    }
    
    
    this.disable = function() {
        serverIn.receiveResourceHandler = null;
        textAreaPass.removeEventListener("input", changeAction);
    }
    

    function updateText(messageType, blockType, resourceResponse, text) {
        if(resourceResponse === SR_Ok) {
            textArea.value    = text;
            textArea.disabled = false;
            saveType = "Update";
            textAreaPass.addEventListener("input", changeAction);
        }              
        if(resourceResponse === SR_PasswordInvalid) {
            textArea.value    = "Password Invalid";
            textArea.disabled = true;
        }

        if(resourceResponse === SR_ResourceDoesNotExist) {
            saveType = "Write";
            textArea.disabled = false;
        }
    }

    function eventHandlersTextareaPass(event) {
        if (event.code === "Enter" && document.activeElement === textAreaPass) {
            pwd = textAreaPass.value.trim();
            getBlockResource();
        }
    }

    function getBlockResource() {
        let pwdForUse = pwd;
        if(pwdForUse === undefined) pwdForUse = textAreaPass.value.trim();
        serverOut.requestReadResource(blockPos, Block.Tresor, pwdForUse);
    }
}