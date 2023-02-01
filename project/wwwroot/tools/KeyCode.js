'use strict';

const KeyCode = new function() {

    this.BACKSPACE = 8;
    this.RETURN    = 13;
    this.CONTROL   = 17;
    this.ESC       = 27;
    this.SPACE     = 32;
    this.PAGEUP    = 33;
    this.PAGEDOWN  = 34;
    this.END       = 35;        
    this.DELET     = 46;
    this.ArrUp     = 38;
    this.ArrDown   = 40;

    this.ALT       = 18;
    this.F1        = 112;
    this.F2        = 113;
    this.F3        = 114;
    this.F4        = 115;
    this.F5        = 116;
    this.F6        = 117;
    this.F7        = 118;
    this.F8        = 119;
    this.F9        = 120;
    this.F10       = 121;

    this.getFromEvent = function(event) {
        const keyCode = event.keyCode != 0 ? event.keyCode : event.which;
        return keyCode;
    }
    
}


