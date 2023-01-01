'Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved';
'use strict';


function ScriptureBlocker(body, activateGame, deacitvateGame, server) {

    const baseDiv            = GuiTools.createBaseDiv();
    const textArea           = GuiTools.createTextArrea(baseDiv, "80%", "80%");
    GuiTools.createLineBreak(baseDiv);    
    const buttonDiv          = GuiTools.createDiv(baseDiv);        
    const saveButton         = GuiTools.createButton(buttonDiv, "save",   saveAction);
    const cancelButton       = GuiTools.createButton(buttonDiv, "cancel", cancelAction);

    var blockPos;
    var blockData;
    var noKeyPressed;    
    const self               = this;


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    

    function saveAction()  {
        const text = textArea.value.trim();

        const changedScriptureDefinition = getChangedScriptureBlockDefinition(text);
        if( changedScriptureDefinition != null ) {
            server.requestSwitchBlock(blockPos.x, blockPos.y, blockPos.z);
        }
        server.requestSaveBlockResource(blockPos, Block.Scripture, text); 
        body.removeChild(baseDiv);      
        document.removeEventListener("keypress", keypressHandler);
        activateGame();     
    }


    function cancelAction()  {
        body.removeChild(baseDiv);       
        document.removeEventListener("keypress", keypressHandler);
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
        if( !BlockData.isScripture(blockData) ) return false;
        

        if(!body.contains(baseDiv)) {
            body.appendChild(baseDiv);
        }
        textArea.value       = "";
        document.addEventListener("keypress", keypressHandler);
        noKeyPressed         = true;
        saveButton.disabled  = true;
        
        server.requestBlockResource(blockPos, Block.Scripture); 
        deacitvateGame();

        return true;
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }


    this.handleBlockResourceMessage = function(resourceMessage) {
        if( self.isVisible() ) {
            textArea.value = resourceMessage.text;
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // support methods
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    
    function getChangedScriptureBlockDefinition(text) {
        const currentScriptureDefinition = BlockData.getDefinition(blockData);

        if( text.length > 0) {
            if( currentScriptureDefinition == Block.Scripture   ) return Block.ScriptureUsed;
            if( currentScriptureDefinition == Block.Scripture+1 ) return Block.ScriptureUsed+1;
            if( currentScriptureDefinition == Block.Scripture+2 ) return Block.ScriptureUsed+2;
            if( currentScriptureDefinition == Block.Scripture+3 ) return Block.ScriptureUsed+3;
        }
        else {
            if( currentScriptureDefinition == Block.ScriptureUsed   ) return Block.Scripture;
            if( currentScriptureDefinition == Block.ScriptureUsed+1 ) return Block.Scripture+1;
            if( currentScriptureDefinition == Block.ScriptureUsed+2 ) return Block.Scripture+2;
            if( currentScriptureDefinition == Block.ScriptureUsed+3 ) return Block.Scripture+3;
        }
        return null;
    }


}
