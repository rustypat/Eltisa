namespace Eltisa.Server.Blocks; 

using System;
using Eltisa.Models;


public class RegionCreator : IRegionAccess {

    private readonly IRegionAccess regionPersister;

    public RegionCreator(IRegionAccess regionPersister) {
        this.regionPersister = regionPersister;
    }

    public Region ReadRegion(RegionPoint pos) {
        Region savedRegion = regionPersister?.ReadRegion(pos);
        if(savedRegion != null) return savedRegion;     
        else                    return new Region(pos);
    }


    public void WriteRegion(Region region) {
        regionPersister?.WriteRegion(region);
    }
}
