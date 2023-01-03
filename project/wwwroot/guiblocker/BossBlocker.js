'use strict';

function BossBlocker(body) {

    var baseDiv;
    
    this.show = function() {
        if(!baseDiv) {
            baseDiv                  = GuiTools.createBaseDiv(null, true);
            const iframe             = GuiTools.createIframe(baseDiv, "https://startpage.com/");
            baseDiv.style.zIndex     = "998";
            iframe.style.zIndex      = "999";
        }

        body.appendChild(baseDiv);
        // bring focus back to owner document, so that it can listen for end key
        setTimeout( function() {document.activeElement.blur();}, 1000);
    }


    this.hide = function() {
        body.removeChild(baseDiv);
        return false;        
    }    
    

    this.isVisible = function() {
        return baseDiv && body.contains(baseDiv);
    }


}
