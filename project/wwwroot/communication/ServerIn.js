'use strict';

function ServerIn(serversocket) {
    
    const self        = this;
    const handlers    = new Array(100).fill(receiveUnknownMessage);
    handlers[SM_GetChunksResponse]          = receiveChunksMessage;
    handlers[SM_ActorChanged]               = receiveActorChangedMessage;
    handlers[SM_BlocksChangedNotification]  = receiveBlocksChangedMessage;
    handlers[SM_ListActorsResponse]         = receiveActorListMessage;
    handlers[SM_ChatMessageResponse]        = receiveChatMessage;
    handlers[SM_LoginResponse]              = receiveLoginMessage;
    handlers[SM_VideoChatMessageResponse]   = receiveVideoChatMessage;
    handlers[SM_CreateResourceResponse]     = receiveCreateResourceResponseMessage;
    handlers[SM_ReadResourceResponse]       = receiveReadResourceResponseMessage;
    handlers[SM_WriteResourceResponse]      = receiveWriteResourceResponseMessage;
    handlers[SM_UpdateResourceResponse]     = receiveUpdateResourceResponseMessage;
    handlers[SM_DeleteResourceResponse]     = receiveDeleteResourceResponseMessage;
    
    serversocket.setMessageHandler( handleInputMessage);
        
    function handleInputMessage(event) {
        assert(event.data instanceof ArrayBuffer);
        const reader = new ArrayReader(event.data);
        const messageType    = reader.readInteger();
        const messageCounter = reader.readInteger();
        Log.trace("received message " + messageType + "  (" + event.data.byteLength + " bytes)");
        if(messageType < 0 || messageType >= SM_Max ) {
            Log.Error("received message with invalid message type " + messageType);
        }
        else {
            handlers[messageType](reader, messageType);
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // client event handler 
    ///////////////////////////////////////////////////////////////////////////////////////////////

    this.receiveLoginHandler           = function(message) {};
    this.receiveActorChangedHandler    = function(message) {};
    this.receiveActorListHandler       = function(message) {};
    this.receiveChatHandler            = function(message) {};
    this.receiveChunksHandler          = function(message) {};
    this.receiveVideoChatHandler       = function(message) {};
    this.updateBlock                   = function(x, y, z, blockData) {};
    this.updateChunk                   = function(chunk) {};
    this.receiveResourceHandler        = function(messageType, blockType, response, resourceText) {};
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // receive message handler
    ///////////////////////////////////////////////////////////////////////////////////////////////

    function receiveUnknownMessage(reader, messageType) {
        Log.Error("received unknown message of type " + messageType);
    }
    
    function receiveLoginMessage(reader, messageType) {
        if(messageType != SM_LoginResponse) return false;

        const message        = {};
        message.actorId      = reader.readInteger();
        message.actorType    = reader.readInteger();
        message.actorName    = reader.readString();
        message.actorColor   = reader.readInteger();
        assert(SMT_EndTag == reader.readInteger());
        
        self.receiveLoginHandler(message);
        return true;
    }


    function receiveActorChangedMessage(reader, messageType) {
        if(messageType != SM_ActorChanged) return false;

        const message        = {};
        message.change       = reader.readInteger();       // change type
        message.id           = reader.readInteger();       // actor id
        message.name         = reader.readString();
        message.color        = reader.readInteger();
        message.positionX    = reader.readFloat();
        message.positionY    = reader.readFloat();
        message.positionZ    = reader.readFloat();
        message.rotationY    = reader.readFloat();
        assert(SMT_EndTag == reader.readInteger());
        
        self.receiveActorChangedHandler(message);
        return true;
    }


    function receiveActorListMessage(reader, messageType) {
        if(messageType != SM_ListActorsResponse) return false;

        const message        = {};
        message.actorCount   = reader.readInteger();
        message.names        = new Array(message.actorCount);
        for(var x=0; x < message.actorCount; x++) {
            message.names[x] = reader.readString();
        }
        assert(SMT_EndTag       == reader.readInteger());
        
        self.receiveActorListHandler(message);
        return true;
    }


    function receiveChatMessage(reader, messageType) {
        if(messageType != SM_ChatMessageResponse) return false;

        const message        = {};
        message.message      = reader.readString();
        message.sender       = reader.readString();
        assert(SMT_EndTag       == reader.readInteger());
        
        self.receiveChatHandler(message);
        return true;        
    }
    

    function receiveBlocksChangedMessage(reader, messageType) {
        if(messageType != SM_BlocksChangedNotification) return false;

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
        assert(SMT_EndTag       == reader.readInteger());

        for(const chunk of changedChunks.values()) {
            self.updateChunk(chunk);
        }
        
        return true;        
    } 


    function receiveVideoChatMessage(reader, messageType) {
        if(messageType != SM_VideoChatMessageResponse) return false;

        const message        = {};
        message.sender       = reader.readString();
        message.receiver     = reader.readString();
        message.type         = reader.readInteger();
        const messageText    = reader.readString();
        message.object       = JSON.parse(messageText);
        assert(SMT_EndTag       == reader.readInteger());
        
        self.receiveVideoChatHandler(message);
        return true;        
    }
        

    function receiveChunksMessage(reader, messageType) {
        if(messageType != SM_GetChunksResponse) return false;

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

        assert(SMT_EndTag == reader.readInteger());
        self.receiveChunksHandler(message);
        return true;        
    }


    function receiveCreateResourceResponseMessage(reader, messageType) {
        if(messageType != SM_CreateResourceResponse) return false;

        const x            = reader.readInteger();
        const y            = reader.readInteger();
        const z            = reader.readInteger();
        const blockType    = reader.readUShort();
        const response     = reader.readUShort();
        assert(SMT_EndTag == reader.readInteger());
        self.receiveResourceHandler(SM_CreateResourceResponse, blockType, response, null);
        return true;        
    }


    function receiveReadResourceResponseMessage(reader, messageType) {
        if(messageType != SM_ReadResourceResponse) return false;

        const x            = reader.readInteger();
        const y            = reader.readInteger();
        const z            = reader.readInteger();
        const blockType    = reader.readUShort();
        const response     = reader.readUShort();
        const accessRights = reader.readUShort();
        const resourceType = reader.readUShort();
        const resourceText = reader.readString();    
        assert(SMT_EndTag == reader.readInteger());
        self.receiveResourceHandler(SM_ReadResourceResponse, blockType, response, resourceText);
        return true;        
    }


    function receiveWriteResourceResponseMessage(reader, messageType) {
        if(messageType != SM_WriteResourceResponse) return false;

        const x            = reader.readInteger();
        const y            = reader.readInteger();
        const z            = reader.readInteger();
        const blockType    = reader.readUShort();
        const response     = reader.readUShort();
        assert(SMT_EndTag == reader.readInteger());
        self.receiveResourceHandler(SM_WriteResourceResponse, blockType, response, null);
        return true;        
    }


    function receiveUpdateResourceResponseMessage(reader, messageType) {
        if(messageType != SM_UpdateResourceResponse) return false;

        const x            = reader.readInteger();
        const y            = reader.readInteger();
        const z            = reader.readInteger();
        const blockType    = reader.readUShort();
        const response     = reader.readUShort();
        assert(SMT_EndTag == reader.readInteger());
        self.receiveResourceHandler(SM_UpdateResourceResponse, blockType, response, null);
        return true;        
    }


    function receiveDeleteResourceResponseMessage(reader, messageType) {
        if(messageType != SM_DeleteResourceResponse) return false;

        const x            = reader.readInteger();
        const y            = reader.readInteger();
        const z            = reader.readInteger();
        const blockType    = reader.readUShort();
        const response     = reader.readUShort();
        assert(SMT_EndTag == reader.readInteger());
        self.receiveResourceHandler(SM_DeleteResourceResponse, blockType, response, null);
        return true;        
    }


}

