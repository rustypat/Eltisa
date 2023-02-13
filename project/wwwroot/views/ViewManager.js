'use strict';


function ViewManager() {

    const viewStack          = [];
    const body               = document.getElementsByTagName("body")[0];
    const self               = this;

    registerGlobalHandler();

    this.clear = function() {
        while(viewStack.length > 0) {
            const view = viewStack.pop();
            view.disable?.();
            const baseDiv = view.getHtmlElement();
            body.removeChild(baseDiv);
            }
    }

    this.show = function(view) {
        if(viewStack.includes(view)) return;
        viewStack.push(view);
        const baseDiv = view.getHtmlElement();
        if(!body.contains(baseDiv)) body.appendChild(baseDiv);
        view.enable?.();
        view.isModal = false;
    }

    this.showModal = function(view) {
        if(viewStack.includes(view)) return;
        viewStack.forEach(v => v.disable?.());
        viewStack.push(view);
        const baseDiv = view.getHtmlElement();
        if(!body.contains(baseDiv)) body.appendChild(baseDiv);
        view.enable?.();
        view.isModal = true;
    }


    this.unshow = function(view) {
        if(viewStack[viewStack.length-1] != view) return;
        viewStack.pop();
        view.disable?.();
        const baseDiv = view.getHtmlElement();        
        body.removeChild(baseDiv);
        if(view.isModal) viewStack.forEach(v => v.enable?.());
    }
    

    function registerGlobalHandler() {
        //document.addEventListener("contextmenu", contextMenuHandler);
        //document.addEventListener("keypress",    keypressHandler);
        document.addEventListener( "keydown",             keydownHandler);
        document.addEventListener( "mousemove",           mouseMoveHandler);
        document.addEventListener( "click",               clickHandler); 
        document.addEventListener( "auxclick",            auxclickHandler); 
        document.addEventListener( "wheel",               wheelHandler);
        document.addEventListener( 'pointerlockchange',   pointerlockchangeHandler);
        window.addEventListener(   "resize",              windowResizeHandler);    
    }


    function windowResizeHandler(event) {
        const eventType    = EV_Window_Resize;
        const eventHandler = searchEventHandler(eventType);
        if(eventType != EV_Invalid && eventHandler) {
            event.preventDefault();
            event.stopPropagation();
            eventHandler();
            return false;
        }
        else {
            return true;
        }
    }


    function keypressHandler(event) {
        // if (event.key.length == 1) {
        //     chat.addText(event.key);
        // }    
    }


    function mouseMoveHandler(event) {
        const eventType    = EV_Mouse_Move;
        const eventHandler = searchEventHandler(eventType);
        if(eventType != EV_Invalid && eventHandler) {
            try {
                eventHandler();
            } catch(e) {
                log.error(e);
            }
        }
        return true;
    }


    function wheelHandler(event) {
        let eventType = EV_Invalid;
        if(event.deltaY > 0) {    
            if(event.shiftKey) eventType = EV_Wheel_Shift_Down;
            else               eventType = EV_Wheel_Down;
        }
        if(event.deltaY < 0) {
            if(event.shiftKey) eventType = EV_Wheel_Shift_Up;
            else               eventType = EV_Wheel_Up;
        }
        const eventHandler = searchEventHandler(eventType);
        return callEventHandler(event, eventHandler);
    }


    function clickHandler( event ) {
        let eventType = EV_Invalid;
        if( event.button == 0 ) eventType = EV_Mouse_Left;
        else if(event.button == 1) eventType = EV_Mouse_Center;
        else if(event.button == 2) eventType = EV_Mouse_Right;

        const eventHandler = searchEventHandler(eventType);
        return callEventHandler(event, eventHandler);
    }

    
    function auxclickHandler( event ) {
        let eventType = EV_Invalid;
        if( event.button == 0 ) eventType = EV_Mouse_Left;
        else if(event.button == 1) eventType = EV_Mouse_Center;
        else if(event.button == 2) eventType = EV_Mouse_Right;

        const eventHandler = searchEventHandler(eventType);
        return callEventHandler(event, eventHandler);
    }

    
    function pointerlockchangeHandler( event ) {
        let eventType = EV_Invalid;
        if( !document.pointerLockElement ) eventType = EV_Keyboard_Escape;
        
        const eventHandler = searchEventHandler(eventType);
        return callEventHandler(event, eventHandler);
    }


    function keydownHandler(event) {
        const keyCode = KeyCode.getFromEvent(event);
        let eventType = EV_Invalid;
        if( keyCode == KeyCode.BACKSPACE || keyCode == KeyCode.DELETE ) eventType = EV_Keyboard_Delete;
        else if( keyCode == KeyCode.CONTROL ) eventType = EV_Keyboard_Control;
        else if( keyCode == KeyCode.RETURN ) eventType = EV_Keyboard_Return;
        else if( keyCode == KeyCode.F1 ) eventType = EV_Keyboard_F1;
        else if( keyCode == KeyCode.F2 ) eventType = EV_Keyboard_F2;
        else if( keyCode == KeyCode.F3 ) eventType = EV_Keyboard_F3;
        else if( keyCode == KeyCode.F4 ) eventType = EV_Keyboard_F4;
        else if( keyCode == KeyCode.F5 ) eventType = EV_Keyboard_F5;
        else if( keyCode == KeyCode.F6 ) eventType = EV_Keyboard_F6;
        else if( keyCode == KeyCode.F7 ) eventType = EV_Keyboard_F7;
        else if( keyCode == KeyCode.SPACE ) eventType = EV_Keyboard_Space;
        else if( keyCode == KeyCode.ESC ) eventType = EV_Keyboard_Escape;
        else if( keyCode == KeyCode.PAGEUP )  {
            if(event.shiftKey) eventType = EV_Keyboard_Shift_PageUp;
            else               eventType = EV_Keyboard_PageUp;
        }
        else if( keyCode == KeyCode.PAGEDOWN ) {
            if(event.shiftKey) eventType = EV_Keyboard_Shift_PageDown;
            else               eventType = EV_Keyboard_PageDown;
        } 

        const eventHandler = searchEventHandler(eventType);
        return callEventHandler(event, eventHandler);
    }


    function searchEventHandler(eventType) {
        if(eventType == EV_Invalid) return null;
        for (let i = viewStack.length - 1; i >= 0; i--) {
            const view = viewStack[i];
            const handler = view.getEventHandler?.(eventType);
            if(handler) return handler;
            if(view.isModal) return null;
        }        
        return null;
    }


    function callEventHandler(event, eventHandler) {
        if(eventHandler) {
            event.preventDefault();
            event.stopPropagation();
            try {
                eventHandler();
            } catch(e) {
                log.error(e);
            }
            return false;
        }
        else {
            return true;
        }
    }

}