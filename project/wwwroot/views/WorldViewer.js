'use strict';


function WorldViewer() {

    const handlers    = new Array(EV_Max);
    handlers[EV_Keyboard_F1]          = toggleRunMode;


    this.getEventHandler = function(eventId) {
        return handlers[eventId];
    }


    this.getHtmlElement = function() {

    }


    function toggleRunMode() {

    }

}