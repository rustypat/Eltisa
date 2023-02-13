'use strict';


function BookEditor(viewManager, serverIn, serverOut, player) {
    let quill;
    let blockPos;
    const self               = this;

    // event handler
    this.getEventHandler = (eventType) => null;
    this.getHtmlElement  = () => baseDiv;

    // gui elements    
    const baseDiv            = GuiTools.createOverlay();
    baseDiv.style.backgroundColor      = 'rgba(255,255,255,0.8)'
    const editor             = GuiTools.createEditorDiv(baseDiv);

    GuiTools.createLineBreak(baseDiv);    
    const saveButton    = GuiTools.createButton(baseDiv, "save",   save, null, null, "stores your changes and closes the editor");
    const closeButton   = GuiTools.createButton(baseDiv, "cancel", cancel, null, null, "discards your changes and closes the editor");
    const errorText     = GuiTools.createErrorField(baseDiv);

    function lazyCreateQuillEditor() {
        if (!quill) {

            let toolbarOptions = [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],

                [{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }],  // custom button values
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction

                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                //[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['link', 'image'],

                ['clean']                                         // remove formatting button
            ];

            quill = new Quill('#editor', {
                modules: {
                    toolbar: toolbarOptions
                },
                theme: 'snow'
            });
        }

    }

    this.enable = function() {
        blockPos = player.getTargetPos();
        if( blockPos == null ) return;

        lazyCreateQuillEditor();
        quill.setContents([]);
        saveButton.disabled  = false;

        serverIn.receiveResourceHandler = updateContent;
        serverOut.requestReadResource(blockPos, Block.Book, "");             
    }
    
    
    this.disable = function() {
        serverIn.receiveResourceHandler = null;
    }
    

    function cancel() {
        viewManager.unshow(self);
    }


    function save()  {
        const deltaContent = quill.getContents();
        const text = JSON.stringify(deltaContent);

        if (text.length > Config.maxMessageLength - 5000) {
            errorText.setText("Can't save! Book is to big! Insert only small images");
        }
        else {
            serverOut.requestWriteResource(blockPos, Block.Book, "", text); 
            errorText.clearText();    
        }
        viewManager.unshow(self);
    }


    function updateContent(messageType, blockType, resourceResponse, jsonText, targetId) {
        if( resourceResponse == SR_Ok && blockType==Block.Book && messageType == SM_ReadResourceResponse) {
            const deltaContent = JSON.parse(jsonText);
            quill.setContents(deltaContent);
        }
    }

}
