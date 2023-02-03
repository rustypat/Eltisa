'use strict';


function ScriptureViewer(body, activateGame, deacitvateGame, server) {

    const baseDiv            = GuiTools.createOverlayTransparent();
    const textArea           = GuiTools.createCenteredTextArrea(baseDiv, "50%", "50%", true);

    var blockPos;
    var blockData;
    const self               = this;


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    

    function closeAction()  {
        body.removeChild(baseDiv);       
        document.removeEventListener("keydown", keydownHandler);
        document.removeEventListener("click",   mouseLeftClickHandler); 
        activateGame();     
    }


    function keydownHandler(event) {
        const keyCode = KeyCode.getFromEvent(event);
    
        if( keyCode != KeyCode.SPACE ) return true;
        event.preventDefault();
        event.stopPropagation();
        closeAction();
        return false;
    }

    function mouseLeftClickHandler(event) {
        if( event.button != 0 ) return true;
        event.preventDefault();
        event.stopPropagation();
        closeAction();
        return false;
    }



    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////
        
    this.show = function(chunkStore, _blockPos) {
        blockPos             = _blockPos;
        blockData            = chunkStore.getBlockData(blockPos);
        if( !BlockData.isScripture(blockData) ) return false;
        
        deacitvateGame();

        if(!body.contains(baseDiv)) {
            body.appendChild(baseDiv);
        }

        textArea.value       = "";
        textArea.disabled    = true;
        document.addEventListener("keydown", keydownHandler);
        document.addEventListener("click",   mouseLeftClickHandler); 
        
        server.requestReadResource(blockPos, Block.Scripture, ""); 
        return true;
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }


    this.updateText = function(text) {
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
