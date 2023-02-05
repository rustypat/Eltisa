'use strict';

function LoginBlocker(body, activateGame, deactivateGame, serverSocket, serverOut) {

    var player;
    
    const baseDiv            = GuiTools.createOverlayOpaque(null, "loginDiv");
    baseDiv.style.paddingTop = '20px';       
    baseDiv.style.overflow   = 'auto';
    baseDiv.style.whiteSpace = 'nowrap'
    baseDiv.style.backgroundColor = 'rgb(148,207,232)';
    baseDiv.style.backgroundImage = 'linear-gradient(rgb(148,207,232) 10%, rgb(148,207,232), rgb(255, 255, 255))';
    if(Config.blackAndWhite) baseDiv.style.filter = "grayscale(1)";

    const nameField     = GuiTools.createTextInput(baseDiv, 20, "200px", "35px", "center");
                          GuiTools.createLineBreak(baseDiv);
    const passwordField = GuiTools.createTextInput(baseDiv, 20, "200px", "35px", "center");
                          GuiTools.createLineBreak(baseDiv, 2);
    const enterButton   = GuiTools.createButton(baseDiv, "Enter", loginAction, "204px", "40px");

    nameField.autofocus           = true;
    nameField.style.fontSize      = '18px';
    nameField.addEventListener('keypress', function(event) {
        if(event.keyCode==13) return loginAction(event);  // call enter when return is pressed
        return true;
    });

    passwordField.type            = 'password';
    passwordField.style.fontSize  = '18px';
    passwordField.addEventListener('keypress', function(event) {
        if(event.keyCode==13) return loginAction(event);  // call enter when return is pressed
        return true;
    });

    enterButton.style.fontSize  = '18px';

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show and hide blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////
        

    function loginAction(event) {
        if(event) event.stopPropagation();
        body.removeChild(baseDiv);
        
        const name     = nameField.value;
        const password = passwordField.value;
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('password', password);
        player.setCredentials(name, password);

        const urlParams              = new URLSearchParams(window.location.search);
        const playerPosX             = urlParams.get('x')
        const playerPosY             = urlParams.get('y');
        const playerPosZ             = urlParams.get('z');
        player.setPosition(playerPosX, playerPosY, playerPosZ);    
        serverSocket.connect();
        serverOut.requestLogin(name, password);
                
        return false;
    }


    this.show = function(_player) {
        player = _player;
        if(!body.contains(baseDiv)) {
            body.appendChild(baseDiv);
        }
        deactivateGame();              
        nameField.focus();
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }


}
