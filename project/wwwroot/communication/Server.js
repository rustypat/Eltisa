'use strict';

function Server(serverLocation, webSocketPath) {
    
    const endTag        = 666999;

    const OutMessageType = {
        Login:               10,
        MoveActor:           20,
        ListActors:          22,

        GetChunks:           30,
        AddBlock:            32,
        RemoveBlock:         34,
        ChangeBlock:         36,
        SwitchBlock:         38,

        ChatMessage:         42,
        VideoChatMessage:    44,
        GetBlockResource:    52,
        SaveBlockResource:   54,

        CreateResourceRequest:         60,
        ReadResourceRequest:           62,
        WriteResourceRequest:          64,
        UpdateResourceRequest:         66,
        DeleteResourceRequest:         68        
    }
    
    const InMessageType = {
        Login:               11,
        ActorChanged:        21,
        ActorList:           23,

        Chunks:              31,
        BlocksChanged:       37,

        Chat:                41,
        VideoChat:           43,
        BlockResource:       51,

        CreateResourceResponse:        61,
        ReadResourceResponse:          63,
        WriteResourceResponse:         65,
        UpdateResourceResponse:        67,
        DeleteResourceResponse:        69        
    }
    
    var   webSocket   = {};    
    const self        = this;
    const writer      = new ArrayWriter(Config.maxMessageLength);
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // basis
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
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
        webSocket.onmessage = function(event) {

            assert(event.data instanceof ArrayBuffer);
            const reader = new ArrayReader(event.data);
            const messageType    = reader.readInteger();
            const messageCounter = reader.readInteger();
            Log.trace("received message " + messageCounter + ", " + getMessageTypeDescription(messageType) + ", length " + event.data.byteLength);

            receiveChunksMessage(reader, messageType);
            receiveActorChangedMessage(reader, messageType);
            receiveActorListMessage(reader, messageType);
            receiveChatMessage(reader, messageType);
            receiveBlocksChangedMessage(reader, messageType);
            receiveLoginMessage(reader, messageType);
            receiveVideoChatMessage(reader, messageType);
            receiveBlockResourceMessage(reader, messageType);
        };

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


    function getMessageTypeDescription(messageType) {
        switch(messageType) {
            case InMessageType.Login:            return "Login";
            case InMessageType.ActorChanged:     return "ActorChanged";
            case InMessageType.ActorList:        return "ActorList";
            case InMessageType.Chunks:           return "Chunks";
            case InMessageType.BlocksChanged:    return "BlocksChanged";
            case InMessageType.BlockResource:    return "BlockResource";
            case InMessageType.Chat:             return "Chat";
            case InMessageType.VideoChat:        return "VideoChat";
            default:                             return messageType;
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // handler 
    ///////////////////////////////////////////////////////////////////////////////////////////////

    this.receiveLoginHandler           = function(message) {};
    this.receiveActorChangedHandler    = function(message) {};
    this.receiveActorListHandler       = function(message) {};
    this.receiveChatHandler            = function(message) {};
    this.receiveChunksHandler          = function(message) {};
    this.receiveVideoChatHandler       = function(message) {};
    this.receiveBlockResourceHandler   = function(message) {};
    this.connectionLostHandler         = function(message) {};
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // receive message handler
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
    function receiveLoginMessage(reader, messageType) {
        if(messageType != InMessageType.Login) return false;

        const message        = {};
        message.actorId      = reader.readInteger();
        message.actorType    = reader.readInteger();
        message.actorName    = reader.readString();
        message.actorColor   = reader.readInteger();
        assert(endTag       == reader.readInteger());
        
        self.receiveLoginHandler(message);
        return true;
    }


    function receiveActorChangedMessage(reader, messageType) {
        if(messageType != InMessageType.ActorChanged) return false;

        const message        = {};
        message.change       = reader.readInteger();       // change type
        message.id           = reader.readInteger();       // actor id
        message.name         = reader.readString();
        message.color        = reader.readInteger();
        message.positionX    = reader.readFloat();
        message.positionY    = reader.readFloat();
        message.positionZ    = reader.readFloat();
        message.rotationY    = reader.readFloat();
        assert(endTag       == reader.readInteger());
        
        self.receiveActorChangedHandler(message);
        return true;
    }


    function receiveActorListMessage(reader, messageType) {
        if(messageType != InMessageType.ActorList) return false;

        const message        = {};
        message.actorCount   = reader.readInteger();
        message.names        = new Array(message.actorCount);
        for(var x=0; x < message.actorCount; x++) {
            message.names[x] = reader.readString();
        }
        assert(endTag       == reader.readInteger());
        
        self.receiveActorListHandler(message);
        return true;
    }


    function receiveChatMessage(reader, messageType) {
        if(messageType != InMessageType.Chat) return false;

        const message        = {};
        message.message      = reader.readString();
        message.sender       = reader.readString();
        assert(endTag       == reader.readInteger());
        
        self.receiveChatHandler(message);
        return true;        
    }
    

    function receiveBlocksChangedMessage(reader, messageType) {
        if(messageType != InMessageType.BlocksChanged) return false;

        const changedChunks = new Set();
        const blockCount     = reader.readInteger();
        for(var i=0; i < blockCount; i++) {
            const x        = reader.readInteger();
            const y        = reader.readInteger();
            const z        = reader.readInteger();
            const blockData= reader.readInteger();  
            const chunk    = self.updateBlock(x, y, z, blockData);
            if(chunk) changedChunks.add(chunk);
        }
        assert(endTag       == reader.readInteger());

        for(const chunk of changedChunks.values()) {
            self.updateChunk(chunk);
        }
        
        return true;        
    } 


    function receiveVideoChatMessage(reader, messageType) {
        if(messageType != InMessageType.VideoChat) return false;

        const message        = {};
        message.sender       = reader.readString();
        message.receiver     = reader.readString();
        message.type         = reader.readInteger();
        const messageText    = reader.readString();
        message.object       = JSON.parse(messageText);
        assert(endTag       == reader.readInteger());
        
        self.receiveVideoChatHandler(message);
        return true;        
    }
        

    function receiveChunksMessage(reader, messageType) {
        if(messageType != InMessageType.Chunks) return false;

        const message        = {};
        message.requestId    = reader.readInteger();
        message.chunkCount   = reader.readInteger();
        message.chunks       = new Array(message.chunkCount);
        for(var x=0; x < message.chunkCount; x++) {
            const regionPoint= reader.readInteger();
            const chunkPoint = reader.readUShort();
            const chunkPos   = ChunkPos.createFromServerRegionPoint(regionPoint, chunkPoint);
            const chunk      = {};
            chunk.x          = ChunkPos.getX(chunkPos);
            chunk.y          = ChunkPos.getY(chunkPos);
            chunk.z          = ChunkPos.getZ(chunkPos);
            chunk.solidBlocks= reader.readUShort();
            chunk.transparentBlocks = reader.readInteger();
            const blockCount = chunk.solidBlocks + chunk.transparentBlocks;
            if(blockCount > 0) {
                chunk.blocks = new IntegerArray(-1, 64, reader.readInt32Array(blockCount));
            }
            message.chunks[x]= chunk;
        }

        assert(endTag == reader.readInteger());
        self.receiveChunksHandler(message);
        return true;        
    }


    function receiveBlockResourceMessage(reader, messageType) {
        if(messageType != InMessageType.BlockResource) return false;

        const message        = {};
        message.x            = reader.readInteger();
        message.y            = reader.readInteger();
        message.z            = reader.readInteger();
        message.type         = reader.readInteger();
        message.text         = reader.readString();
        assert(endTag == reader.readInteger());
        self.receiveBlockResourceHandler(message);
        return true;        
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // send messages
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var outMessageCount = 0;

    function sendMessage(message, tries) {
        if(tries <= 0) return;
        if(webSocket.readyState == WebSocket.OPEN) {
            webSocket.send(message);
        }
        else if(webSocket.readyState == WebSocket.CONNECTING) {
            setTimeout(function() {
                Log.trace("WebSocket retry send");
                sendMessage(message, tries - 1);
            }, 100);
        }
        else {
            Log.trace("WebSocket connection lost");
            self.connectionLostHandler();            
        }

    }


    this.requestLogin = function(name, password) {
        name   = name.substring(0, 30);
        password = password.substring(0, 30);

        writer.reset();
        writer.writeInteger(OutMessageType.Login);
        writer.writeString(name);
        writer.writeString(password);
        writer.writeInteger(endTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message " + (++outMessageCount) + ", request login");
        sendMessage(message, 50);
    }


    this.requestMoveActor = function(newActorPosition, newActorRotation) {
        writer.reset();
        writer.writeInteger(OutMessageType.MoveActor);
        writer.writeFloat(newActorPosition.x);
        writer.writeFloat(newActorPosition.y);
        writer.writeFloat(newActorPosition.z);
        writer.writeFloat(newActorRotation.y);
        writer.writeInteger(endTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message " + (++outMessageCount) + ", move actor");
        sendMessage(message, 3);
    }

    
    this.requestListActors = function() {
        writer.reset();
        writer.writeInteger(OutMessageType.ListActors);
        writer.writeInteger(endTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message " + (++outMessageCount) + ", list actors");
        sendMessage(message, 25);
    }


    this.requestRemoveBlock = function(blockX, blockY, blockZ) {
        writer.reset();
        writer.writeInteger(OutMessageType.RemoveBlock);
        writer.writeInteger(blockX);
        writer.writeInteger(blockY);
        writer.writeInteger(blockZ);
        writer.writeInteger(endTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message " + (++outMessageCount) + ", remove block");
        sendMessage(message, 3);
    }


    this.requestAddBlock = function(blockX, blockY, blockZ, blockInfo) {
        writer.reset();
        writer.writeInteger(OutMessageType.AddBlock);
        writer.writeInteger(blockX);
        writer.writeInteger(blockY);
        writer.writeInteger(blockZ);
        writer.writeShort(blockInfo);
        writer.writeInteger(endTag);
        
        const message = writer.ToArrayBuffer();
        Log.trace("send message " + (++outMessageCount) + ", add block");
        sendMessage(message, 3);
    }


    this.requestChangeBlock = function(blockX, blockY, blockZ, blockInfo) {
        assert(blockInfo > 0);
        writer.reset();
        writer.writeInteger(OutMessageType.ChangeBlock);
        writer.writeInteger(blockX);
        writer.writeInteger(blockY);
        writer.writeInteger(blockZ);
        writer.writeShort(blockInfo);
        writer.writeInteger(endTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message " + (++outMessageCount) + ", change block");
        sendMessage(message, 3);
    }


    this.requestSwitchBlock = function(blockX, blockY, blockZ) {
        writer.reset();
        writer.writeInteger(OutMessageType.SwitchBlock);
        writer.writeInteger(3); 
        writer.writeInteger(blockX);           
        writer.writeInteger(blockY);           
        writer.writeInteger(blockZ);           
        writer.writeInteger(endTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message " + (++outMessageCount) + ", switch block");
        sendMessage(message, 3);
    }


    this.requestSwitchBlocks = function(coordinatesNumberArray) {
        writer.reset();
        writer.writeInteger(OutMessageType.SwitchBlock);
        writer.writeInteger(coordinatesNumberArray.getLength());            
        for(var i=0; i < coordinatesNumberArray.getLength(); i++) {
            writer.writeInteger( coordinatesNumberArray.get(i) );
        }
        writer.writeInteger(endTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message " + (++outMessageCount) + ", switch blocks");
        sendMessage(message, 3);
    }


    this.requestChat = function(chatMessage) {
        writer.reset();
        writer.writeInteger(OutMessageType.ChatMessage);
        writer.writeString(chatMessage);
        writer.writeInteger(endTag);
        
        const message = writer.ToArrayBuffer();
        Log.trace("send message " + (++outMessageCount) + ", chat");
        sendMessage(message, 3);
    }


    this.requestVideoChat = function(sender, receiver, messageType, messageObject) {
        const messageText = JSON.stringify(messageObject);

        writer.reset();
        writer.writeInteger(OutMessageType.VideoChatMessage);
        writer.writeString(sender);
        writer.writeString(receiver);
        writer.writeInteger(messageType);
        writer.writeString(messageText);
        writer.writeInteger(endTag);
        
        const message = writer.ToArrayBuffer();
        Log.trace("send message " + (++outMessageCount) + ", video chat of type " + messageType);
        sendMessage(message, 3);
    }


    const regionMap = new Map();
    this.requestChunks = function(chunkRequestId, chunkNumberArray) {
        convertChunkNumberArrayToRegionMap(regionMap, chunkNumberArray);

        writer.reset();
        writer.writeInteger(OutMessageType.GetChunks);
        writer.writeInteger(chunkRequestId);

        writer.writeInteger(chunkNumberArray.getLength());            
        writer.writeInteger(regionMap.size);            
        for (let [regionPoint, chunkList] of regionMap) {
            writer.writeInteger(regionPoint);
            writer.writeShort(chunkList.length);
            for(var i=0; i<chunkList.length; i++) {
                writer.writeShort(chunkList[i]);
            }
        }

        writer.writeInteger(endTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message " + (++outMessageCount) + ", request chunks, length " + message.byteLength);
        sendMessage(message, 3);        
    }


    this.requestBlockResource = function(blockPos, type, password) {
        writer.reset();
        writer.writeInteger(OutMessageType.GetBlockResource);
        writer.writeInteger(blockPos.x);
        writer.writeInteger(blockPos.y);
        writer.writeInteger(blockPos.z);
        writer.writeInteger(type);
        writer.writeString(password);
        writer.writeInteger(endTag);
        
        const message = writer.ToArrayBuffer();
        Log.trace("send message " + (++outMessageCount) + ", request block resource");
        sendMessage(message, 3);
    }


    this.requestSaveBlockResource = function(blockPos, type, text, password, newPassword) {
        writer.reset();
        writer.writeInteger(OutMessageType.SaveBlockResource);
        writer.writeInteger(blockPos.x);
        writer.writeInteger(blockPos.y);
        writer.writeInteger(blockPos.z);
        writer.writeInteger(type);
        writer.writeString(password);
        writer.writeString(newPassword);
        writer.writeString(text);
        writer.writeInteger(endTag);
        
        const message = writer.ToArrayBuffer();
        Log.trace("send message " + (++outMessageCount) + ", save block resource");
        sendMessage(message, 3);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // support methods
    ///////////////////////////////////////////////////////////////////////////////////////////////

    function convertChunkNumberArrayToRegionMap(regionMap, chunkNumberArray) {
        regionMap.clear();
        for(var i=0; i < chunkNumberArray.getLength(); i++) {
            const chunkPos = chunkNumberArray.get(i);
            const regionPoint = ChunkPos.getServerRegionPoint(chunkPos);
            const chunkPoint  = ChunkPos.getServerChunkPoint(chunkPos);

            if(!regionMap.has(regionPoint)) {
                regionMap.set(regionPoint, []);
            }
            const chunkList = regionMap.get(regionPoint);
            chunkList.push(chunkPoint);
        }
    }

}

