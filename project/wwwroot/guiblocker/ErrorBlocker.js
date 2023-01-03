'use strict';

const ErrorType = { ConnectionLost: 1};


function ErrorBlocker(body, activateGame, deactivateGame) {

    const baseDiv            = GuiTools.createBaseDiv();
    const textDiv            = GuiTools.createDiv(baseDiv);        
    textDiv.style.textAlign  = "left";        
    GuiTools.createLineBreak(baseDiv);
    const buttonDiv          = GuiTools.createDiv(baseDiv);        
    const restartButton      = GuiTools.createButton(buttonDiv, "restart", restartAction);
    const exitButton         = GuiTools.createButton(buttonDiv, "exit", exitAction);        


    function restartAction() {
        window.location.reload();
        return false;     
    }


    function exitAction() {
        window.location.href='/Eltisa.htm';        
        return false;     
    }


    function setInfo(errorType) {
        if(errorType == ErrorType.ConnectionLost) {
            textDiv.innerHTML = 
            '                                                                <br />' +
            '<span style="font-size:30px">Error</span>                       <br />' +
            '                                                                <br />' +
            'The connection to the server was lost.                          <br />' +
            'possible reasons are:                                           <br />' +
            '- a bad internet connection                                     <br />' +
            '- the server is overloaded                                      <br />' +
            '- somebody else logged in with your name/password               <br />' +
            '                                                                <br />' +
            'You can try to restart or exit the game.                        <br />';
        }
        else {
            textDiv.innerHTML = 
            '                                                                <br />' +
            '<span style="font-size:30px">Unknown Error</span>               <br />' +
            'Complain at the programmer.                                     <br />';
            Log.error("unknown ErrorType " + errorType);
        }



    }


    this.show = function(infoType) {
        if(!body.contains(baseDiv)) {
            setInfo(infoType);
            body.appendChild(baseDiv);
        }
        deactivateGame();        
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }


}
