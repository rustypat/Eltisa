'use strict';


function WorldViewer() {

    const handlers    = new Array(EV_Max);
    handlers[SM_GetChunksResponse]          = receiveChunksMessage;


    this.getEventHandler = function(eventId) {

    }

}