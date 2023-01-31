'use strict';

function ServerSocket(serverLocation, webSocketPath) {
    
    const self             = this;
    var   webSocket        = {};    
    var   messageHandler   = function(event) {};

    this.setMessageHandler = function(handler) {
        messageHandler      = handler;
        webSocket.onmessage = handler;
    };

    this.connect = function() {
        if(webSocket.readyState == WebSocket.CONNECTING) return;
        if(webSocket.readyState == WebSocket.OPEN) return;

        const scheme = serverLocation.protocol == "https:" ? "wss" : "ws";
        const port   = serverLocation.port ? (":" + serverLocation.port) : "";
        const url    = scheme + "://" + serverLocation.hostname + port + webSocketPath ;    

        try{
            webSocket = new WebSocket(url);        
        }catch(exception) {
            Log.error("webSocket creation throw exception: " + exception.message);
        }

        webSocket.binaryType = "arraybuffer";
        webSocket.onmessage = messageHandler;

        webSocket.onerror = function(error) {
            Log.error("WebSocket Error: " + error);
        };

        webSocket.onopen = function(error) {
            Log.trace("WebSocket connected to server");
        };
    }


    this.close = function() {
        webSocket.close();
    }


    this.sendMessage = function(message, tries) {
        if(tries <= 0) return;
        if(webSocket.readyState == WebSocket.OPEN) {
            webSocket.send(message);
        }
        else if(webSocket.readyState == WebSocket.CONNECTING) {
            setTimeout(function() {
                Log.trace("WebSocket retry send");
                self.sendMessage(message, tries - 1);
            }, 100);
        }
        else {
            Log.trace("WebSocket connection lost");
            self.connectionLostHandler();            
        }
    }

    this.connectionLostHandler         = function(message) {};

}