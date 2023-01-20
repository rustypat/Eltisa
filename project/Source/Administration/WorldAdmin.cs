namespace Eltisa.Administration; 

using System;
using System.IO;
using Eltisa.Models;
using Eltisa.Server;
using Eltisa.Server.Blocks;
using Eltisa.Tools;
using static System.Diagnostics.Debug;


public static class WorldAdmin {

    public static void CreateSeaPit(int xFrom, int xTo, int zFrom, int zTo, int depth) {
        Log.Info("create sea pit start");
        for(int x=xFrom; x <= xTo; x++) {
            for(int z=zFrom; z <= zTo; z++) {
                for(int y=DefaultWorld.SeaLevel-1; y > DefaultWorld.SeaLevel-1-depth; y--) {
                    World.RemoveVisibleBlock(new WorldPoint(x, y, z));
                }
            }
        }
        Log.Info("create sea pit end");
    }


    public static void CreateCoast(int xFrom, int xTo, int zFrom, int zTo) {
        const int coastWidth       = 200;
        Log.Info("create coast start");
        for(int x=xFrom; x <= xTo; x++) {
            for(int z=zFrom; z > zFrom-coastWidth; z--) {
                int y = DefaultWorld.SeaLevel;
                while(World.HasSolidBlockAt(new WorldPoint(x, y+1, z))) {
                    World.AddBlock(new WorldPoint(x, y, z-1), BlockDescription.Stone);
                    y++;
                }
            }
        }

        for(int z=zFrom-coastWidth; z <= zTo; z++) {
            for(int x=xFrom; x > xFrom-coastWidth; x--) {
                int y = DefaultWorld.SeaLevel;
                while(World.HasSolidBlockAt(new WorldPoint(x, y+1, z))) {
                    World.AddBlock(new WorldPoint(x-1, y, z), BlockDescription.Stone);
                    y++;
                }
            }
        }
        
        for(int x=xFrom-coastWidth; x <= xTo; x++) {
            for(int z=zTo; z <= zTo+coastWidth; z++) {
                int y = DefaultWorld.SeaLevel;
                while(World.HasSolidBlockAt(new WorldPoint(x, y+1, z))) {
                    World.AddBlock(new WorldPoint(x, y, z+1), BlockDescription.Stone);
                    y++;
                }
            }
        }

        for(int z=zFrom-coastWidth; z <= zTo+coastWidth; z++) {
            for(int x=xTo; x <= xTo+coastWidth; x++) {
                int y = DefaultWorld.SeaLevel;
                while(World.HasSolidBlockAt(new WorldPoint(x, y+1, z))) {
                    World.AddBlock(new WorldPoint(x+1, y, z), BlockDescription.Stone);
                    y++;
                }
            }
        }            
        Log.Info("create coast end");
    }


    public static void CreatePlanet(int xCenter, int yCenter, int zCenter, int radius, int radiusInner=0, int radiusCore=0, ushort block=BlockDescription.Stone_2) {
        Log.Info("create planet start");
        int radiusSquare           = radius * radius;
        int innerRadiusSquare      = radiusInner * radiusInner;
        int coreRadiusSquare       = radiusCore * radiusCore;

        var centerPosition = new WorldPoint(xCenter, yCenter, zCenter);
        Block centerBlock = World.AddBlock(centerPosition, BlockDescription.Gem_3);
        for(int x=-radius; x <= radius; x++) {
            for(int y=-radius; y <= radius; y++) {
                for(int z=-radius; z <= radius; z++) {
                    int distanceSquare = x*x + y*y + z*z;
                    if( distanceSquare < radiusSquare && distanceSquare >= innerRadiusSquare) {
                        var pos = new WorldPoint(xCenter + x, yCenter+y, zCenter+z);
                        World.AddBlock(pos, block);
                    }
                    else if ( distanceSquare < radiusCore ) {
                        var pos = new WorldPoint(xCenter + x, yCenter+y, zCenter+z);
                        World.AddBlock(pos, BlockDescription.Goldblock);
                    }
                }
            }
        }
        Log.Info("create planet end");
    }        


