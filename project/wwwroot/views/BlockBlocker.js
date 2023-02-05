'use strict';

function BlockBlocker(body, activateGame, deactivateGame, carousel) {
    
    const baseDiv            = GuiTools.createOverlay();
    baseDiv.style.paddingTop = '15px';             
    baseDiv.style.textAlign  = 'left';
    baseDiv.style.overflow   = 'auto';
    baseDiv.style.whiteSpace = 'nowrap'
    if(Config.blackAndWhite) baseDiv.style.filter = "grayscale(1)";
    

    const buttonDiv          = GuiTools.createDiv(baseDiv);    
    buttonDiv.style.marginTop= '0px';
    buttonDiv.style.marginLeft= '15px';
    const natureButton       = GuiTools.createButton(buttonDiv, "Nature", natureAction);
    const buildButton        = GuiTools.createButton(buttonDiv, "Build", buildAction);
    const thingsButton       = GuiTools.createButton(buttonDiv, "Things", thingsAction);
    const specialButton      = GuiTools.createButton(buttonDiv, "Special", specialAction);
    const closeButton        = GuiTools.createCloseButton(buttonDiv, exitAction);
    closeButton.style.top    = '15px';
    closeButton.style.right  = '100px';
    GuiTools.createLineBreak(baseDiv, 2);

    const natureDiv          = GuiTools.createDiv(baseDiv);
    natureDiv.style.textAlign= 'left';
    natureDiv.style.marginLeft= '15px';
    natureDiv.style.width    = '1500px';
    natureDiv.style.height   = '830px';

    const buildDiv           = GuiTools.createDiv(baseDiv);
    buildDiv.hide();
    buildDiv.style.textAlign = 'left';
    buildDiv.style.marginLeft= '15px';
    buildDiv.style.width     = '1500px';
    buildDiv.style.height    = '840px';

    const thingsDiv          = GuiTools.createDiv(baseDiv);
    thingsDiv.hide();
    thingsDiv.style.textAlign= 'left';
    thingsDiv.style.marginLeft= '15px';
    thingsDiv.style.width    = '1500px';
    thingsDiv.style.height   = '830px';

    const specialDiv         = GuiTools.createDiv(baseDiv);
    specialDiv.hide();
    specialDiv.style.textAlign= 'left';
    specialDiv.style.marginLeft= '15px';
    specialDiv.style.width   = '1500px';
    specialDiv.style.height  = '840px';

    initialize();

    function initialize() {
        var index     = 0;
        var lineInfo  = CarouselInfo.getLineInfo(index++);
        while( lineInfo ) {
            if( lineInfo.lineType == CarouselInfo.LineTypes.Nature) {
                addBlockLine(natureDiv, lineInfo);
            }
            else if( lineInfo.lineType == CarouselInfo.LineTypes.Build) {
                addBlockLine(buildDiv, lineInfo);
            }
            else if( lineInfo.lineType == CarouselInfo.LineTypes.Things) {
                addBlockLine(thingsDiv, lineInfo);
            }
            else {
                addBlockLine(specialDiv, lineInfo);
            }
            lineInfo = CarouselInfo.getLineInfo(index++);
        }

    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    

    function natureAction() {
        natureDiv.show();
        buildDiv.hide();
        thingsDiv.hide();
        specialDiv.hide();
    }


    function buildAction() {
        natureDiv.hide();
        buildDiv.show();
        thingsDiv.hide();
        specialDiv.hide();
    }


    function thingsAction() {
        natureDiv.hide();
        buildDiv.hide();
        thingsDiv.show();
        specialDiv.hide();
    }


    function specialAction() {
        natureDiv.hide();
        buildDiv.hide();
        thingsDiv.hide();
        specialDiv.show();
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show and hide blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    function keydownHandler(event) {
        const keyCode = KeyCode.getFromEvent(event);
    
        if( keyCode == KeyCode.F2 ) {
            event.preventDefault();
            event.stopPropagation();
            return exitAction();
        }

        return true;
    }


    function mouseclickHandler(event) {
        if( event.button == 1 ) {  // wheel button
            event.preventDefault();
            event.stopPropagation();
            return exitAction();
        }    
        else {
            return true;
        }
    }
    

    
    function selectBlock(event) {
        if(event) event.stopPropagation();
        const blockDefinition = event.currentTarget.blockDefinition; 
        carousel.setSelectedBlock(blockDefinition);
        exitAction();
    }


    function exitAction(event) {
        if(event) event.stopPropagation();
        document.removeEventListener("keydown", keydownHandler);
        document.removeEventListener("click", mouseclickHandler); 
        body.removeChild(baseDiv);
        activateGame();
        return false;
    }



    this.show = function() {
        if(!body.contains(baseDiv)) {
            body.appendChild(baseDiv);
        }
        document.addEventListener("keydown", keydownHandler);        
        document.addEventListener("click", mouseclickHandler); 
        deactivateGame();      
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }

    
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // blocks
    ///////////////////////////////////////////////////////////////////////////////////////////////////    


    function addBlockLine(parent, lineInfo) {
        const lineDescription = GuiTools.createLabel(parent, lineInfo.name);
        lineDescription.style.verticalAlign  = 'top';
        lineDescription.style.width          = '110px';
        lineDescription.style.whiteSpace     = 'normal'
        for(var i=0; i < lineInfo.length; i++) {
            createBlockSelection(parent, lineInfo[i]);
        }        
        GuiTools.createLineBreak(parent);
    }

    function createBlockSelection(parent, block) {
        const info                     = CarouselInfo.getBlockInfo(block);
        const blockDiv                 = GuiTools.createDiv(parent);
        blockDiv.style.fontSize        = "12px";
        blockDiv.blockDefinition       = block;
        blockDiv.addEventListener("click", selectBlock);
        blockDiv.style.width           = '80px';
        blockDiv.style.height          = '100px';
        
        const label = GuiTools.createLabel(blockDiv, info.name);
        label.style.marginTop          = '12px';
        label.style.marginBottom       = '0px';
        label.style.marginLeft         = '0px';
        label.style.marginRight        = '0px';
        label.style.whiteSpace         = 'normal'
        GuiTools.createLineBreak(blockDiv);
        const image = GuiTools.createImage(blockDiv, "/resources/icons/" + info.icon);
        image.style.marginTop          = '0px';
        if(info.description) image.title   = info.description;

        return blockDiv;
    }


}
