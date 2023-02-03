'use strict';

const GuiTools = new function() {

    /** 
     * @param parent {HTMLElement}
     * @param id     {string}
     * @returns      {HTMLDivElement} 
     * */
    this.createOverlayOpaque = function(parent, id) {
        const div                      = document.createElement("div");
        div.style.position             = 'absolute';
        div.style.width                = '100%';
        div.style.height               = '100%';
        div.style.textAlign            = 'center';
        div.style.backgroundColor      = 'rgba(255,255,255,1)';
        if(id) div.id                  = id;
        if(parent) parent.appendChild(div);
        return div;        
    }


    /** 
     * @param parent {HTMLElement}
     * @param id     {string}
     * @returns      {HTMLDivElement} 
     * */
    this.createOverlay = function(parent, id) {
        const div                      = document.createElement("div");
        div.style.position             = 'absolute';
        div.style.width                = '100%';
        div.style.height               = '100%';
        div.style.textAlign            = 'center';
        div.style.backgroundColor      = 'rgba(255,255,255,0.6)';
        if(id) div.id                  = id;
        if(parent) parent.appendChild(div);
        return div;        
    }


    /** 
     * @param parent {HTMLElement}
     * @param id     {string}
     * @returns      {HTMLDivElement} 
     * */
    this.createOverlayTransparent = function(parent, id) {
        const div                      = document.createElement("div");
        div.style.position             = 'absolute';
        div.style.width                = '100%';
        div.style.height               = '100%';
        div.style.textAlign            = 'center';
        div.style.backgroundColor      = 'rgba(255,255,255,0.2)';
        if(id) div.id                  = id;
        if(parent) parent.appendChild(div);
        return div;        
    }


    this.createCenteredPanel = function(parent, width, height) {
        const div                      = document.createElement("div");
        div.style.width                = width;
        div.style.height               = height;
        div.style.position             = 'absolute';
        div.style.top                  = '50%';
        div.style.left                 = '50%';
        div.style.transform            = 'translate(-50%,-50%)';
        div.style.borderRadius         = "20px";
        div.style.padding              = "10px";
        div.style.backgroundColor      = 'rgba(220,220,220, 0.8)';
        if(parent) parent.appendChild(div);
        return div;        
    }



    this.createDiv = function(parent) {
        const display                  = 'inline-block';
        const div                      = document.createElement("div");
        div.style.display              = display;
        div.style.position             = 'static';
        div.style.textAlign            = 'left';
        if(parent) parent.appendChild(div);

        div.hide = function() { div.style.display = "none"; }
        div.show = function() { div.style.display = display; }
        return div;        
    }


    this.createTabletDiv = function(parent) {
        const div                      = document.createElement("div");
        div.style.display              = 'inline-block';
        div.style.position             = 'static';
        div.style.marginTop            = '70px';
        div.style.width                = '70%';
        div.style.height               = '100%';
        div.style.borderRadius         = "20px";
        div.style.padding              = "10px";
        div.style.backgroundColor      = 'rgba(220,220,220, 0.8)';

        if(parent) parent.appendChild(div);
        return div;        
    }


    this.createToolbarDiv = function(parent) {
        const div                      = document.createElement("div");
        div.style.display              = 'inline-block';
        div.style.position             = 'static';
        div.style.marginTop            = '10px';
        div.style.width                = '95%';
        div.style.height               = '100px';
        div.style.borderRadius         = "10px";
        div.style.padding              = "0px";
        div.style.backgroundColor      = 'rgba(255,255,255, 1)';
        div.id                         = 'toolbar';

        if(parent) parent.appendChild(div);
        return div;        
    }


    this.createEditorDiv = function(parent) {
        const div                      = document.createElement("div");
        div.style.display              = 'inline-block';
        div.style.position             = 'static';
        div.style.marginTop            = '0px';
        div.style.width                = '95%';
        div.style.height               = '80%';
        div.style.borderRadius         = "10px";
        div.style.padding              = "10px";
        div.style.backgroundColor      = 'rgba(255,255,255, 1)';
        div.id                         = 'editor';

        if(parent) parent.appendChild(div);
        return div;        
    }


    this.createButton = function(parent, caption, action, width, height, tooltip) {
        const button                   = document.createElement("button");
        button.innerText               = caption;
        button.onclick                 = action;
        button.style.margin            = '10px';
        button.style.fontSize          = "15px";
        button.style.fontWeight        = "bold";
        if(width) button.style.width   = width;
        else      button.style.width   = "150px";
        if(height)button.style.height  = height;
        else      button.style.height  = "30px";
        if (tooltip) button.title      = tooltip;
        button.style.borderRadius      = "10px";
        button.style.borderStyle       = "solid";  
        button.style.borderWidth       = "1px";
        button.style.borderColor       = "#808080";
        if(parent) parent.appendChild(button);

        button.set      = function(caption, action) { button.innerHTML = caption; button.onclick = action; }             
        button.disable  = function() { button.style.backgroundColor=""; button.disabled = true;  }
        button.enable   = function() { button.style.backgroundColor=""; button.disabled = false;  }
        button.activate = function() { button.style.backgroundColor="yellow"; button.disabled = false;}
        
        return button;
    }


    this.createButtonSmall = function(parent, caption, action) {
        const button                   = this.createButton(parent, caption, action);
        button.style.width             = "100px";
        return button;
    }


    this.createCloseButton = function(parent, closeAction) {
        const button                   = document.createElement("button");
        button.innerText               = "X";
        button.title                   = "close window";
        button.onclick                 = closeAction;
        button.style.margin            = '10px';
        button.style.fontSize          = "18px";
        button.style.fontWeight        = "bold";
        button.style.width             = "30px";
        button.style.height            = "30px";
        button.style.borderRadius      = "10px";
        button.style.borderStyle       = "solid";  
        button.style.borderWidth       = "1px";
        button.style.borderColor       = "#808080";
        button.style.right             = "0px";
        button.style.top               = "-5px";
        button.style.position          = "absolute";
        if(parent) parent.appendChild(button);
        return button;        
    }


    this.createReloadButton = function(parent, closeAction, inline) {
        const button                   = document.createElement("button");
        button.innerHTML               = "&#8635;";
        button.title                   = "reload";
        button.onclick                 = closeAction;
        button.style.margin            = '10px';
        button.style.fontSize          = "18px";
        button.style.fontWeight        = "bold";
        button.style.width             = "30px";
        button.style.height            = "30px";
        button.style.borderRadius      = "10px";
        button.style.borderStyle       = "solid";  
        button.style.borderWidth       = "1px";
        button.style.borderColor       = "#808080";
        if (!inline) {
            button.style.right             = "0px";
            button.style.top               = "-5px";
            button.style.position          = "absolute";
        }
        if(parent) parent.appendChild(button);
        return button;        
    }


    this.createStoreButton = function(parent, closeAction, inline) {
        const button                   = document.createElement("button");
        button.innerHTML               = "&#8659;";
        button.title                   = "store";
        button.onclick                 = closeAction;
        button.style.margin            = '10px';
        button.style.fontSize          = "18px";
        button.style.fontWeight        = "bold";
        button.style.width             = "30px";
        button.style.height            = "30px";
        button.style.borderRadius      = "10px";
        button.style.borderStyle       = "solid";  
        button.style.borderWidth       = "1px";
        button.style.borderColor       = "#808080";
        if (!inline) {
            button.style.right             = "0px";
            button.style.top               = "-5px";
            button.style.position          = "absolute";
        }
        if(parent) parent.appendChild(button);
        return button;        
    }


    this.createCloseButtonDiv = function(parent) {
        const buttonDiv          = document.createElement("div");
        buttonDiv.style.margin   = "0px";
        buttonDiv.style.position = "relative";
        buttonDiv.style.width    = "100%"
        if(parent) parent.appendChild(buttonDiv);
        return buttonDiv;
    }


    this.createLineBreak = function(parent, numberOfLineBreaks) {
        if(!numberOfLineBreaks) numberOfLineBreaks = 1;
        var linebreak;
        for(var i=0; i < numberOfLineBreaks; i++) {
            linebreak                  = document.createElement("br");
            if(parent) parent.appendChild(linebreak);                
        }
        return linebreak;
    }


    this.createLabel = function(parent, text, width) {
        const div                      = document.createElement("div");
        div.innerHTML                  = text;
        div.style.margin               = '10px';
        div.style.display              = 'inline-block';
        div.style.position             = 'static';
        div.style.textAlign            = 'left';
        if(width)  div.style.width     = width;
        if(parent) parent.appendChild(div);
        div.setText = function(text) { div.innerHTML = text.toString(); }
        div.getText = function()     { return div.innerHTML; }
        return div;
    }


    this.createMessageField = function(parent, text, width, minHeight) {
        const div                      = document.createElement("div");
        if(text) div.innerHTML         = text;
        div.style.margin               = '10px';
        div.style.display              = 'inline-block';
        div.style.position             = 'static';
        div.style.textAlign            = 'left';
        div.style.width                = width;
        div.style.minHeight            = minHeight;
        //div.style.color                = 'red';

        if(parent) parent.appendChild(div);

        div.setMessage = function(message) { 
            if(message) div.innerHTML = message;
            else        div.innerHTML = ".";
        }

        div.clearMessage = function(message) { 
            div.innerHTML = ".";
        }

        return div;
    }


    this.createTitle = function(parent, text, leftMargin) {
        const span                     = document.createElement("span");
        span.style.fontSize            = "24px";
        if(leftMargin) span.style.marginLeft = leftMargin;
        span.innerHTML                 = text;
        if(parent) parent.appendChild(span);
        return span;
    }


    this.createText = function(parent, text) {
        const span                     = document.createElement("span");
        span.innerHTML                 = text;
        if(parent) parent.appendChild(span);
        return span;
    }


    this.createErrorField = function(parent) {
        const span                     = document.createElement("span");
        span.style.color               = 'red';
        span.setText                   = function(text) { span.innerText = text; }
        span.clearText                 = function()     { span.innerText = "";   }
        if(parent) parent.appendChild(span);
        return span;
    }


    this.createTable = function(parent) {
        const table                    = document.createElement("table");
        table.style.textAlign          = 'left';
        if(parent) parent.appendChild(table);
        return table;
    }


    this.createTableRow = function(parent /*, text...*/ ) {
        const tableRow                 = document.createElement("tr");
        if(parent) parent.appendChild(tableRow);
        for(var i = 1; i < arguments.length; i++) {
            const tableCell            = document.createElement("td");
            tableCell.innerHTML        = arguments[i];
            tableRow.appendChild(tableCell);
        }
        return tableRow;
    }


    this.createIframe = function(parent, url) {
        const iframe                   = document.createElement("iframe");
        iframe.width                   = "100%";
        iframe.height                  = "100%";
        iframe.src                     = url;
        if(parent) parent.appendChild(iframe);
        return iframe;
    }


    this.createTextArrea = function(parent, width, height) {
        const textArea                 = document.createElement("textarea");
        textArea.style.resize          = 'none';
        textArea.style.margin          = '10px';
        textArea.style.width           = width;
        textArea.style.height          = height;
        textArea.style.borderRadius    = "10px";
        textArea.style.padding         = "10px";
        textArea.style.fontSize        = "18px";
        textArea.style.fontWeight      = "bold";
        textArea.style.fontFamily      = "cursive";
        textArea.style.backgroundColor = 'rgba(255,255,200, 1)';
        textArea.maxLength             = 10 * 1024;        
        if(parent) parent.appendChild(textArea);
        return textArea;
    }


    this.createNumberInput = function(parent, min, max, changeAction) {
        const input                    = document.createElement("input");
        input.type                     = 'number';
        input.style.width              = '6em';
        input.style.margin             = '10px';   
        if(min) input.min              = min.toString();
        if(max) input.max              = max.toString();
        if(changeAction) input.addEventListener("change", changeAction);

        if(parent) parent.appendChild(input);
        return input;        
    }


    this.createTextInput = function(parent, maxLength, width, height, textAlign, placeholder) {
        const input                         = document.createElement("input");
        input.style.margin                  = '10px';   
        if(maxLength) input.maxLength       = maxLength;
        if(width)  input.style.width        = width;
        if(height) input.style.height       = height;
        if(textAlign) input.style.textAlign = textAlign;
        if(placeholder) input.placeholder   = placeholder;
        if(parent) parent.appendChild(input);
        input.style.fontSize           = "15px";        
        input.style.borderRadius       = "10px";
        input.style.borderStyle        = "solid";
        input.style.paddingLeft        = '5px';
        input.style.paddingRight       = '5px';
        input.setText = function(text) { input.value = text ? text : ""; }
        input.getText = function()     { return input.value; }
        input.type                     = 'text';
       return input;        
    }


    this.createVideo = function(parent, muted) {
        const video                    = document.createElement("video");
        video.style.margin             = '0px';   
        video.autoplay                 = true;
        video.style.backgroundColor    = 'lightgrey';
        video.style.width              = '320px';
        video.style.height             = '240px';
        if(muted)  video.muted         = muted;
        if(parent) parent.appendChild(video);

        video.small       = function() { video.style.width='160px'; video.style.height='120px';}
        video.big         = function() { video.style.width='320px'; video.style.height='240px';}
        
        return video;        
    }


    this.createList = function(parent, columns, clickAction, doubleClickAction) {
        const list                     = document.createElement("ul");
        list.style.margin              = '10px';   
        list.style.listStyleType       = 'none';
        list.style.backgroundColor     = 'white';
        list.style.minHeight           = '100px';
        if(columns) list.style.columns = columns;
        list.style.textAlign           = 'left';

        if(clickAction) list.addEventListener("click", function(event) { 
            if(event.target == list) return;
            clickAction(event.target.innerHTML); 
        } );
        
        if(clickAction) list.addEventListener("dblclick", function(event) { 
            if(event.target == list) return;
            doubleClickAction(event.target.innerHTML); 
        } );
        
        if(parent) parent.appendChild(list);

        list.addEntry = function(object) { 
            const entry = document.createElement('li');
            entry.innerHTML  = object.toString();
            entry.object     = object;
            list.appendChild(entry); 
        }

        list.removeEntry = function(object) { 
            var entries = list.getElementsByTagName("li");
            for (var i=0; i < entries.length; i++) {
                const entry = entries[i];
                if(entry.object == object) {
                    list.removeChild(entry);
                }
            }        
        }

        list.clearEntries = function() { 
            list.innerHTML = ""; 
        }

        list.containsEntry = function(object) {
            var entries = list.getElementsByTagName("li");
            for (const entry of entries) {
                if(entry.object == object) {
                    list.removeChild(entry);
                }
            }                    
        }

        return list;        
    }


    this.createDropDown = function(parent, optionsVarArg) {
        const dropDown                 = document.createElement("select");
        if(parent) parent.appendChild(dropDown);

        for(var i = 1; i < arguments.length; i++) {
            const option = document.createElement('option');
            option.value = arguments[i];
            option.innerText = option.value.toString();
            dropDown.appendChild(option);
        }

        dropDown.clearOptions = function() {
            dropDown.innerHTML = ""; 
        }

        dropDown.addOptions = function(optionsVarArg) {
            for(var i = 0; i < arguments.length; i++) {
                const option      = document.createElement('option');
                option.valueObject= arguments[i];
                option.value      = arguments[i].toString();
                option.innerText  = arguments[i].toString();
                dropDown.appendChild(option);
            }    
            if(arguments.length > 0) dropDown.value = arguments[0];
        }

        dropDown.addOptionsFromArray = function(optionsArray) {
            for(var i = 0; i < optionsArray.length; i++) {
                const option      = document.createElement('option');
                option.valueObject= optionsArray[i];
                option.value      = optionsArray[i].toString();
                option.innerText  = optionsArray[i].toString();
                dropDown.appendChild(option);
            }    
            if(optionsArray.length > 0) dropDown.value = optionsArray[0];
        }

        dropDown.getSelectedOption = function() {
            const i = dropDown.selectedIndex;
            if( i < 0 ) return null;
            return dropDown.childNodes[i].valueObject;
        }

        return dropDown;
    }    


    this.createImage = function(parent, pictureURL, width, height, id) {
        const image                    = document.createElement("img");
        if(width)  image.style.width   = width;
        if(height) image.style.height  = height;
        image.src                      = pictureURL;
        if(id) image.id                = id;
        if(parent) parent.appendChild(image);
        return image;
    }


    this.createLink = function(parent, text, url) {
        const link                     = document.createElement("a");
        link.innerText                 = text;
        link.href                      = url;
        link.title                     = text;
        link.target                    = "_blank";
        if(parent) parent.appendChild(link);
        return link;
    }


    this.createCanvas = function(parent, width, height, id, backgroundColor) {
        const canvas                   = document.createElement("canvas");

        if(width)  canvas.width        = width;
        if(height) canvas.height       = height;
        if(id) canvas.id               = id;
        if(parent) parent.appendChild(canvas);

        canvas.clear = function() {
            const context                  = canvas.getContext("2d");
            context.fillStyle              = backgroundColor;
            context.fillRect(0, 0, width, height);
        }
        return canvas;
    }    


     /** 
     * @param parent {HTMLElement}
     * @param width  {number}
     * @param height {number}
     * @returns      {HTMLDivElement} 
     * */
     this.createCenteredCanvas = function(parent, width, height) {
        const canvas                   = document.createElement("canvas");
        canvas.width                   = width;
        canvas.height                  = height;
        canvas.style.position          = 'absolute';
        canvas.style.top               = '50%';
        canvas.style.left              = '50%';
        canvas.style.transform         = 'translate(-50%,-50%)';
        canvas.style.backgroundColor   = 'rgba(240,240,240, 1)';
        canvas.style.borderStyle       = 'double';
        if(parent) parent.appendChild(canvas);

        canvas.clear = function() {
            const context              = canvas.getContext("2d");
            context.fillStyle          = 'rgba(240,240,240, 1)';
            context.fillRect(0, 0, width, height);
        }

        /** 
         * @param image {HTMLImageElement}
         * */
        canvas.drawImage = function(image) {
            canvas.getContext('2d').drawImage(image, 0, 0);
        }

        return canvas;
    }    


    this.createCenteredTextArrea = function(parent, width, height, readonly) {
        const textArea                 = document.createElement("textarea");
        textArea.style.display         = 'inline-block';
        textArea.style.position        = 'absolute';
        textArea.style.resize          = 'none';
        textArea.style.margin          = '10px';
        textArea.style.width           = width;
        textArea.style.height          = height;
        textArea.style.borderRadius    = "10px";
        textArea.style.padding         = "10px";
        textArea.style.fontSize        = "18px";
        textArea.style.fontWeight      = "bold";
        textArea.style.fontFamily      = "cursive";
        textArea.style.backgroundColor = 'rgba(255,255,200, 1)';
        textArea.style.top             = '50%';
        textArea.style.left            = '50%';
        textArea.style.transform       = 'translate(-50%,-50%)';
        textArea.maxLength             = 10 * 1024;     
        textArea.readOnly              = readonly;   
        if(parent) parent.appendChild(textArea);
        return textArea;
    }

}