    public static void CreateCube(int xFrom, int xTo, int yFrom, int yTo, int zFrom, int zTo, ushort block) {
        Log.Info("create cube start");
        for(int x=xFrom; x <= xTo; x++) {
            for(int y=yTo; y >= yFrom; y--) {
                for(int z=zFrom; z <= zTo; z++) {
                    World.AddBlock(new WorldPoint(x, y, z), block);
                }
            }
        }
        Log.Info("create cube end");
    }


    // Warning: top blocks need to be visible!
    public static void ClearCube(int xFrom, int xTo, int yFrom, int yTo, int zFrom, int zTo) {
        Log.Info("clear cube start");
        for(int x=xFrom; x <= xTo; x++) {
            for(int y=yTo; y >= yFrom; y--) {
                for(int z=zFrom; z <= zTo; z++) {
                    World.RemoveVisibleBlock(new WorldPoint(x, y, z));
                }
            }
        }
        Log.Info("clear cube end");
    }


    public static void ShiftWorld(int xShift, int zShift) {
        Log.Info("shift world start");
        Assert( Configuration.RegionSize * Configuration.ChunkSize == 256);
        if( xShift % 256 != 0) throw new Exception("xShift needs to be a multiple of 256");
        if( zShift % 256 != 0) throw new Exception("zShift needs to be a multiple of 256");

        RegionPoint regionPos;
        WorldPoint  worldPos;
        String      newFullName;
        int x = xShift / 256;
        int y = 0;
        int z = zShift / 256;

        // shift regions
        DirectoryInfo directoryInfo     = new DirectoryInfo(Configuration.RegionDirectory);
        RegionPersister regionPersister = new RegionPersister(Configuration.RegionDirectory);
        FileInfo[] fileInfos            = directoryInfo.GetFiles();
        foreach(FileInfo fileInfo in fileInfos) {
            if( !fileInfo.Name.EndsWith(RegionPersister.FileType) ) continue;
            regionPos    = regionPersister.GetFilePosition(fileInfo.Name);
            regionPos    = regionPos.Add(x, y, z);
            newFullName  = regionPersister.GetFilePath(regionPos) + "n";
            File.Move(fileInfo.FullName, newFullName);
        }        
        fileInfos         = directoryInfo.GetFiles();
        foreach(FileInfo fileInfo in fileInfos) {
            if( !fileInfo.Name.EndsWith(RegionPersister.FileType+"n") ) continue;
            newFullName  = fileInfo.FullName.TrimEnd("n");
            File.Move(fileInfo.FullName, newFullName);
        }        

        // shift resources
        directoryInfo  = new DirectoryInfo(ResourcePersister.GetDirectoryPath());
        if( directoryInfo.Exists ) {
            fileInfos      = directoryInfo.GetFiles();
            foreach(FileInfo fileInfo in fileInfos) {
                if( !fileInfo.Name.EndsWith(ResourcePersister.FileType) ) continue;
                worldPos    = ResourcePersister.GetFilePosition(fileInfo.Name);
                worldPos    = worldPos.Add(xShift, 0, zShift);
                newFullName  = ResourcePersister.GetFilePath(worldPos)+"n";
                File.Move(fileInfo.FullName, newFullName);
            }        
            fileInfos      = directoryInfo.GetFiles();
            foreach(FileInfo fileInfo in fileInfos) {
                if( !fileInfo.Name.EndsWith(ResourcePersister.FileType+"n") ) continue;
                newFullName  = fileInfo.FullName.TrimEnd("n");
                File.Move(fileInfo.FullName, newFullName);
            }        
        }

        Log.Info("shift world end");
    }


    public static void ValidateWorld() {
        Log.Info("validate world start");
        DirectoryInfo directoryInfo     = new DirectoryInfo(Configuration.RegionDirectory);
        RegionPersister regionPersister = new RegionPersister(Configuration.RegionDirectory);
        FileInfo[] fileInfos            = directoryInfo.GetFiles();
        foreach(FileInfo fileInfo in fileInfos) {
            if( !fileInfo.Name.EndsWith(RegionPersister.FileType) ) continue;
            RegionPoint pos  = regionPersister.GetFilePosition(fileInfo.Name);
            Region region    = World.GetRegion(pos);
            region.Validate();
        }                    
        Log.Info("validate world end");
    }


    public static void Store() {
        Log.Info("store world start");
        World.OptimizeLoadedChunks();            
        World.ValidateLoadedChunks();
        World.Persist();
        Log.Info("store world end");
    }
    
    
}

