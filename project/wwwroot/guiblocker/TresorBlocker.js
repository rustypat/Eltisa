'use strict';


function TresorBlocker(body, activateGame, deacitvateGame, server) {

    const baseDiv            = GuiTools.createBaseDivLight();
    const textAreaPass       = GuiTools.createTextInput(baseDiv, null, "50%", "5%", "left", "Passwort");
    GuiTools.createLineBreak(baseDiv);
    const textArea           = GuiTools.createTextArrea(baseDiv, "50%", "65%");
    GuiTools.createLineBreak(baseDiv);    
    const buttonDiv          = GuiTools.createDiv(baseDiv);        
    const saveButton         = GuiTools.createButton(buttonDiv, "save",   saveAction);
    const cancelButton       = GuiTools.createButton(buttonDiv, "cancel", cancelAction);
    const deleteButton       = GuiTools.createButton(buttonDiv, "delete", deleteAction);
    let password;

    var blockPos;
    var blockData;
    var noKeyPressed;    
    const self               = this;


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    

    function getBlockResource() {
        password = textAreaPass.value.trim();
        console.log("pwd : " + password);
        server.requestReadResource(blockPos, Block.Tresor, password);
    }
    


    function saveAction(event)  {
        if(event) event.stopPropagation();
        const text = textArea.value.trim();
        const newPassword = textAreaPass.value.trim();
        console.log("Save Tresor NewPassword : " + newPassword)
        server.requestWriteResource(blockPos, Block.Tresor, password, text); 
        body.removeChild(baseDiv);      
        document.removeEventListener("keydown", keypressHandler);
        activateGame();     
    }


    function cancelAction(event)  {
        if(event) event.stopPropagation();
        body.removeChild(baseDiv);   
        document.removeEventListener("keydown", keypressHandler);
        activateGame();     
    }

    function deleteAction(event) {
        if(event) event.stopPropagation();
        server.requestWriteResource(blockPos, Block.Tresor, password, "");
        body.removeChild(baseDiv);      
        document.removeEventListener("keydown", keypressHandler);
        activateGame();
    }


    function keypressHandler(event) {
        if( document.activeElement != textArea && noKeyPressed && event.key == " " ) {
            cancelAction();         
        }
        else if( document.activeElement == textArea) {
            saveButton.disabled = false;
            noKeyPressed = false;
        }
        else if (event.code === "Enter" && document.activeElement === textAreaPass) {
            getBlockResource();
        }
        else if(document.activeElement === textAreaPass){
            textAreaPass.focus();
        }
        else {
            textArea.focus();
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////
        
    this.show = function(chunkStore, _blockPos) {
        blockPos             = _blockPos;
        blockData            = chunkStore.getBlockData(blockPos);
        if( !BlockData.isTresor(blockData) ) return false;


        textArea.value       = "";
        textAreaPass.value   = "";
        password             = "";
        getBlockResource();
        

        if(!body.contains(baseDiv)) {
            body.appendChild(baseDiv);
        }
        
        document.addEventListener("keydown", keypressHandler);
        noKeyPressed         = true;
        saveButton.disabled  = true;
         
        deacitvateGame();

        return true;
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }


    this.updateText = function(resourceMessage) {
        if( self.isVisible() ) {
            textArea.value = resourceMessage;
            if(resourceMessage === "PASSWORD REQUIRED" || resourceMessage === "WRONG PASSWORD") textArea.disabled = true;
            else textArea.disabled = false;
        }
    }


}