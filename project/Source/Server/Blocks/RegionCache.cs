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
            region.SetUnchanged();
        }
    }


    public void WriteRegions(bool validate=false) {
        int storedRegions = 0;
        Log.TraceStart("region persistance");
        foreach(Region region in regions.Values) {
            if(region.HasChanged()) {
                lock(region) {
                    storedRegions++;
                    region.OptimizeChunks();
                    if(validate) region.Validate();
                    regionCreator.WriteRegion(region);
                    region.SetUnchanged();
                }
            } 
        }
        Log.TraceEnd("region persisted: " + storedRegions);
    }

}