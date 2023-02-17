'use strict';


function WorldPort(body) {
    
    const canvas             = GuiTools.createGameCanvas(body, "100%", "100%");
    
    // scene
    const engine             = new BABYLON.Engine(canvas, true);    
    const scene              = new BABYLON.Scene(engine);
	const camera             = new BABYLON.UniversalCamera("freeCamera", new BABYLON.Vector3(0,0,0), scene);

    // configure scene
    scene.gravity            = new BABYLON.Vector3(0, -0.25, 0);
    scene.collisionsEnabled  = true;
    scene.workerCollisions   = false;
    scene.fogMode            = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogStart           = Config.getEnvironmentBlockRadius() - Config.chunkSize * 1;
    scene.fogEnd             = Config.getEnvironmentBlockRadius();
    scene.fogColor           = scene.clearColor;

    // light
    const light              = new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(1, 3, 0.5), scene);
    light.diffuse            = new BABYLON.Color3(1, 1, 1);
    light.specular           = new BABYLON.Color3(0, 0, 0);
    light.groundColor        = new BABYLON.Color3(0.5, 0.5, 0.5);    

    let skyBox               = null;
        
    // materials
    const solidMaterial      = new BABYLON.StandardMaterial("solidMaterial",scene);
    solidMaterial.diffuseTexture= new BABYLON.Texture("/resources/solidAtlas.png");
    solidMaterial.freeze();

    const transparentMaterial  = new BABYLON.StandardMaterial("transparentMaterial",scene);
    transparentMaterial.diffuseTexture= new BABYLON.Texture("/resources/transparentAtlas.png");
    transparentMaterial.diffuseTexture.hasAlpha = true;    
    transparentMaterial.freeze();

    const actorMaterial      = new BABYLON.StandardMaterial("material", scene);
    actorMaterial.diffuseTexture   = new BABYLON.Texture("/resources/actor.png", scene)
    actorMaterial.freeze();
    
    let environmentBlockRadius = Config.getEnvironmentBlockRadius();;
    let needsRendering       = true;
    
    const babylonBlack       = new BABYLON.Color3(0, 0, 0);
    const babylonSkyBlue     = new BABYLON.Color3(0.58, 0.81, 0.91);  
    const babylonDarkerGrey  = new BABYLON.Color3(0.1, 0.1, 0.1);
    const babylonDarkGrey    = new BABYLON.Color3(0.3, 0.3, 0.3);
    const babylonGrey        = new BABYLON.Color3(0.5, 0.5, 0.5); 

    const spaceHeight        = 10000;
    const groundHeight       = 0;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // varia
    ///////////////////////////////////////////////////////////////////////////////////////////////

    this.getCanvas = () => canvas;

    this.lockPointer = function() {
        canvas.requestPointerLock();
        canvas.focus();
    }


    this.hasPointerLock = function() {
        return document.pointerLockElement === canvas;
    }


    this.dispose = function() {
        camera.dispose();        
        scene.dispose();
        engine.dispose();
    }


    this.pickCenterInfo = function() {
        const width = engine.getRenderWidth();
        const height = engine.getRenderHeight();
        return scene.pick(width/2, height/2, null, false, camera);
    }


    this.pickWithRay = function(directionBabylonRay) {
        return scene.pickWithRay(directionBabylonRay, function() {return true; });
    }


    this.resize = function() {
        engine.resize();
        needsRendering = true;
    }


    this.getFramesPerSecond = function() {
        return Math.round(engine.getFps());
    }


    this.getCamera = function() {
        return camera;
    }


    let isRendering = false;
    this.startRenderLoop = function(renderFunction) {
        if(isRendering) return;
        engine.runRenderLoop( renderFunction);
        isRendering = true;
    }

    this.stopRenderLoop = function() {
        if(!isRendering) return;
        engine.stopRenderLoop();
        isRendering = false;
    }


    const playerPosition       = Vector.create(0, 0, 0);
    const playerDirection      = Vector.create(0, 0, 0);    

    this.updatePositionAndDirection = function(newPlayerPosition, newPlayerDirection) {
        if( ! Vector.equals(playerPosition, newPlayerPosition) ) {
            Vector.copy(playerPosition, newPlayerPosition);
            needsRendering = true;
        }
        if( ! Vector.equals(playerDirection, newPlayerDirection) ) {
            Vector.copy(playerDirection, newPlayerDirection);
            needsRendering = true;
        }
    }
    
    this.updateScene = function() {
        if( !needsRendering ) return;
        needsRendering       = false;

        if( environmentBlockRadius > Config.getEnvironmentBlockRadius() ) {
            environmentBlockRadius = Config.getEnvironmentBlockRadius();
            needsRendering         = true;
        }
        else if( environmentBlockRadius < Config.getEnvironmentBlockRadius() ) {
            environmentBlockRadius += 0.5;
            needsRendering         = true;
        }
        
        const height = camera.position.y;
        if( height > spaceHeight + 500 ) {
            light.groundColor     = babylonDarkGrey;
            light.intensity       =  1.2;
            if(!skyBox) skyBox    = createSpaceSkybox();
            skyBox.position       = camera.position;
            skyBox.setEnabled(true);
            scene.autoClear       = true;
            scene.clearColor      = babylonBlack;
            scene.fogColor        = babylonBlack;
            scene.fogStart        = 1000;
            scene.fogEnd          = 2000;
        }
        else if( height > spaceHeight ) {
            light.groundColor     = babylonDarkGrey;
            light.intensity       =  1.2;
            if( !skyBox ) skyBox  = createSpaceSkybox();
            skyBox.position       = camera.position;
            skyBox.setEnabled(true);
            scene.autoClear       = true;
            scene.clearColor      = babylonSkyBlue;
            const d               = height - spaceHeight;
            scene.fogColor        = babylonSkyBlue;
            scene.fogStart        = 400 + d;
            scene.fogEnd          = 500 + d;
        }
        else if( height > spaceHeight - 1000 ) {
            light.groundColor     = calculateProportionalColor(height, spaceHeight - 1000, spaceHeight, babylonGrey, babylonDarkerGrey);
            light.intensity       = calculateProportionalValue(height, spaceHeight - 1000, spaceHeight, 1, 1.2);
            if(skyBox) skyBox.setEnabled(false);
            scene.autoClear       = true;
            scene.clearColor      = babylonSkyBlue;
            scene.fogColor        = babylonSkyBlue;
            scene.fogEnd          = Math.floor(environmentBlockRadius);
            scene.fogStart        = Math.floor(environmentBlockRadius - Config.chunkSize * 1.5);
        }
        else if( height > groundHeight ) {
            light.groundColor     = babylonGrey;
            light.intensity       = 1;
            if(skyBox) skyBox.setEnabled(false);

            scene.autoClear       = true;
            scene.clearColor      = babylonSkyBlue;
            scene.fogColor        = babylonSkyBlue;
            scene.fogStart        = Math.floor(environmentBlockRadius - Config.chunkSize * 1.5);
            scene.fogEnd          = Math.floor(environmentBlockRadius);
        }
        else if( height > groundHeight - 100 ) {
            light.groundColor     = babylonGrey;
            light.intensity       = calculateProportionalValue(height, groundHeight-100, groundHeight, 0.5, 1);
            if(skyBox) skyBox.setEnabled(false);

            scene.autoClear       = true;
            scene.clearColor      = calculateProportionalColor(height, groundHeight-100, groundHeight, babylonDarkGrey, babylonSkyBlue);
            scene.fogColor        = scene.clearColor;
            scene.fogStart        = Math.floor(environmentBlockRadius - Config.chunkSize * 1.5);
            scene.fogEnd          = Math.floor(environmentBlockRadius);
        }
        else {
            light.groundColor     = babylonGrey;
            light.intensity       = 0.5;
            if(skyBox) skyBox.setEnabled(false);

            scene.autoClear       = true;
            scene.clearColor      = babylonDarkGrey;
            scene.fogColor        = babylonDarkGrey;
            scene.fogStart        = Math.floor(environmentBlockRadius - Config.chunkSize * 1.5);
            scene.fogEnd          = Math.floor(environmentBlockRadius);
        }
    
        scene.render();
    }


    function calculateProportionalColor(inValue, inMinValue, inMaxValue, minColor, maxColor) {
        assert(inMaxValue > inMinValue);
        if(inValue <= inMinValue) return minColor;   
        if(inValue >= inMaxValue) return maxColor; 

        const d     = (inValue - inMinValue) / (inMaxValue - inMinValue);
        const red   = d * maxColor.r + (1-d) * minColor.r;
        const green = d * maxColor.g + (1-d) * minColor.g;
        const blue  = d * maxColor.b + (1-d) * minColor.b;

        return new BABYLON.Color3(red, green, blue);    
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // blocks
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
    const solidVertexData         = createVertexData(solidMaterial, true);
    const transparentVertexData   = createVertexData(transparentMaterial, true);
    const permeableVertexData     = createVertexData(transparentMaterial, false);
    const meshPos                 = Vector.create(0, 0, 0);
    
    this.addChunkMesh = function(chunk) {
        if( !chunk.blocks                 ) return;
        if( chunk.blocks.getLength() == 0 ) return;

        clearVertexData(solidVertexData);
        clearVertexData(transparentVertexData);
        clearVertexData(permeableVertexData);
        
        for(let i=0; i < chunk.blocks.getLength(); i++) {
            const blockData = chunk.blocks.get(i);
            const viewInfo  = WorldInfo.getViewInfo(blockData);   
            if( viewInfo.isPermeable ) {
                addBlockToVertexData(permeableVertexData, blockData, viewInfo);
            }   
            else if( viewInfo.isTransparent) {
                addBlockToVertexData(transparentVertexData, blockData, viewInfo);
            }      
            else {
                addBlockToVertexData(solidVertexData, blockData, viewInfo);
            }
        }    

        Vector.copyAsWorldVector(meshPos, chunk);
        chunk.solidMesh                = createMeshFromVertexData(solidVertexData, meshPos);
        chunk.transparentMesh          = createMeshFromVertexData(transparentVertexData, meshPos);
        chunk.permeableMesh            = createMeshFromVertexData(permeableVertexData, meshPos);
        needsRendering                 = true;
    }


    this.updateChunkMesh = function(chunk, checkCollision) {
        if(!chunk) return;
        if(chunk.solidMesh) {
            chunk.solidMesh.checkCollisions = checkCollision;
        }
        if(chunk.transparentMesh) {
            chunk.transparentMesh.checkCollisions = checkCollision;
        }
    }


    this.removeChunkMesh = function(chunk) {
        if(!chunk) return;
        if(chunk.solidMesh) {
            chunk.solidMesh.dispose();
            needsRendering = true;
        }
        if(chunk.transparentMesh) {
            chunk.transparentMesh.dispose();
            needsRendering = true;
        }
        if(chunk.permeableMesh) {
            chunk.permeableMesh.dispose();
            needsRendering = true;
        }
    }


    function createVertexData(material, checkCollisions) {
        const maxVertices              = 40000*3;

        const vertexData               = new BABYLON.VertexData();
        vertexData.vertices            = new Float32Array(maxVertices * 3);
        vertexData.orthogonals         = new Float32Array(maxVertices * 3); 
        vertexData.triangles           = new Float32Array(maxVertices );
        vertexData.textures            = new Float32Array(maxVertices * 2);
        vertexData.rectanglesCount     = 0;
        vertexData.material            = material;
        vertexData.checkCollisions     = checkCollisions;

        let verticeIndex = 0;
        let index = 0;
        while(index < vertexData.triangles.length - 6) {
            vertexData.triangles[index++] = verticeIndex;  vertexData.triangles[index++] = verticeIndex+1;  vertexData.triangles[index++] = verticeIndex+2;  
            vertexData.triangles[index++] = verticeIndex;  vertexData.triangles[index++] = verticeIndex+2;  vertexData.triangles[index++] = verticeIndex+3;  
            verticeIndex += 4;
        }
        
        return vertexData;  
    }


    function clearVertexData(vertexData) {
        vertexData.rectanglesCount     = 0;
    }


    function addBlockToVertexData(vertexData, blockData, viewInfo) {
        const x         = BlockData.getX(blockData);
        const y         = BlockData.getY(blockData);
        const z         = BlockData.getZ(blockData);
        
        if(viewInfo.hasBlockSides) {
            const faces = BlockData.getFaces(blockData);
            if( (faces & BlockFaces.Left)   && viewInfo.leftRectangle)   addRectanglesToVertexData(vertexData, x, y, z, viewInfo.leftRectangle);
            if( (faces & BlockFaces.Right)  && viewInfo.rightRectangle)  addRectanglesToVertexData(vertexData, x, y, z, viewInfo.rightRectangle);
            if( (faces & BlockFaces.Back)   && viewInfo.backRectangle)   addRectanglesToVertexData(vertexData, x, y, z, viewInfo.backRectangle);
            if( (faces & BlockFaces.Front)  && viewInfo.frontRectangle)  addRectanglesToVertexData(vertexData, x, y, z, viewInfo.frontRectangle);
            if( (faces & BlockFaces.Bottom) && viewInfo.bottomRectangle) addRectanglesToVertexData(vertexData, x, y, z, viewInfo.bottomRectangle);
            if( (faces & BlockFaces.Top)    && viewInfo.topRectangle)    addRectanglesToVertexData(vertexData, x, y, z, viewInfo.topRectangle);
        }

        if(viewInfo.innerRectangles) {
            addRectanglesToVertexData(vertexData, x, y, z, viewInfo.innerRectangles);        
        }
    }


    function addRectanglesToVertexData(vertexData, x, y, z, rectangleInfo) { 
        let v  = vertexData.rectanglesCount * 4 * 3;
        let n  = vertexData.rectanglesCount * 4 * 3;
        let u  = vertexData.rectanglesCount * 4 * 2;
        
        vertexData.orthogonals.set(rectangleInfo.normals, n);
        vertexData.textures.set(rectangleInfo.texture, u);        
        vertexData.vertices.set(rectangleInfo.points, v);

        const numberOfVertices = rectangleInfo.numberOfRectangles * 4;
        const vertices         = vertexData.vertices;
        for(let i=0; i < numberOfVertices; i++) {
            vertices[v++] +=x;  
            vertices[v++] +=y;  
            vertices[v++] +=z;
        }
        
        vertexData.rectanglesCount += rectangleInfo.numberOfRectangles;
    }


    function createMeshFromVertexData(vertexData, position) {
        if(vertexData.rectanglesCount == 0) return null;
        vertexData.positions = vertexData.vertices.slice(0, vertexData.rectanglesCount * 4 * 3);     // needs to be a real copy for collision detection
        vertexData.normals   = new Float32Array(vertexData.orthogonals.buffer, 0, vertexData.rectanglesCount * 4 * 3); 
        vertexData.indices   = new Float32Array(vertexData.triangles.buffer, 0, vertexData.rectanglesCount * 2 * 3);
        vertexData.uvs       = new Float32Array(vertexData.textures.buffer, 0, vertexData.rectanglesCount * 4 * 2);   

        const mesh           = new BABYLON.Mesh("blockChunk", scene);
        mesh.material        = vertexData.material;
        mesh.checkCollisions = vertexData.checkCollisions;
        mesh.position.x      = position.x;
        mesh.position.y      = position.y;
        mesh.position.z      = position.z;
        vertexData.applyToMesh(mesh);
        mesh.freezeWorldMatrix();        
        return mesh;
    }

    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // actors
    ///////////////////////////////////////////////////////////////////////////////////////////////

    const actorFaceUV = [];
    actorFaceUV[0]                = new BABYLON.Vector4(0, 0, 0, 0);           // bottom
    actorFaceUV[1]                = new BABYLON.Vector4(1, 0, 0, 1);           // side
    actorFaceUV[2]                = new BABYLON.Vector4(0, 0, 0, 0);           // top

    const actorFaceColors = [];
    actorFaceColors[0]            = new BABYLON.Color4(0, 0, 0, 1);            // bottom
    actorFaceColors[1]            = new BABYLON.Color4(1, 1, 1, 1);            // side
    actorFaceColors[2]            = new BABYLON.Color4(0, 0, 0, 1);            // top

    const actorCylinderOptions    = {height:1.6, diameter:0.7, tessellation:12, faceUV: actorFaceUV, faceColors: actorFaceColors};


    this.createActorMesh = function(actor) {
        actorFaceColors[1]        = intToColor(actor.color);                    // individual side color
        
        let mesh = BABYLON.MeshBuilder.CreateCylinder("actor", actorCylinderOptions, scene);
        mesh.material             = actorMaterial;        
        mesh.position.x           = actor.positionX;
        mesh.position.y           = actor.positionY - 0.51;
        mesh.position.z           = actor.positionZ;
        mesh.rotation.y           = actor.rotationY + Math.PI / 2;
        mesh.checkCollisions      = true;
        actor.mesh                = mesh;
        mesh.actor                = actor;
    }


    this.updateActorMesh = function(actor, actorMessage) {
        needsRendering = true;
        actor.mesh.position.x           = actorMessage.positionX;
        actor.mesh.position.y           = actorMessage.positionY - 0.51;
        actor.mesh.position.z           = actorMessage.positionZ;
        actor.mesh.rotation.y           = actorMessage.rotationY + Math.PI / 2;
    }


    this.removeActorMesh = function(actor) {
        needsRendering = true;
        actor.mesh.dispose();
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // varia
    ///////////////////////////////////////////////////////////////////////////////////////////////


    function createSpaceSkybox() {
        let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000}, scene);
        let skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterail", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/resources/skybox/space", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
        return skybox;        
    }

    
    function intToColor(rgbHexColor) {
        const red   = ((rgbHexColor >> 16) & 0xff) / 255;
        const green = ((rgbHexColor >> 8) & 0xff) / 255;
        const blue  = (rgbHexColor & 0xff) / 255;
        return new BABYLON.Color4(red, green, blue, 1);
    }
    

}




