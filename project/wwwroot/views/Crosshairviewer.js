'use strict';

function CrosshairViewer(body) {
    const crosshair      = GuiTools.createCenteredImage(body, "/resources/crosshair.png");
    this.getEventHandler = (eventType) => null;
    this.getHtmlElement  = () => crosshair;
}

