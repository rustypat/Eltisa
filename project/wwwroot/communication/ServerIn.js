'use strict';

function ServerIn(serversocket) {
    
    const self        = this;
    const handlers    = new Array(SM_Max).fill(receiveUnknownMessage);
    handlers[SM_GetChunksResponse]          = receiveChunksMessage;
    handlers[SM_ListActorsResponse]         = receiveActorListMessage;
    handlers[SM_ActorMoved]                 = receiveActorMovedMessage;
    handlers[SM_ActorJoined]                = receiveActorJoinedMessage;
    handlers[SM_ActorLeft]                  = receiveActorLeftMessage;
    handlers[SM_BlocksChangedNotification]  = receiveBlocksChangedMessage;
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
            handlers[messageType](reader);
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // client event handler 
    ///////////////////////////////////////////////////////////////////////////////////////////////

    this.receiveLoginHandler           = function(message) {};
    this.receiveActorListHandler       = function(names) {};
    this.receiveActorMovedHandler      = function(id, x, y, z, orientation) {};
    this.actorJoinedObserver           = new Observer();    // (id, name, type, look) 
    this.actorLeftObserver             = new Observer();    // (id, name)
    this.receiveChatHandler            = function(message) {};
    this.receiveChunksHandler          = function(message) {};
    this.receiveVideoChatHandler       = function(message) {};
    this.updateBlock                   = function(x, y, z, blockData) {};
    this.updateChunk                   = function(chunk) {};
    this.receiveResourceHandler        = function(messageType, blockType, response, resourceText) {};
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // receive message handler
    ///////////////////////////////////////////////////////////////////////////////////////////////

    function receiveUnknownMessage(reader) {
        reader.reset();
        const messageType    = reader.readInteger();
        Log.Error("received unknown message of type " + messageType);
    }
    
    function receiveLoginMessage(reader) {
        const loginResponse = reader.readInteger();
        const actorId       = reader.readInteger();
        const actorType     = reader.readInteger();
        const actorName     = reader.readString();
        const actorColor    = reader.readInteger();
        assert(SMT_EndTag == reader.readInteger());
        
        self.receiveLoginHandler(loginResponse, actorId, actorType, actorName, actorColor);
    }


    function receiveActorMovedMessage(reader) {
        const id           = reader.readInteger();      
        const x            = reader.readFloat();
        const y            = reader.readFloat();
        const z            = reader.readFloat();
        const orientation  = reader.readFloat();
        assert(SMT_EndTag == reader.readInteger());        
        self.receiveActorMovedHandler(id, x, y, z, orientation);
    }


    function receiveActorJoinedMessage(reader) {
        const id           = reader.readInteger(); 
        const type         = reader.readInteger(); 
        const look         = reader.readInteger(); 
        const name         = reader.readString();
        assert(SMT_EndTag == reader.readInteger());        
        self.actorJoinedObserver.call(id, name, type, look);
    }


    function receiveActorLeftMessage(reader) {
        const id           = reader.readInteger();    
        const name         = reader.readString();
        assert(SMT_EndTag == reader.readInteger());        
        self.actorLeftObserver.call(id, name);
    }


    function receiveActorListMessage(reader) {
        const actorCount   = reader.readInteger();
        const names        = new Array(actorCount);
        for(let x=0; x < actorCount; x++) {
            names[x] = reader.readString();
        }
        assert(SMT_EndTag       == reader.readInteger());
        
        self.receiveActorListHandler(names);
    }


    function receiveChatMessage(reader) {
        const message        = {};
        message.message      = reader.readString();
        message.sender       = reader.readString();
        assert(SMT_EndTag       == reader.readInteger());
        
        self.receiveChatHandler(message);
    }
    

    function receiveBlocksChangedMessage(reader) {
        const changedChunks = new Set();
        const blockCount     = reader.readInteger();
        for(let i=0; i < blockCount; i++) {
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
    } 


    function receiveVideoChatMessage(reader) {
        const message        = {};
        message.sender       = reader.readString();
        message.receiver     = reader.readString();
        message.type         = reader.readInteger();
        const messageText    = reader.readString();
        message.object       = JSON.parse(messageText);
        assert(SMT_EndTag       == reader.readInteger());
        
        self.receiveVideoChatHandler(message);
    }
        

    function receiveChunksMessage(reader) {
        const message        = {};
        message.requestId    = reader.readInteger();
        message.chunkCount   = reader.readInteger();
        message.chunks       = new Array(message.chunkCount);
        for(let x=0; x < message.chunkCount; x++) {
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
    }


    function receiveCreateResourceResponseMessage(reader) {
        const x            = reader.readInteger();
        const y            = reader.readInteger();
        const z            = reader.readInteger();
        const blockType    = reader.readUShort();
        const response     = reader.readUShort();
        assert(SMT_EndTag == reader.readInteger());
        self.receiveResourceHandler?.(SM_CreateResourceResponse, blockType, response, null);
    }


    function receiveReadResourceResponseMessage(reader) {
        const x            = reader.readInteger();
        const y            = reader.readInteger();
        const z            = reader.readInteger();
        const targetId     = reader.readInteger();
        const blockType    = reader.readUShort();
        const response     = reader.readUShort();
        const accessRights = reader.readUShort();
        const resourceType = reader.readUShort();
        const resourceText = reader.readString();    
        assert(SMT_EndTag == reader.readInteger());
        self.receiveResourceHandler?.(SM_ReadResourceResponse, blockType, response, resourceText, targetId);
    }


    function receiveWriteResourceResponseMessage(reader) {
        const x            = reader.readInteger();
        const y            = reader.readInteger();
        const z            = reader.readInteger();
        const blockType    = reader.readUShort();
        const response     = reader.readUShort();
        assert(SMT_EndTag == reader.readInteger());
        self.receiveResourceHandler?.(SM_WriteResourceResponse, blockType, response, null);
    }


    function receiveUpdateResourceResponseMessage(reader) {
        const x            = reader.readInteger();
        const y            = reader.readInteger();
        const z            = reader.readInteger();
        const blockType    = reader.readUShort();
        const response     = reader.readUShort();
        assert(SMT_EndTag == reader.readInteger());
        self.receiveResourceHandler?.(SM_UpdateResourceResponse, blockType, response, null);
    }


    function receiveDeleteResourceResponseMessage(reader) {
        const x            = reader.readInteger();
        const y            = reader.readInteger();
        const z            = reader.readInteger();
        const blockType    = reader.readUShort();
        const response     = reader.readUShort();
        assert(SMT_EndTag == reader.readInteger());
        self.receiveResourceHandler?.(SM_DeleteResourceResponse, blockType, response, null);
    }

}

