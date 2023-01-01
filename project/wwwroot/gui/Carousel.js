'Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved';
'use strict';

function Carousel(body) {
    const carouselDiv             = document.createElement("div")
    const gondolasHeight          = 100;
    var   distanceToTarget        = 0;

    const gondolaLines            = [];
    var   selectedGondolaLine     = null;
    
    initialize();

    function initialize() {
        carouselDiv.id = "carousel";
        if(Config.blackAndWhite) carouselDiv.style.filter = "grayscale(1)";
        body.appendChild(carouselDiv);

        var index     = 0;
        var lineInfo  = CarouselInfo.getLineInfo(index++);
        while( lineInfo ) {
            addBlockLine(lineInfo)
            lineInfo = CarouselInfo.getLineInfo(index++);
        }

        selectFirstGondolaLine();
    }


    
    this.getSelectedBlock = function(){
        const gondola     = selectedGondolaLine.getSelectedGondola();
        return gondola.id;
    }

    
    this.setSelectedBlock = function(block){
        const gondolaLine = findGondolaLine(block);
        if( !gondolaLine ) return;
        const gondola = gondolaLine.findGondola(block);
        positionGondolas(gondolaLine.index, gondola.index);
    }

    
    this.moveUp = function () {
        if(distanceToTarget < gondolasHeight) distanceToTarget += gondolasHeight;
    }


    this.moveDown = function () {
        if(distanceToTarget > -gondolasHeight) distanceToTarget -= gondolasHeight;
    }


    this.moveLeft = function () {
        if(distanceToTarget != 0) return;
        selectedGondolaLine.selectPreviousGondola();
    }


    this.moveRight = function ()  {
        if(distanceToTarget != 0) return;
        selectedGondolaLine.selectNextGondola();
    }


    function findGondolaLine(gondolaId) {
        return gondolaLines.find( l => l.findGondola(gondolaId) );
    }


    function selectFirstGondolaLine() {
        selectedGondolaLine = gondolaLines[0];
    }

    
    this.animate = function(){
        if(distanceToTarget == 0) return;
        
        var delta;
        if(      Math.abs(distanceToTarget) >  50 )  delta = 15 * Math.sign(distanceToTarget);
        else if( Math.abs(distanceToTarget) >  10 )  delta =  5 * Math.sign(distanceToTarget);
        else if( Math.abs(distanceToTarget) >   0 )  delta =  1 * Math.sign(distanceToTarget);
        else return;
        distanceToTarget -= delta;

        const lineCount    = gondolaLines.length;

        for(var i=0; i < lineCount; i++) {
            var distanceToBottom = gondolaLines[i].position;
            
            distanceToBottom += delta;
            if(distanceToBottom < 0-gondolasHeight)                distanceToBottom += lineCount * gondolasHeight;
            if(distanceToBottom > (lineCount-1) * gondolasHeight)  distanceToBottom -= lineCount * gondolasHeight;

            gondolaLines[i].position     = distanceToBottom;
            gondolaLines[i].style.bottom = distanceToBottom + "px";
        }

        for(const gondolaLine of gondolaLines) {
            if( Math.abs(gondolaLine.position) < 10) {
                selectedGondolaLine =  gondolaLine;
            }
        }    
    }


    function positionGondolas(lineIndex, gondolaIndex) {
        assert( lineIndex >= 0 && lineIndex < gondolaLines.length );
        distanceToTarget     = 0;
        const lineCount      = gondolaLines.length;

        for(const gondolaLine of gondolaLines) {

            var pos = (gondolaLine.index - lineIndex) * gondolasHeight;
            if(pos < 0-gondolasHeight)                pos += lineCount * gondolasHeight;
            if(pos > (lineCount-1) * gondolasHeight)  pos -= lineCount * gondolasHeight;
            gondolaLine.position     = pos;
            gondolaLine.style.bottom = pos + "px";

            if( gondolaLine.index == lineIndex ) {
                gondolaLine.setGondola(gondolaIndex);
                selectedGondolaLine = gondolaLine;
            }
        }            
    }


    function addBlockLine(lineInfo) {       
        const index                    = gondolaLines.length; 
        const gondolaLine              = createGondolaLine(index);
        gondolaLines.push(gondolaLine);
        
        for(var i=0; i < lineInfo.length; i++) {
            const info = CarouselInfo.getBlockInfo(lineInfo[i]);
            gondolaLine.addGondola(info.block, info.name, info.icon);
        }
        gondolaLine.setGondola(0);

        carouselDiv.appendChild(gondolaLine);
    }


    function createGondolaLine(index) {
        const gondolaLine              = document.createElement("div");
        gondolaLine.style.fontSize     = "12px";
        gondolaLine.position           = 5 + index * gondolasHeight;
        gondolaLine.style.position     = "absolute";
        gondolaLine.style.bottom       = gondolaLine.position + "px";
        gondolaLine.gondolas           = [];
        gondolaLine.selectedGondola    = null;
        gondolaLine.index              = index;

        gondolaLine.selectNextGondola = function() {
            gondolaLine.removeChild(gondolaLine.selectedGondola);        
            var i = gondolaLine.selectedGondola.index + 1;
            if(i >= gondolaLine.gondolas.length ) i = 0;
            gondolaLine.selectedGondola = gondolaLine.gondolas[i];                
            gondolaLine.appendChild(gondolaLine.selectedGondola);                        
        }

        gondolaLine.selectPreviousGondola = function() {
            gondolaLine.removeChild(gondolaLine.selectedGondola);        
            var i = gondolaLine.selectedGondola.index - 1;
            if(i < 0 ) i = gondolaLine.gondolas.length - 1;
            gondolaLine.selectedGondola = gondolaLine.gondolas[i];                
            gondolaLine.appendChild(gondolaLine.selectedGondola);                        
        }

        gondolaLine.getSelectedGondola = function() {
            return gondolaLine.selectedGondola;
        }

        gondolaLine.setGondola = function(index) {
            if(gondolaLine.selectedGondola) gondolaLine.removeChild(gondolaLine.selectedGondola);        
            gondolaLine.selectedGondola = gondolaLine.gondolas[index];
            gondolaLine.appendChild(gondolaLine.selectedGondola);        
        }

        gondolaLine.addGondola = function(id, name, icon) {
            const gondola                  = document.createElement("div");
            gondola.index                  = gondolaLine.gondolas.length;
            gondola.id                     = id;
    
            const label = GuiTools.createLabel(gondola, name.substring(0, 15));
            label.style.margin    = '0px';
            const image = GuiTools.createImage(gondola, "/resources/icons/" + icon, "64px", "64px");
            image.style.margin    = '0px';
            gondolaLine.gondolas.push(gondola);
        }

        gondolaLine.findGondola = function(gondolaId) {
            return gondolaLine.gondolas.find( g => g.id == gondolaId);
        }

        return gondolaLine;
    }

}