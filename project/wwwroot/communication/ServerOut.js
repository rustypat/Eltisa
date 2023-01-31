'use strict';

function ServerOut(serverSocket) {
    
    const writer      = new ArrayWriter(Config.maxMessageLength);


    this.requestLogin = function(name, password) {
        name   = name.substring(0, 30);
        password = password.substring(0, 30);

        writer.reset();
        writer.writeInteger(SM_LoginRequest);
        writer.writeString(name);
        writer.writeString(password);
        writer.writeInteger(SMT_EndTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message request login");
        serverSocket.sendMessage(message, 50);
    }


    this.requestMoveActor = function(newActorPosition, newActorRotation) {
        writer.reset();
        writer.writeInteger(SM_MoveActor);
        writer.writeFloat(newActorPosition.x);
        writer.writeFloat(newActorPosition.y);
        writer.writeFloat(newActorPosition.z);
        writer.writeFloat(newActorRotation.y);
        writer.writeInteger(SMT_EndTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message move actor");
        serverSocket.sendMessage(message, 3);
    }

    
    this.requestListActors = function() {
        writer.reset();
        writer.writeInteger(SM_ListActorsRequest);
        writer.writeInteger(SMT_EndTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message list actors");
        serverSocket.sendMessage(message, 25);
    }


    this.requestRemoveBlock = function(blockX, blockY, blockZ) {
        writer.reset();
        writer.writeInteger(SM_RemoveBlock);
        writer.writeInteger(blockX);
        writer.writeInteger(blockY);
        writer.writeInteger(blockZ);
        writer.writeInteger(SMT_EndTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message remove block");
        serverSocket.sendMessage(message, 3);
    }


    this.requestAddBlock = function(blockX, blockY, blockZ, blockInfo) {
        writer.reset();
        writer.writeInteger(SM_AddBlock);
        writer.writeInteger(blockX);
        writer.writeInteger(blockY);
        writer.writeInteger(blockZ);
        writer.writeShort(blockInfo);
        writer.writeInteger(SMT_EndTag);
        
        const message = writer.ToArrayBuffer();
        Log.trace("send message add block");
        serverSocket.sendMessage(message, 3);
    }


    this.requestChangeBlock = function(blockX, blockY, blockZ, blockInfo) {
        assert(blockInfo > 0);
        writer.reset();
        writer.writeInteger(SM_ChangeBlock);
        writer.writeInteger(blockX);
        writer.writeInteger(blockY);
        writer.writeInteger(blockZ);
        writer.writeShort(blockInfo);
        writer.writeInteger(SMT_EndTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message change block");
        serverSocket.sendMessage(message, 3);
    }


    this.requestSwitchBlock = function(blockX, blockY, blockZ) {
        writer.reset();
        writer.writeInteger(SM_SwitchBlock);
        writer.writeInteger(3); 
        writer.writeInteger(blockX);           
        writer.writeInteger(blockY);           
        writer.writeInteger(blockZ);           
        writer.writeInteger(SMT_EndTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message switch block");
        serverSocket.sendMessage(message, 3);
    }


    this.requestSwitchBlocks = function(coordinatesNumberArray) {
        writer.reset();
        writer.writeInteger(SM_SwitchBlock);
        writer.writeInteger(coordinatesNumberArray.getLength());            
        for(var i=0; i < coordinatesNumberArray.getLength(); i++) {
            writer.writeInteger( coordinatesNumberArray.get(i) );
        }
        writer.writeInteger(SMT_EndTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message switch blocks");
        serverSocket.sendMessage(message, 3);
    }


    this.requestChat = function(chatMessage) {
        writer.reset();
        writer.writeInteger(SM_ChatMessageRequest);
        writer.writeString(chatMessage);
        writer.writeInteger(SMT_EndTag);
        
        const message = writer.ToArrayBuffer();
        Log.trace("send message chat");
        serverSocket.sendMessage(message, 3);
    }


    this.requestVideoChat = function(sender, receiver, messageType, messageObject) {
        const messageText = JSON.stringify(messageObject);

        writer.reset();
        writer.writeInteger(SM_VideoChatMessageRequest);
        writer.writeString(sender);
        writer.writeString(receiver);
        writer.writeInteger(messageType);
        writer.writeString(messageText);
        writer.writeInteger(SMT_EndTag);
        
        const message = writer.ToArrayBuffer();
        Log.trace("send message video chat of type " + messageType);
        serverSocket.sendMessage(message, 3);
    }


    const regionMap = new Map();
    this.requestChunks = function(chunkRequestId, chunkNumberArray) {
        convertChunkNumberArrayToRegionMap(regionMap, chunkNumberArray);

        writer.reset();
        writer.writeInteger(SM_GetChunksRequest);
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

        writer.writeInteger(SMT_EndTag);

        const message = writer.ToArrayBuffer();
        Log.trace("send message request chunks");
        serverSocket.sendMessage(message, 3);        
    }


    this.requestReadResource = function(blockPos, type, password) {
        writer.reset();
        writer.writeInteger(SM_ReadResourceRequest);
        writer.writeInteger(blockPos.x);
        writer.writeInteger(blockPos.y);
        writer.writeInteger(blockPos.z);
        writer.writeInteger(type);
        writer.writeString(password);
        writer.writeInteger(SMT_EndTag);
        
        const message = writer.ToArrayBuffer();
        Log.trace("send message read resource");
        serverSocket.sendMessage(message, 3);
    }


    this.requestWriteResource = function(blockPos, type, password, stringData) {
        writer.reset();
        writer.writeInteger(SM_WriteResourceRequest);
        writer.writeInteger(blockPos.x);
        writer.writeInteger(blockPos.y);
        writer.writeInteger(blockPos.z);
        writer.writeInteger(type);
        writer.writeString(password);
        writer.writeString(stringData);
        writer.writeInteger(SMT_EndTag);
        
        const message = writer.ToArrayBuffer();
        Log.trace("send message write resource");
        serverSocket.sendMessage(message, 3);
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

