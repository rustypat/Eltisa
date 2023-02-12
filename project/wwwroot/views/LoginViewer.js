'use strict';

function LoginViewer(serverSocket, serverOut, startGame) {

    const baseDiv       = GuiTools.createBackgroundPanel();
    const panel         = GuiTools.createTransparentPanel(baseDiv, "300px", "300px");

    const nameField     = GuiTools.createEditField(panel, 30, "250px", "name");
                          GuiTools.createLineBreak(panel);
    const passwordField = GuiTools.createPasswordField(panel, 30, "250px", "password");
                          GuiTools.createLineBreak(panel);
    const startLocation = GuiTools.createDropDown(panel, "265px");
                          startLocation.setOptions("", "Forest", "Lake", "Ice Lake", "River Delta", "Plain", "Pillar Mountains", "Center", "Space");
                          GuiTools.createLineBreak(panel, 2);
    const enterButton   = GuiTools.createButton(panel, "Enter", requestLogin, "265px");

    nameField.autofocus           = true;

    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_Return] = requestLogin;
    this.getEventHandler = (eventId) => eventHandlers[eventId];
    this.getHtmlElement  = () => baseDiv;

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show and hide blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////
        

    function requestLogin() {
        const name     = nameField.value;
        const password = passwordField.value;
        serverSocket.connect();
        serverOut.requestLogin(name, password);
    }



    this.receiveLogin = function(response, actorId, actorType, actorName, actorColor) {
        if(response == SR_Ok) {
            const startLoc    = startLocation.getSelection();
            startGame(actorId, actorType, actorName, startLoc);
        }
        else {
            nameField.clear();
            passwordField.clear();
            startLocation.clear();
        }
    }




}
