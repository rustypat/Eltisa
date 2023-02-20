'use strict';


function PortalEditor(viewManager, serverIn, serverOut, player) {
    const self               = this;
    let blockPos;

    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_F3]   = closeAction;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;

    // gui elements
    const baseDiv            = GuiTools.createOverlay(null, CLR_GlossyLight);
    const panel              = GuiTools.createCenteredPanel(baseDiv, "550px", "300px").setGradient('#00dee7', '#00627c');
    const closeDiv           = GuiTools.createCloseButtonDiv(panel);    
    const closeButton        = GuiTools.createCloseButton(closeDiv, closeAction);

    GuiTools.createLineBreak(panel, 2);
    GuiTools.createTitle(panel, "Warning");
    GuiTools.createLineBreak(panel, 2);
    const textDiv            = GuiTools.createDiv(panel);
    GuiTools.createText(textDiv, "Only for experts. Use with caution!");
    GuiTools.createLineBreak(textDiv);
    GuiTools.createText(textDiv, "If you know what your doing, enter teleport target coordinate.");
    GuiTools.createLineBreak(panel, 2);
    GuiTools.createLabel(panel, "x / y / z:", '100px');
    const targetX            = GuiTools.createNumberInput(panel, -524280, 524280, changeAction);
    const targetY            = GuiTools.createNumberInput(panel, -16380, 16380, changeAction);
    const targetZ            = GuiTools.createNumberInput(panel, -524280, 524280, changeAction);
    GuiTools.createLineBreak(panel);
    GuiTools.createLabel(panel, "description:", '100px');
    const description        = GuiTools.createEditField(panel, '150', '290px');
    GuiTools.createLineBreak(panel);
    const teleportButton     = GuiTools.createButton(panel, "teleport", teleportAction);
    const saveButton         = GuiTools.createButton(panel, "save",     saveAction);
    const cancelButton       = GuiTools.createButton(panel, "cancel",   closeAction);


    
    function getTargetPos() {
        const targetPos                = {};
        targetPos.description          = description.getText();
        targetPos.x                    = parseInt(targetX.value); 
        targetPos.y                    = parseInt(targetY.value); 
        targetPos.z                    = parseInt(targetZ.value); 

        const radiusHorizontal         = Config.worldRadius-Config.chunkSize; 
        const radiusVertical           = Config.worldRadiusVertical-Config.chunkSize; 
        if( !targetPos.x.isInRange( -radiusHorizontal, radiusHorizontal) ) return null;
        if( !targetPos.y.isInRange( -radiusVertical,   radiusVertical)   ) return null;
        if( !targetPos.z.isInRange( -radiusHorizontal, radiusHorizontal) ) return null;
        return targetPos;
    }


    function teleportAction()  {
        const targetPos = getTargetPos();
        if( !targetPos ) return;
        player.setPosition(targetPos.x, targetPos.y, targetPos.z);
        closeAction();
    }


    function closeAction()  {
        viewManager.unshow(self);
    }


    function saveAction() {
        const targetPos = getTargetPos();
        if( !targetPos ) return;
        const text = JSON.stringify(targetPos);
        serverOut.requestWriteResource(blockPos, Block.Portal, "", text); 
        viewManager.unshow(self);
    }
    

    function changeAction() {
        teleportButton.disabled = false;
    }


    this.enable = function() {
        blockPos      = player.getTargetPos();
        if( blockPos == null ) return;
        
        targetX.focus();
        const playerPos = player.getPosition();
        targetX.value   = Math.floor(playerPos.x);
        targetY.value   = Math.floor(playerPos.y);
        targetZ.value   = Math.floor(playerPos.z);
        description.setText("");
        targetX.select();
        
        serverIn.receiveResourceHandler = updateContent;
        serverOut.requestReadResource(blockPos, Block.Portal, ""); 
    }


    this.disable = function() {
        serverIn.receiveResourceHandler = null;
    }
    

    function updateContent(messageType, blockType, resourceResponse, jsonText, targetId) {
        if( resourceResponse == SR_Ok && blockType==Block.Portal && messageType == SM_ReadResourceResponse) {
            const targetPos = JSON.parse(jsonText);
            targetX.value              = targetPos.x;
            targetY.value              = targetPos.y;
            targetZ.value              = targetPos.z;            
            description.setText(targetPos.description);
            teleportButton.disabled    = false;        
        }
    }

}
