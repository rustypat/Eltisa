'use strict';


function ViewManager() {

    const viewStack          = [];
    const body               = document.getElementsByTagName("body")[0];
    const self               = this;

    this.clear = function() {
        while(viewStack.length > 0) {
            viewStack.pop();
        }
    }

    this.show = function(view) {
        if(viewStack.contains(view)) return;
        viewStack.push(view);
        const baseDiv = view.getHtmlElement();
        if(!body.contains(baseDiv)) body.appendChild(baseDiv);
        view.isModal = false;
    }

    this.showModal = function(view) {
        self.show(view);
        view.isModal = true;
    }

    this.showCanvas = function(view) {
        self.show(view);
        view.isCanvas = true;
    }

    this.unshow = function(view) {
        if(viewStack.peek() != view) return;
        viewStack.pop();
        const baseDiv = view.getHtmlElement();
        body.removeChild(baseDiv);
    }


    

}