'use strict';


function BookBlocker(body, activateGame, deactivateGame, server, player) {

    const baseDiv            = GuiTools.createOverlay();
    baseDiv.style.backgroundColor      = 'rgba(255,255,255,0.8)'
    const editor             = GuiTools.createEditorDiv(baseDiv);

    GuiTools.createLineBreak(baseDiv);    
    const saveButton    = GuiTools.createButton(baseDiv, "save",   saveAction, null, null, "stores your changes and closes the editor");
    const closeButton   = GuiTools.createButton(baseDiv, "cancel", closeAction, null, null, "discards your changes and closes the editor");
    const storeButton   = GuiTools.createStoreButton(baseDiv, storeAction, true);
    const refreshButton = GuiTools.createReloadButton(baseDiv, refreshAction, true);
    const errorText     = GuiTools.createErrorField(baseDiv);

    var quill;
    var blockPos;
    var blockData;
    const self               = this;

    function lazyCreateQuillEditor() {
        if (!quill) {

            var toolbarOptions = [
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


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // tab events
    ///////////////////////////////////////////////////////////////////////////////////////////////////    


    function storeAction(event) {
        event.stopPropagation();
        const deltaContent = quill.getContents();
        const text = JSON.stringify(deltaContent);

        if (text.length > Config.maxMessageLength - 5000) {
            errorText.setText("Can't save! Book is to big! Insert only small images");
            return false;
        }

        server.requestWriteResource(blockPos, Block.Book, "", text); 
        errorText.clearText();
        return false;
    }


    function saveAction(event)  {
        const deltaContent = quill.getContents();
        const text = JSON.stringify(deltaContent);

        if (text.length > Config.maxMessageLength - 5000) {
            errorText.setText("Can't save! Book is to big! Insert only small images");
            return false;
        }

        server.requestWriteResource(blockPos, Block.Book, "", text); 
        errorText.clearText();

        closeAction(event);
        return false;  
    }


    function closeAction(event)  {
        event.stopPropagation();
        body.removeChild(baseDiv);       
        document.removeEventListener("keypress", keypressHandler);
        activateGame();     
        return false;
    }


    function refreshAction(event) {
        event.stopPropagation();
        server.requestReadResource(blockPos, Block.Book, ""); 
        errorText.clearText();
        return false;
    }


    function keypressHandler(event) {
        if( !Policy.canModifyBlock(player, blockPos) && event.key == " " ) {
            closeAction();         
        }
        else if (Policy.canModifyBlock(player, blockPos)) {
            saveButton.disabled  = false;
            storeButton.disabled = false;
        }
    }
        

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // show blocker
    ///////////////////////////////////////////////////////////////////////////////////////////////////
        
    this.show = function(chunkStore, _blockPos) {
        blockPos             = _blockPos;
        blockData            = chunkStore.getBlockData(blockPos);
        if( !BlockData.isBook(blockData) ) return false;
        

        errorText.clearText();
        if(!body.contains(baseDiv)) {
            body.appendChild(baseDiv);
        }
        document.addEventListener("keypress", keypressHandler);
        
        deactivateGame();
        lazyCreateQuillEditor();
        quill.setContents([]);
        saveButton.disabled  = true;
        storeButton.disabled = true;
        server.requestReadResource(blockPos, Block.Book, ""); 
    
        return true;
    }


    this.isVisible = function() {
        return body.contains(baseDiv);
    }


    this.updateContent = function(jsonText) {
        const deltaContent = JSON.parse(jsonText);
        quill.setContents(deltaContent);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // support methods
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    

}
