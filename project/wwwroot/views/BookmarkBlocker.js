'use strict';

function BookmarkBlocker(body, activateGame, deactivateGame) {
    let player;
    
    const baseDiv            = GuiTools.createOverlay();
    
    const panel              = GuiTools.createTabletDiv(baseDiv);
    panel.style.width        = '90%';
    
    const closeDiv           = GuiTools.createCloseButtonDiv(panel);    
    const closeButton        = GuiTools.createCloseButton(closeDiv, exitAction);

    GuiTools.createLineBreak(panel, 4);
    GuiTools.createText(panel, "If you want to return to this position, bookmark this page by pressing now:");
    GuiTools.createLineBreak(panel, 2);
    GuiTools.createText(panel, "Control-D").style.color = 'blue';
    GuiTools.createLineBreak(panel, 3);
    GuiTools.createText(panel, "or  drag the following url to your desktop:");
    GuiTools.createLineBreak(panel, 2);
    const link = GuiTools.createLink(panel, "Eltisa Link", "https://eltisa.ch" );
    GuiTools.createLineBreak(panel, 3);
    GuiTools.createText(panel, 'or send a link to your friend:');    
    GuiTools.createLineBreak(panel, 2);
    const mail = GuiTools.createLink(panel, "Eltisa Mail", "mailto:eltisa@mailinator.com?subject=Look what I have build&body=Hello" );
    GuiTools.createLineBreak(panel, 2);
    GuiTools.createButton(panel, "close", exitAction);

    link.addEventListener("click", function(event){
        event.preventDefault()
    });
    

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show and hide blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    function setLink() {
        const pos       = player.getPosition();
        const x         = Math.floor(pos.x);
        const y         = Math.floor(pos.y) + 10;
        const z         = Math.floor(pos.z);
        let params      = "x=" + x + "&y=" + y + "&z=" + z;
        let caption     = "Eltisa " + x + " " + y + " " + z;
        
        let url         = window.location.origin;
        link.href       = url + "?" + params;
        link.title      = caption;
        link.innerText  = caption;
    }


    function setMail() {
        const pos       = player.getPosition();
        const x         = Math.floor(pos.x);
        const y         = Math.floor(pos.y) + 10;
        const z         = Math.floor(pos.z);
        let params      = "x=" + x + "&y=" + y + "&z=" + z;
        
        let url         = window.location.origin;
        mail.href       = 'mailto:?subject=Eltisa&body=' + escape("Hello my friend\nlook, what I have build:\n\n" + url + "?" + params + " \n\n regards " + player.getName());

        window.history.replaceState(null, null, "?hello=world");
    }


    function setBookmarkUrl() {
        const pos       = player.getPosition();
        const x         = Math.floor(pos.x);
        const y         = Math.floor(pos.y) + 10;
        const z         = Math.floor(pos.z);
        let params      = "x=" + x + "&y=" + y + "&z=" + z;
        let caption     = "Eltisa " + x + "/" + y + "/" + z;

        document.title  = caption;
        window.history.replaceState(null, null, "?" + params);
    }


    function keydownHandler(event) {
        const keyCode = KeyCode.getFromEvent(event);
    
        if( keyCode == KeyCode.F6 ) {
            event.preventDefault();
            event.stopPropagation();
            return exitAction();
        }

        return true;
    }


    function exitAction(event) {
        if(event) event.stopPropagation();
        document.removeEventListener("keydown", keydownHandler);
        body.removeChild(baseDiv);
        activateGame();
        return false;
    }



    this.show = function(_player) {
        player = _player;
        if(!body.contains(baseDiv)) {
            body.appendChild(baseDiv);
        }
        document.addEventListener("keydown", keydownHandler);        
        deactivateGame();      

        setLink();
        setMail();
        setBookmarkUrl();
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }

    

}
