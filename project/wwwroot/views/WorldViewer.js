'use strict';


function WorldViewer() {

    const handlers    = new Array(EV_Max);
    handlers[EV_Keyboard_F1]          = toggleRunMode;


    this.getEventHandler = function(eventId) {

    }


    function toggleRunMode() {

    }

}