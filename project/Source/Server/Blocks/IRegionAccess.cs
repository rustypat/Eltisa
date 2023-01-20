namespace Eltisa.Source.Server.Blocks; 

using System;
using Eltisa.Source.Models;


public interface IRegionAccess {
    Region ReadRegion(RegionPoint pos);
    void WriteRegion(Region region);
}
