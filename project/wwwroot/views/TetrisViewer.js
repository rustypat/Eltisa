'use strict';


function TetrisViewer(viewManager) {
    const self = this;

    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_Space]   = close;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;

    // gui elements
    const baseDiv            = GuiTools.createOverlayTransparent();
    const panel              = GuiTools.createCenteredPanel(baseDiv, "500px", "800px");
    panel.style.backgroundColor = "rgba(250, 160, 0, 0.8)";

    const headerDiv           = GuiTools.createDiv(panel);
    headerDiv.style.position  = "relative";
    headerDiv.style.width     = "400px"
    const title               = GuiTools.createTitle(headerDiv, "Tetris");
    title.style.margin        = '0px';
    const closeButton         = GuiTools.createCloseButton(headerDiv, close);
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
    const cancelButton       = GuiTools.createButton(panel, "close", close);

    

    this.enable = function() {
        $('.game').blockrain({theme:"candy", speed:10});
    }


    function close() {
        viewManager.unshow(self);
    }


}
