'use strict';

// colors
const CLR_White       = 'white';
const CLR_Glossy      = 'rgba(255,255,255,0.6)';
const CLR_GlossyLight = 'rgba(255,255,255,0.3)';
const CLR_Transparent = 'transparent';

// linear gradients
const LGT_BlueSky = 'linear-gradient(rgb(148,207,232) 10%, rgb(148,207,232), rgb(255, 255, 255))';


const GuiTools = new function() {
    
    /** 
     * Creates a div that covers the whole area.
     * 
     * @param parent {HTMLElement} 
     * @param color  {string} a CSS color for the background
     * @returns      {HTMLDivElement} 
     * */
    this.createOverlay = function(parent, color = CLR_Transparent) {
        const div                      = document.createElement("div");
        div.style.position             = 'absolute';
        div.style.width                = '100%';
        div.style.height               = '100%';
        div.style.textAlign            = 'center';
        div.style.backgroundColor      = color;
        if(parent) parent.appendChild(div);

        div.setImage =  image => { div.style.backgroundImage = image; return div; }

        return div;        
    }


    /** 
     * Creates a div with rounded corners, that is absolutly placed in the center of its parent.
     * 
     * @param parent {HTMLElement} 
     * @param width  {string} 
     * @param height {string} 
     * @param color  {string} a CSS color for the background
     * @returns      {HTMLDivElement} 
     * */
    this.createCenteredPanel = function(parent, width, height, color = CLR_Transparent) {
        const div                      = document.createElement("div");
        div.style.width                = width;
        div.style.height               = height;
        div.style.position             = 'absolute';
        div.style.top                  = '50%';
        div.style.left                 = '50%';
        div.style.transform            = 'translate(-50%,-50%)';
        div.style.borderRadius         = "20px";
        div.style.padding              = "10px";
        div.style.backgroundColor      = color;
        if(parent) parent.appendChild(div);

        div.setGradient = function(startColor, endColor) {
            div.style.backgroundImage = "linear-gradient(170deg, " + startColor + ", " + endColor + " )";
            return div;
        }
        return div;        
    }


    /** 
     * Creates an absolute positioned div.
     * 
     * @param parent {HTMLElement} 
     * @param width  {string} 
     * @param height {string} 
     * @param color  {string} a CSS color for the background
     * @returns      {HTMLDivElement} 
     * */
    this.createPanel = function(parent, width, height, top, left, bottom, right, color = CLR_Transparent) {
        const div                      = document.createElement("div");
        div.style.width                = width;
        div.style.height               = height;
        div.style.position             = 'absolute';
        div.style.backgroundColor      = color;
        div.style.margin               = '0px';
        if(top) div.style.top          = top;
        if(left) div.style.left        = left;
        if(bottom) div.style.bottom    = bottom;
        if(right) div.style.right      = right;
        if(parent) parent.appendChild(div);

        div.setDisplay =        display => { div.style.display = display; return div; }
        div.setVerticalAlign =  align   => { div.style.verticalAlign = align; return div; }
        div.setPadding =        padding => { div.style.padding = padding; return div; }
        div.setPaddingLeft =    padLeft => { div.style.paddingLeft = padLeft; return div; }
        div.setOverflow =       overflow=> { div.style.overflow = overflow; return div; }

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


    this.createButton = function(parent, caption, action, width, tooltip) {
        const button                   = document.createElement("button");
        button.innerText               = caption;
        button.onclick                 = action;
        button.style.margin            = '5px';
        button.style.fontSize          = "15px";
        button.style.fontWeight        = "bold";
        if(width) button.style.width   = width;
        else      button.style.width   = "150px";
        button.style.height            = "40px";
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
        let linebreak;
        for(let i=0; i < numberOfLineBreaks; i++) {
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
        for(let i = 1; i < arguments.length; i++) {
            const tableCell            = document.createElement("td");
            tableCell.innerHTML        = arguments[i];
            tableRow.appendChild(tableCell);
        }
        return tableRow;
    }


    this.createIframe = function(parent, url, width, height) {
        const iframe                   = document.createElement("iframe");
        iframe.width                   = width;
        iframe.height                  = height;
        iframe.src                     = url;
        iframe.style.backgroundColor   = 'rgba(255,255,255,1)';
        iframe.style.borderRadius      = "10px";
        iframe.setUrl  =  (url) => iframe.src = (url ? url : ""); 
        iframe.setSize = function(width, height) { 
            if(width) iframe.width = width;
            if(height) iframe.height = height;
        }
        if(parent) parent.appendChild(iframe);
        return iframe;
    }


    this.createFullSizedIframe = function(parent, url) {
        const iframe                   = document.createElement("iframe");
        iframe.width                   = "100%";
        iframe.height                  = "100%";
        iframe.src                     = url;
        iframe.style.backgroundColor   = 'rgba(255,255,255,1)';
        iframe.setUrl  =  (url) => iframe.src = (url ? url : ""); 
        iframe.setSize = function(width, height) { 
            if(width) iframe.width = width;
            if(height) iframe.height = height;
        }
        if(parent) parent.appendChild(iframe);
        return iframe;
    }


    this.createCenteredIframe = function(parent, url, width, height) {
        const iframe                   = document.createElement("iframe");
        iframe.width                   = width;
        iframe.height                  = height;
        iframe.src                     = url;
        iframe.style.backgroundColor   = 'rgba(255,255,255,1)';
        iframe.style.display           = 'inline-block';
        iframe.style.position          = 'absolute';
        iframe.style.top               = '50%';
        iframe.style.left              = '50%';
        iframe.style.transform         = 'translate(-50%,-50%)';
        iframe.style.borderRadius      = "10px";
        iframe.setUrl  =  (url) => iframe.src = (url ? url : ""); 
        iframe.setSize = function(width, height) { 
            if(width) iframe.width = width;
            if(height) iframe.height = height;
        }
        if(parent) parent.appendChild(iframe);
        return iframe;
    }


    this.createTextArrea = function(parent, width, height, inputAction) {
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
        if(inputAction) textArea.addEventListener("input", inputAction);
        if(parent) parent.appendChild(textArea);
        return textArea;
    }


    this.createTextInput = function(parent, maxLength, width, height, top, left, bottom, right, color) {
        const input                    = document.createElement("input");
        input.type                     = 'text';
        input.maxLength                = "" + maxLength;
        input.style.width              = width;
        input.style.height             = height;
        input.style.position           = 'absolute';
        input.style.margin             = '0px';
        if(top) input.style.top        = top;
        if(left) input.style.left      = left;
        if(bottom) input.style.bottom  = bottom;
        if(right) input.style.right    = right;
        if(color) input.style.backgroundColor = color;
        if(parent) parent.appendChild(input);

        input.setPaddingBottom =   padding => {input.style.paddingBottom = padding; return input; }
        return input;        
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


    this.createEditField = function(parent, maxLength, width, height, placeholder, keyDownAction) {
        const input                         = document.createElement("input");
        if(maxLength) input.maxLength       = maxLength;
        if(width)  input.style.width        = width;
        if(height) input.style.height       = height;
        if(placeholder) input.placeholder   = placeholder;
        if(keyDownAction) input.addEventListener("keydown", keyDownAction); 
        input.style.margin             = '10px';   
        input.style.fontSize           = "15px";    
        input.style.fontWeight         = "normal";
        input.style.borderRadius       = "10px";
        input.style.borderStyle        = "solid";
        input.style.margin             = "5px";
        input.style.padding            = '5px';
        input.style.backgroundColor    = 'white';
        input.type                     = 'text';
        input.setText =  (text) => input.value = (text ? text : "");
        input.getText =  ()     => input.value; 
        input.clear   =  ()     => input.value = "";
        input.setTextAlign =  align => { input.style.textAlign = align; return input; };
        if(parent) parent.appendChild(input);
       return input;        
    }


    this.createPasswordField = function(parent, maxLength, width, height, placeholder) {
        const input                         = document.createElement("input");
        input.style.margin                  = '10px';   
        if(maxLength) input.maxLength       = maxLength;
        if(width)  input.style.width        = width;
        if(height) input.style.height       = height;
        if(placeholder) input.placeholder   = placeholder;
        input.style.fontSize           = "15px";        
        input.style.fontWeight         = "normal";
        input.style.borderRadius       = "10px";
        input.style.borderStyle        = "solid";
        input.style.margin             = "5px";
        input.style.padding            = '5px';
        input.style.backgroundColor    = 'white';
        input.type                     = 'password';
        input.setText =  (text) => input.value = (text ? text : "");
        input.getText =  ()     => input.value; 
        input.clear   =  ()     => input.value = "";
        input.setTextAlign =  align => { input.style.textAlign = align; return input; };
        if(parent) parent.appendChild(input);
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
            let entries = list.getElementsByTagName("li");
            for (let i=0; i < entries.length; i++) {
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
            let entries = list.getElementsByTagName("li");
            for (const entry of entries) {
                if(entry.object == object) {
                    list.removeChild(entry);
                }
            }                    
        }

        return list;        
    }


    this.createDropDown = function(parent, width) {
        const dropDown                    = document.createElement("select");
        dropDown.style.width              = width;
        dropDown.style.height             = "45px";
        dropDown.style.textAlign          = "center";
        dropDown.style.fontSize           = "15px";        
        dropDown.style.fontWeight         = "normal";
        dropDown.style.borderRadius       = "10px";
        dropDown.style.borderStyle        = "solid";
        dropDown.style.margin             = "5px";
        dropDown.style.padding            = '5px';
        if(parent) parent.appendChild(dropDown);

        dropDown.setOptions = function(optionsVarArg) {
            dropDown.innerHTML = ""; 
            for(let i = 0; i < arguments.length; i++) {
                const option      = document.createElement('option');
                option.valueObject= arguments[i];
                option.value      = arguments[i].toString();
                option.innerText  = arguments[i].toString();
                dropDown.appendChild(option);
            }    
            if(arguments.length > 0) dropDown.value = arguments[0];
        }

        dropDown.getSelection = function() {
            const i = dropDown.selectedIndex;
            if( i < 0 ) return null;
            return dropDown.childNodes[i].valueObject;
        }

        dropDown.clear = () => dropDown.selectedIndex = -1;

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


    this.createCenteredImage = function(parent, pictureURL, width, height) {
        if(!width) width = 'auto';
        if(!width) height = 'auto';
        const image                    = document.createElement("img");
        image.style.width              = width;
        image.style.height             = height;
        image.src                      = pictureURL;
        image.style.position           = 'absolute';
        image.style.top                = '50%';
        image.style.left               = '50%';
        image.style.transform          = 'translate(-50%,-50%)';
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


    this.createCanvas = function(parent, width, height) {
        const canvas                   = document.createElement("canvas");
        canvas.style.borderRadius      = "10px";
        canvas.width                   = width;
        canvas.height                  = height;
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


    this.createGameCanvas = function(parent, width, height) {
        const canvas                   = document.createElement("canvas");
        canvas.style.position          = "absolute";
        canvas.style.touchAction       = "none";
        canvas.style.backgroundColor   = "rgb(148, 206, 232)";
        canvas.style.width             = width;
        canvas.style.height            = height;
        if(parent) parent.appendChild(canvas);
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
        canvas.style.borderRadius      = "10px";
        if(parent) parent.appendChild(canvas);

        canvas.clear = function() {
            const context              = canvas.getContext("2d");
            context.fillStyle          = 'rgba(240,240,240, 1)';
            context.fillRect(0, 0, width, height);
        }

        canvas.drawImage = function(image) {
            canvas.getContext('2d').drawImage(image, 0, 0);
        }

        return canvas;
    }    


    this.createCenteredTextArrea = function(parent, width, height, readonly) {
        const textArea                 = document.createElement("textarea");
        textArea.style.display         = 'inline-block';
        textArea.style.position        = 'absolute';
        textArea.style.top             = '50%';
        textArea.style.left            = '50%';
        textArea.style.transform       = 'translate(-50%,-50%)';
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
        textArea.readOnly              = readonly;   
        if(parent) parent.appendChild(textArea);
        return textArea;
    }

}