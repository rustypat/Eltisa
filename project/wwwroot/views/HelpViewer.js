'use strict';

function HelpViewer(viewManager, serverOut, exitAction) {
    const self = this;

    // events

    const eventHandlers    = new Array(EV_Max);
    //eventHandlers[EV_Keyboard_Escape]  = playAction;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement = () => baseDiv;

    // gui elements

    const baseDiv            = GuiTools.createOverlay(null, CLR_Glossy);
    baseDiv.style.paddingTop = '20px';       
    baseDiv.style.overflow   = 'auto';
    baseDiv.style.whiteSpace = 'nowrap'
    
    const buttonDiv          = GuiTools.createDiv(baseDiv);        
    const playButton         = GuiTools.createButton(buttonDiv, "play", playAction);
    const helpButton         = GuiTools.createButton(buttonDiv, "help", helpAction);
    const exitButton         = GuiTools.createButton(buttonDiv, "exit", exitAction);
    GuiTools.createLineBreak(baseDiv, 4);

    const infoDiv            = GuiTools.createDiv(baseDiv);
    infoDiv.style.width      = '90%';
    infoDiv.style.textAlign  = 'left';
    GuiTools.createLineBreak(infoDiv, 1);
    const nameLabel          = GuiTools.createLabel(infoDiv, "now online:");
    nameLabel.style.marginBottom = '0px';

    const nameList           = GuiTools.createList(infoDiv, '5');

    const helpDiv            = GuiTools.createDiv(baseDiv);
    helpDiv.style.width      = '700px';
    helpDiv.style.height     = '900px';
    helpDiv.hide();
    GuiTools.createTitle(helpDiv, "Instructions");
    const helpTable = GuiTools.createTable(helpDiv);
    GuiTools.createTableRow(helpTable, "ESC", "get back to this menu");
    GuiTools.createTableRow(helpTable, "ARROWS ↑ ↓ → ←", "move player");
    GuiTools.createTableRow(helpTable, "MOUSE", "look around");
    GuiTools.createTableRow(helpTable, "CTRL", "jump");
    GuiTools.createTableRow(helpTable, "SPACE", " open doors, turn on lampls, activate special blocks...");
    GuiTools.createTableRow(helpTable, "F1", "toggle walk, run mode");
    GuiTools.createTableRow(helpTable, "F2", "show block selection");
    GuiTools.createTableRow(helpTable, "F3", "change direction of doors, windows, ...");
    GuiTools.createTableRow(helpTable, "F4", "start video chat");
    GuiTools.createTableRow(helpTable, "F5", "toggle visibility range");
    GuiTools.createTableRow(helpTable, "F6", "bookmark the current position, or send it as an email");
    GuiTools.createTableRow(helpTable, "F11", "toggle full screen mode ");
    GuiTools.createTableRow(helpTable, "LEFT MOUSE BUTTON", "add block");
    GuiTools.createTableRow(helpTable, "RIGHT MOUSE BUTTON", "remove block");
    GuiTools.createTableRow(helpTable, "MOUSE WHEEL", "select block type");
    GuiTools.createTableRow(helpTable, "MOUSE WHEEL CLICK", "show block selection");
    GuiTools.createTableRow(helpTable, "PAGEUP, PAGEDOWN", "select block type");
    GuiTools.createTableRow(helpTable, "SHIFT + MOUSE WHEEL", "select block subtype");
    GuiTools.createTableRow(helpTable, "SHIFT + PAGEUP", "select block subtype");
    GuiTools.createLineBreak(helpDiv);
    GuiTools.createText(helpDiv, "To chat just write and press RETURN to send. If you point at another player, ");
    GuiTools.createLineBreak(helpDiv);
    GuiTools.createText(helpDiv, "the message will specificaly go to him, otherwise to all.");
    GuiTools.createLineBreak(helpDiv);
    GuiTools.createText(helpDiv, "Visitors can only build in the positiv coordinat quadrant.");
    GuiTools.createLineBreak(helpDiv, 2);
    

    GuiTools.createTitle(helpDiv, "Credits");
    GuiTools.createLineBreak(helpDiv);
    GuiTools.createText(helpDiv, "The world is an import from "); 
    GuiTools.createLink(helpDiv, "imbilios", "https://www.planetminecraft.com/project/downloadcinematic-custom-biome-terrain-map-4kx4k-worldpainterworldmachine/");
    GuiTools.createText(helpDiv, " great work"); 
    GuiTools.createLineBreak(helpDiv);
    GuiTools.createText(helpDiv, "The textures ");
    GuiTools.createLink(helpDiv, "1", "http://eltisa.ch/resources/solidAtlas.png");
    GuiTools.createText(helpDiv, ", "); 
    GuiTools.createLink(helpDiv, "2", "http://eltisa.ch/resources/transparentAtlas.png");
    GuiTools.createText(helpDiv, " and icons are a remix from ");
    GuiTools.createLink(helpDiv, "Ovoceans", "https://www.planetminecraft.com/texture_pack/ovos-rustic-pack/");
    GuiTools.createText(helpDiv, " awsom Rustic redemption Pack under ");
    GuiTools.createLink(helpDiv, "Creative Common License", "https://creativecommons.org/licenses/by-nc-sa/3.0/");
    GuiTools.createLineBreak(helpDiv);
    GuiTools.createLink(helpDiv, "Blockrain", "https://aerolab.github.io/blockrain.js/");
    GuiTools.createText(helpDiv, " was developed by ");
    GuiTools.createLink(helpDiv, "Aerolab", "https://aerolab.co/");
    GuiTools.createText(helpDiv, " and ");
    GuiTools.createLink(helpDiv, "Peter Coles", "https://mrcoles.com/tetris/");
    GuiTools.createText(helpDiv, " under ");
    GuiTools.createLink(helpDiv, "MIT License", "https://opensource.org/licenses/MIT");
    GuiTools.createLineBreak(helpDiv);
    GuiTools.createLink(helpDiv, "Quill", "https://quilljs.com");
    GuiTools.createText(helpDiv, " is developed by ");
    GuiTools.createLink(helpDiv, "slab", "https://slab.com/");
    GuiTools.createText(helpDiv, " under BSD License");
    GuiTools.createLineBreak(helpDiv);
    GuiTools.createText(helpDiv, "The telephone ring was recorded by transitking, License Attribution 3.0");
    GuiTools.createLineBreak(helpDiv, 2);
    GuiTools.createText(helpDiv, "None of the above have any relationship to this project.");
    GuiTools.createLineBreak(helpDiv);
    GuiTools.createText(helpDiv, 'Eltisa coding by rustypat and henrikTheProgrammer 2018-2023');
    GuiTools.createLineBreak(helpDiv);
    GuiTools.createText(helpDiv, "Version " + Config.version);
    if( Config.debug ) GuiTools.createText(helpDiv, ", debug");
    GuiTools.createLineBreak(helpDiv);
    GuiTools.createLink(helpDiv, "eltisa.ch", "http://eltisa.ch");


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    

    function helpAction() {
        helpButton.set("info", infoAction);
        infoDiv.hide();
        helpDiv.show();
    }


    function infoAction() {
        helpButton.set("help", helpAction);
        infoDiv.show();
        helpDiv.hide();
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show and hide blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////
        

    function playAction() {
        viewManager.unshow(self);
    }


    this.enable = function() {
        serverIn.receiveActorListObserver.add(updateActorList);
        serverIn.actorJoinedObserver.add(handleActorJoined);
        serverIn.actorLeftObserver.add(handleActorLeft);
        serverOut.requestListActors();                
    }


    this.disable = function() {
        serverIn.actorJoinedObserver.remove(handleActorJoined);
        serverIn.actorLeftObserver.remove(handleActorLeft);
        serverIn.receiveActorListObserver.remove(updateActorList);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // name list
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    

    function updateActorList(actors) {
        nameList.clearEntries();
        for(const actor of actors) {
            nameList.addEntry(actor.name);
        }
    }
    


    function handleActorJoined(id, name, type, look) {
        if(!nameList.containsEntry(name)) {
            nameList.addEntry(name);
        }
    }


    function handleActorLeft(id, name) {
        nameList.removeEntry(name);
    }

}
