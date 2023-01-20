namespace Eltisa.Server; 

using System;
using System.Text;
using System.Collections.Generic;
using System.Collections.Concurrent;
using Eltisa.Models;
using Eltisa.Tools;
using Eltisa.Administration;
using Eltisa.Server.Blocks;
using static System.Diagnostics.Debug;
using static Eltisa.Administration.Configuration;

static public class World {

    private static readonly ConcurrentDictionary<RegionPoint, Region>   regions = new ConcurrentDictionary<RegionPoint, Region>();

    private static readonly PeriodicThread maintenanceThread = new PeriodicThread(RegionStoreTime, () => {
        Persist();
        FreeCache();
    });

    private static readonly Object changeLock = new Object();

    private static readonly RegionPersister regionPersister = new RegionPersister(Configuration.RegionDirectory);
    

    ///////////////////////////////////////////////////////////////////////////////////////////
    // change
    ///////////////////////////////////////////////////////////////////////////////////////////


    public static Block AddBlock(WorldPoint pos, ushort blockInfo) {    
        if(pos.IsNotAPoint())  return BlockDescription.NoBlock;
        Region      region      = GetRegion(pos);
        Chunk       chunk       = region.GetChunk(pos);
        lock(changeLock) {
            region.SetChanged();
            if(chunk == null) {
                chunk = DefaultWorld.CreateChunk(pos);
                region.SetChunk(chunk);
            }
            Block block = chunk.AddBlock(pos, blockInfo);
            return block;
        }
    }


    public static Block RemoveVisibleBlock(WorldPoint pos) {    
        if(pos.IsNotAPoint())  return BlockDescription.NoBlock;
        Region      region      = GetRegion(pos);
        Chunk       chunk       = region.GetChunk(pos);
        lock(changeLock) {
            region.SetChanged();
            if(chunk == null) {
                chunk = DefaultWorld.CreateChunk(pos);
                region.SetChunk(chunk);
            }
            return chunk.RemoveVisibleBlock(pos);
        }
    }


    public static Block ChangeStateOfVisibleBlock(WorldPoint pos, ushort blockInfo) {    
        if(pos.IsNotAPoint())  return BlockDescription.NoBlock;
        Region      region      = GetRegion(pos);
        Chunk       chunk       = region.GetChunk(pos);
        lock(changeLock) {
            region.SetChanged();
            if(chunk == null) {
                chunk = DefaultWorld.CreateChunk(pos);
                region.SetChunk(chunk);
            }
            Block block = chunk.ChangeStateOfVisibleBlock(pos, blockInfo);
            return block;
        }
    }


    public static Block AddFace(WorldPoint pos, Block.Faces face) {
        if(pos.IsNotAPoint())  return BlockDescription.NoBlock;
        Region      region      = GetRegion(pos);
        Chunk       chunk       = region.GetChunk(pos);
        lock(changeLock) {
            if(chunk == null) {
                chunk = DefaultWorld.CreateChunk(pos);
                region.SetChunk(chunk);
                region.SetChanged();
            }
            Block block = chunk.AddFace(pos.GetBlockPoint(), face);
            if( block.IsBlock() ) region.SetChanged();
            return block;
        }
    }


    public static Block RemoveFace(WorldPoint pos, Block.Faces face) {
        if(pos.IsNotAPoint())  return BlockDescription.NoBlock;
        Region      region      = GetRegion(pos);
        Chunk       chunk       = region.GetChunk(pos);
        lock(changeLock) {
            if(chunk == null) {
                chunk = DefaultWorld.CreateChunk(pos);
                region.SetChunk(chunk);
                region.SetChanged();
            }
            Block block = chunk.RemoveFace(pos.GetBlockPoint(), face);
            if( block.IsBlock() ) region.SetChanged();
            return block;
        }
    }


