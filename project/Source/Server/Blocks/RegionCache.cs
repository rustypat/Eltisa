namespace Eltisa.Source.Server; 

using System;
using System.Collections.Concurrent;
using Eltisa.Source.Models;
using Eltisa.Source.Tools;

public class RegionCache : IRegionAccess {

    private static readonly ConcurrentDictionary<RegionPoint, Region>   regions = new ConcurrentDictionary<RegionPoint, Region>();
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
        throw new Exception("Not implemented. Calling this method is probably an error");
    }


    /// <summary>
    /// WARNING: this method is not thread save
    /// </summary>
    public void WriteRegions() {
        int storedRegions = 0;
        Log.TraceStart("region persistance");
        foreach(Region region in regions.Values) {
            if(region.HasChanged()) {
                storedRegions++;
                #if DEBUG
                    region.Validate();
                #endif                                                
                regionCreator.WriteRegion(region);
                region.SetUnchanged();
            } 
        }
        Log.TraceEnd("region persisted: " + storedRegions);
    }



}
