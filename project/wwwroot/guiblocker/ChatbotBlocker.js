'Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved';
'use strict';


function ChatbotBlocker(body, activateGame, deacitvateGame) {

    const baseDiv            = GuiTools.createBaseDiv();
    const panel              = GuiTools.createTabletDiv(baseDiv);
    GuiTools.createMessageField(panel, "Hint: Only experts that know how to install the certificate from https://elbot_e.csoica.artificial-solutions.com in the browser can talk to Elbot!");
    const chatDiv            = GuiTools.createDiv(panel);    
    chatDiv.style.marginTop  = '5px';
    chatDiv.style.width      = '450px';
    chatDiv.style.height     = '600px';
    const iframe             = GuiTools.createIframe(chatDiv, "https://elbot_e.csoica.artificial-solutions.com/cgi-bin/elbot.cgi");       
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


    this.show = function(player, chunkStore, blockPos) {
        const blockData  = chunkStore.getBlockData(blockPos);
        if( !BlockData.isChatbot(blockData) ) return false;
        
        if(!body.contains(baseDiv)) {
            body.appendChild(baseDiv);
        }        
        document.addEventListener("keypress", keypressHandler);
        deacitvateGame();
        return true;
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }


}