    // WARNING: does not adjust faces of surroundig chunks, 
    // use only for world import, that fills the region again to the full
    public static void ClearChunk(WorldPoint pos) {
        if(pos.IsNotAPoint())  return;
        Region      region      = GetRegion(pos);
        ChunkPoint  chunkPoint  = pos.GetChunkPoint();
        Chunk       chunk       = DefaultWorld.CreateSkyChunk(chunkPoint);
        lock(changeLock) {
            region.SetChanged();
            region.SetChunk(chunk);
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // read 
    ///////////////////////////////////////////////////////////////////////////////////////////


    public static Region GetRegion(WorldPoint worldPos) {
        RegionPoint pos = worldPos.GetRegionPoint();
        return GetRegion(pos);
    }


    public static Region GetRegion(RegionPoint pos) {
        if(pos.IsNotAPoint())  return null;
        
        Region region;
        regions.TryGetValue(pos, out region);
        if(region != null) return region;
        
        Region savedRegion = regionPersister.ReadRegion(pos);
        if(savedRegion != null) {
            regions[pos] = savedRegion;
            return savedRegion;
        }

        Region createdRegion = new Region(pos);
        regions[pos] = createdRegion;
        return createdRegion;
    }


    private static Region GetLoadedRegion(RegionPoint pos) {
        if(pos.IsNotAPoint())  return null;
        
        Region region;
        regions.TryGetValue(pos, out region);
        return region;
    }


    public static IEnumerable<Region> GetLoadedEnvironment(RegionPoint pos) {
        Assert(ClientCacheRadius == 1);

        int xStart = Math.Max(pos.X - 1, -RegionRadius);
        int xEnd   = Math.Min(pos.X + 2,  RegionRadius);
        int yStart = Math.Max(pos.Y - 1, -RegionRadiusVertical);
        int yEnd   = Math.Min(pos.Y + 2,  RegionRadiusVertical);
        int zStart = Math.Max(pos.Z - 1, -RegionRadius);
        int zEnd   = Math.Min(pos.Z + 2,  RegionRadius);
        for(int x=xStart; x < xEnd; x++) {
            for(int y=yStart; y < yEnd; y++) {
                for(int z=zStart; z < zEnd; z++) {
                    RegionPoint p = new RegionPoint(x, y, z);
                    Region region = World.GetLoadedRegion(p);
                    if(region != null) {
                        yield return region;
                    } 
                }
            }
        }
    }


    public static Chunk GetChunk(WorldPoint pos) {
        if(pos.IsNotAPoint())  return null;
        Region region = GetRegion(pos);
        Chunk  chunk  = region.GetChunk(pos);
        return chunk;
    }


    public static Chunk GetChunk(RegionPoint regionPos, ChunkPoint chunkPos) {
        if(regionPos.IsNotAPoint())  return null;
        if(chunkPos.IsNotAPoint())  return null;
        Region region = GetRegion(regionPos);
        Chunk  chunk  = region.GetChunk(chunkPos);
        return chunk;
    }


    public static Block GetBlock(WorldPoint pos) {
        if(pos.IsNotAPoint())  return BlockDescription.NoBlock;
        Region region = GetRegion(pos);
        Chunk  chunk  = region.GetChunk(pos);
        if(chunk != null) return chunk.GetBlock(pos.GetBlockPoint());
        else              return DefaultWorld.GetBlock(pos);
    }


    public static bool HasSolidBlockAt(WorldPoint pos) {  
        if( pos.IsNotAPoint() ) return true;   // the whole world is surrounded by imaginary solid blocks that can't be seen
        Region region = GetRegion(pos);
        Chunk  chunk  = region.GetChunk(pos);
        if(chunk != null) return chunk.HasSolidBlockAt(pos.GetBlockPoint());
        else              return DefaultWorld.HasSolidBlock(pos);
    }


    public static string GetDescription() {
        StringBuilder sb = new StringBuilder();
        sb.AppendLine();
        sb.AppendLine("Regions loaded:   " + regions.Count);
        sb.AppendLine("Regions changed: " + CountChangedRegions());

        #if DEBUG
            foreach(var region in regions.Values) {
                sb.AppendLine("    " + region.ToString());
            }
        #endif
        

        return sb.ToString();
    }


    public static int CountChangedRegions() {
        int count = 0;
        foreach(Region region in regions.Values) {
            if( region.HasChanged() ) count++;
        }
        return count;
    }


    public static int CountLoadedRegions() {
        return regions.Count;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // persist
    ///////////////////////////////////////////////////////////////////////////////////////////


    public static void ValidateLoadedChunks() {
        Log.TraceStart("region validation");
        foreach(Region region in regions.Values) {
            lock(changeLock) {
                region.Validate();
            }
        }
        Log.TraceEnd("region validation");
    }


    public static void OptimizeLoadedChunks() {
        Log.TraceStart("region optimization");
        foreach(Region region in regions.Values) {
            if(region.HasChanged()) {
                lock(changeLock) {
                    region.OptimizeChunks();
                }
            } 
        }
        Log.TraceEnd("region optimization");
    }


    public static int Persist() {
        int storedRegions = 0;
        Log.TraceStart("region persistance");
        foreach(Region region in regions.Values) {
            if(region.HasChanged()) {
                storedRegions++;
                lock(changeLock) {
                    #if DEBUG
                        region.Validate();
                    #endif                                                
                    regionPersister.WriteRegion(region);
                    region.SetUnchanged();
                }
            } 
        }
        Log.TraceEnd("region persisted: " + storedRegions);
        return storedRegions;
    }


    public static void FreeCache() {
        Log.TraceStart("region cache clearance");
        DateTime dueTime = DateTime.Now.AddMilliseconds(-RegionReleaseTime);
        Region removedRegion;
        foreach(Region region in regions.Values) {
            if( region.LastUsedBefore(dueTime) && !region.HasChanged() && !region.HasActors() ) {
                regions.TryRemove(region.Position, out removedRegion);
            } 
        }
        Log.TraceEnd("region cache clearance");
    }        



    public static void StartMaintenanceThread() {
        maintenanceThread.Start();
    }


    public static void StopMaintenanceThread() {
        maintenanceThread.RequestStop();
    }

}