namespace Eltisa.Server.Blocks; 

using System;
using Eltisa.Models;


public interface IRegionAccess {
    Region ReadRegion(RegionPoint pos);
    void WriteRegion(Region region);
}
