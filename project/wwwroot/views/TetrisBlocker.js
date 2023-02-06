'use strict';


function TetrisBlocker(body, activateGame, deacitvateGame) {

    const baseDiv            = GuiTools.createOverlay();
    const panel              = GuiTools.createTabletDiv(baseDiv);

    const headerDiv           = GuiTools.createDiv(panel);
    headerDiv.style.position  = "relative";
    headerDiv.style.width     = "400px"
    const title               = GuiTools.createTitle(headerDiv, "Tetris");
    title.style.margin        = '0px';
    const closeButton         = GuiTools.createCloseButton(headerDiv, closeAction);
    closeButton.style.margin  = '0px';
    closeButton.style.marginTop  = '5px';


    GuiTools.createLineBreak(panel);
    const tetrisDiv          = GuiTools.createDiv(panel);    
    tetrisDiv.className      = "game";
    tetrisDiv.style.marginTop= '5px';
    tetrisDiv.style.width    = '400px';
    tetrisDiv.style.height   = '700px';
    tetrisDiv.style.backgroundColor = "green";
        $('.game').blockrain({theme:"candy", speed:15});
    
    GuiTools.createLineBreak(panel);        
    const cancelButton       = GuiTools.createButton(panel, "close", closeAction);

    

    function closeAction(event)  {
        if(event) event.stopPropagation();
        document.removeEventListener("keypress", keypressHandler);
        activateGame();     
        body.removeChild(baseDiv);     
    }


    function keypressHandler(event) {
        if( event.key == " " ) {
            closeAction();         
        }
    }


    this.show = function(chunkStore, blockPos) {
        const blockData  = chunkStore.getBlockData(blockPos);
        if( !BlockData.isTetris(blockData) ) return false;
        
        if(!body.contains(baseDiv)) {
            body.appendChild(baseDiv);
        }        
        document.addEventListener("keypress", keypressHandler);
        deacitvateGame();

        $('.game').blockrain({theme:"candy", speed:10});
        return true;
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }


}
