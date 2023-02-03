'use strict';

function BossBlocker(body) {

    var baseDiv;
    
    this.show = function() {
        if(!baseDiv) {
            baseDiv                  = GuiTools.createOverlayOpaque(null);
            const iframe             = GuiTools.createIframe(baseDiv, "https://informatrix.ch/", "100%", "100%");
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
