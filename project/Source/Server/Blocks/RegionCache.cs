namespace Eltisa.Server.Blocks; 

using System;
using System.Collections.Concurrent;
using Eltisa.Models;
using Eltisa.Tools;

public class RegionCache : IRegionAccess {

    private readonly ConcurrentDictionary<RegionPoint, Region>   regions = new ConcurrentDictionary<RegionPoint, Region>();
    private readonly IRegionAccess regionCreator;

    public RegionCache(IRegionAccess regionPersister) {
        this.regionCreator = regionPersister;
    }

    public Region ReadRegion(RegionPoint pos) {
        Region region;
        regions.TryGetValue(pos, out region);
        if(region != null) return region;        
        region = regionCreator.ReadRegion(pos);
        regions[pos] = region;
        return region;
    }


    public void WriteRegion(Region region) {
        lock(region) {
            region.Validate();
            regionCreator.WriteRegion(region);
            region.Changed = false;
        }
    }


    public int WriteRegions(bool validate=false) {
        int storedRegions = 0;
        foreach(Region region in regions.Values) {
            if(region.Changed) {
                lock(region) {
                    storedRegions++;
                    region.OptimizeChunks();
                    if(validate) region.Validate();
                    regionCreator.WriteRegion(region);
                    region.Changed = false;
                }
            } 
        }
        return storedRegions;
    }


    public void FreeRegions(int regionsToKeep, int unusedSinceMilliseconds) {
        DateTime dueTime = DateTime.Now.AddMilliseconds(-unusedSinceMilliseconds);
        Region removedRegion;
        if(regions.Count > regionsToKeep) {
            foreach(Region region in regions.Values) {
                if( !region.UsedAfter(dueTime) && !region.Changed ) {
                    regions.TryRemove(region.Position, out removedRegion);
                } 
            }
        }
    }    


    public int Size() => regions.Count;

}
