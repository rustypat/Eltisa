'use strict';


function OracleEditor(viewManager, serverIn, serverOut, player) {
    const self = this;
    let blockPos;
    let blockData;
    let text;

    // event handler
    const eventHandlers    = new Array(EV_Max);
    eventHandlers[EV_Keyboard_F3]   = closeAction;
    this.getEventHandler = (eventType) => eventHandlers[eventType];
    this.getHtmlElement  = () => baseDiv;

    // gui elements
    const baseDiv            = GuiTools.createOverlay(null, CLR_GlossyLight);
    const panel              = GuiTools.createCenteredPanel(baseDiv, "500px", "300px").setGradient("#cec7bf", "#5c5650");
    const closeDiv           = GuiTools.createCloseButtonDiv(panel);    
    const closeButton        = GuiTools.createCloseButton(closeDiv, closeAction);

    GuiTools.createLineBreak(panel, 4);
    const textField          = GuiTools.createEditField(panel, 150, '400px', '30px');
    GuiTools.createLineBreak(panel, 4);
    const saveButton         = GuiTools.createButton(panel, "save",     saveAction);
    const cancelButton       = GuiTools.createButton(panel, "cancel",   closeAction);

    

    function closeAction()  {
        viewManager.unshow(self);
    }


    function saveAction() {
        text  = textField.value.trim();

        const changedOracleDefinition = getChangedOracleBlockDefinition(text);
        if( changedOracleDefinition != null ) {
            serverOut.requestSwitchBlock(blockPos.x, blockPos.y, blockPos.z);
        }
        serverOut.requestWriteResource(blockPos, Block.Oracle, "", text); 
        viewManager.unshow(self);
    }
    
        
    this.enable = function() {
        blockPos      = player.getTargetPos();
        if( blockPos == null ) return;
        
        textField.value  = "";
        textField.focus();
        serverIn.receiveResourceHandler = updateOracle;
        serverOut.requestReadResource(blockPos, Block.Oracle, ""); 
    }


    this.disable = function() {
        serverIn.receiveResourceHandler = null;
    }
    

    function updateOracle(messageType, blockType, resourceResponse, newText, targetId) {
        if( resourceResponse == SR_Ok && blockType==Block.Oracle && messageType == SM_ReadResourceResponse) {
            textField.value  = newText;
            text             = newText;
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // support methods
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    function getChangedOracleBlockDefinition(text) {
        const currentOracleDefinition = BlockData.getDefinition(blockData);

        if( text.length > 0) {
            if( currentOracleDefinition == Block.Oracle   ) return Block.OracleUsed;
        }
        else {
            if( currentOracleDefinition == Block.OracleUsed   ) return Block.Oracle;
        }
        return null;
    }

    
}
