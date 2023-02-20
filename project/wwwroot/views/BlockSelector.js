'use strict';

function BlockSelector(viewManager, carousel) {
    const self = this;

    // event definitions
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_F2]      = close;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;
    
    const baseDiv            = GuiTools.createOverlay(null, CLR_Glossy);
    baseDiv.style.paddingTop = '15px';             
    baseDiv.style.textAlign  = 'left';
    baseDiv.style.overflow   = 'auto';
    baseDiv.style.whiteSpace = 'nowrap'

    const buttonDiv          = GuiTools.createDiv(baseDiv);    
    buttonDiv.style.marginTop= '0px';
    buttonDiv.style.marginLeft= '15px';
    const natureButton       = GuiTools.createButton(buttonDiv, "Nature", natureAction);
    const buildButton        = GuiTools.createButton(buttonDiv, "Build", buildAction);
    const thingsButton       = GuiTools.createButton(buttonDiv, "Things", thingsAction);
    const specialButton      = GuiTools.createButton(buttonDiv, "Special", specialAction);
    const closeButton        = GuiTools.createCloseButton(buttonDiv, close);
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
        let index     = 0;
        let lineInfo  = CarouselInfo.getLineInfo(index++);
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


    function selectBlock(event) {
        const blockDefinition = event.currentTarget.blockDefinition; 
        carousel.setSelectedBlock(blockDefinition);
        close();
    }


    function close() {
        viewManager.unshow(self);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // blocks
    ///////////////////////////////////////////////////////////////////////////////////////////////////    


    function addBlockLine(parent, lineInfo) {
        const lineDescription = GuiTools.createLabel(parent, lineInfo.name);
        lineDescription.style.verticalAlign  = 'top';
        lineDescription.style.width          = '110px';
        lineDescription.style.whiteSpace     = 'normal'
        for(let i=0; i < lineInfo.length; i++) {
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
