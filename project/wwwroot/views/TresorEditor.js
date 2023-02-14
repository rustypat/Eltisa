'use strict';


function TresorEditor(viewManager, serverIn, serverOut, player) {
    const ST_Update = 1;
    const ST_Write  = 2;

    let blockPos;
    let blockData;
    let noKeyPressed;    
    let pwd;
    const self   = this;
    let saveType = ST_Update;

    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_F3]   = cancelAction;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;

    // gui elements
    const baseDiv            = GuiTools.createOverlayTransparent();
    const panel              = GuiTools.createCenteredPanel(baseDiv, "700px", "685px");
    panel.style.backgroundColor = "rgb(149, 149, 149)";
    GuiTools.createLineBreak(panel);
    const textAreaPass       = GuiTools.createTextInput(panel, null, "600px", "30px", "left", "Passwort", eventHandlersTextareaPass);
    GuiTools.createLineBreak(panel);
    const textArea           = GuiTools.createTextArrea(panel, "600px", "500px", changeAction);
    GuiTools.createLineBreak(panel);    
    const buttonDiv          = GuiTools.createDiv(panel);        
    const saveButton         = GuiTools.createButton(buttonDiv, "save",   saveAction);
    const cancelButton       = GuiTools.createButton(buttonDiv, "cancel", cancelAction);
    const deleteButton       = GuiTools.createButton(buttonDiv, "delete", deleteAction);

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    

    function saveAction()  {
        const text = textArea.value.trim();
        const newPassword = textAreaPass.value.trim();


        if(saveType === ST_Update) serverOut.requestUpdateResource(blockPos, Block.Tresor, pwd, newPassword, text);
        else if(saveType === ST_Write)  serverOut.requestWriteResource( blockPos, Block.Tresor, newPassword, text);
        else throw new Error('Unknow Savetype'); 
        viewManager.unshow(self);
    }


    function cancelAction()  {
        viewManager.unshow(self);
    }

    function deleteAction() {
        serverOut.requestDeleteResource(blockPos, Block.Tresor, pwd);
        viewManager.unshow(self);
    }


    function changeAction() {
        saveButton.disabled = false;
        noKeyPressed = false;
    }


    this.enable = function() {
        blockPos      = player.getTargetPos();
        if(blockPos == null ) return;

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
        if(blockType !== Block.Tresor) return;
        if(resourceResponse === SR_Ok) {
            textArea.value        = text;
            textArea.disabled     = false;
            deleteButton.disabled = false;
            saveType              = ST_Update;
            textAreaPass.addEventListener("input", changeAction);
        }              
        if(resourceResponse === SR_PasswordInvalid) {
            textArea.value        = "Password Invalid";
            textArea.disabled     = true;
            deleteButton.disabled = true;
        }

        if(resourceResponse === SR_ResourceDoesNotExist) {
            saveType              = ST_Write;
            textArea.disabled     = false;
            deleteButton.disabled = true;
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