'use strict';


function ScriptureEditor(viewManager, serverIn, serverOut, player) {
    let blockPos;
    let blockData;
    let noKeyPressed;    
    const self               = this;

    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_F3]   = cancelAction;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;

    // gui elements
    const baseDiv            = GuiTools.createOverlay();
    GuiTools.createLineBreak(baseDiv, 3);    
    const textArea           = GuiTools.createTextArrea(baseDiv, "75%", "75%", changeAction);
    GuiTools.createLineBreak(baseDiv);    
    const buttonDiv          = GuiTools.createDiv(baseDiv);        
    const saveButton         = GuiTools.createButton(buttonDiv, "save",   saveAction);
    const cancelButton       = GuiTools.createButton(buttonDiv, "cancel", cancelAction);



    function saveAction()  {
        const text = textArea.value.trim();

        const changedScriptureDefinition = getChangedScriptureBlockDefinition(text);
        if( changedScriptureDefinition != null ) {
            serverOut.requestSwitchBlock(blockPos.x, blockPos.y, blockPos.z);
        }
        serverOut.requestWriteResource(blockPos, Block.Scripture, "", text); 
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
        noKeyPressed         = true;
        saveButton.disabled  = true;

        serverIn.receiveResourceHandler = updateText;
        serverOut.requestReadResource(blockPos, Block.Scripture, "");             
    }
    
    
    this.disable = function() {
        serverIn.receiveResourceHandler = null;
    }
    

    function updateText(messageType, blockType, resourceResponse, text) {
        textArea.value = text;
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
