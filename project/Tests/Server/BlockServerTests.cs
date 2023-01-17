namespace Eltisa.Source.Server;

using System;
using System.Linq;
using Eltisa.Source.Models;
using Assert = Eltisa.Source.Tools.Assert;
using Microsoft.VisualStudio.TestTools.UnitTesting;

[TestClass]
public class BlockServerTests {
    
    [TestMethod]
    public void RegionPersisterTest() {
        var regionPersister = new RegionPersister(".\\RegionData\\");
        var regionPos       = new RegionPoint(10, 11, 12);
        var region          = new Region(regionPos);
        regionPersister.WriteRegion(region);
        var regionLoaded    = regionPersister.ReadRegion(regionPos);        
        Assert.AreEqual(region.Position, regionLoaded.Position);
        Assert.AreEqual(region.GetChunks().Count(), regionLoaded.GetChunks().Count());
        Assert.FiileExists(".\\Regiondata\\10_11_12.rgn");
    }


    [TestMethod]
    public void RegionCreatorTest() {
        var regionCreator   = new RegionCreator(null);

        var regionPos       = new RegionPoint(30, 11, 12);
        var region          = regionCreator.ReadRegion(regionPos);
        var regionSecond    = regionCreator.ReadRegion(regionPos);
        Assert.AreNotSame(region, regionSecond);
        Assert.AreEqual(region, regionSecond);

        regionCreator.WriteRegion(region);
        Assert.FiileExistsNot(".\\Regiondata\\30_11_12.rgn");
    }


    [TestMethod]
    public void RegionCacheTest() {
        var regionPersister = new RegionPersister(".\\RegionData\\");
        var regionCreator   = new RegionCreator(regionPersister);
        var regionCache     = new RegionCache(regionCreator);

        var regionPos       = new RegionPoint(20, 11, 12);
        var region          = regionCache.ReadRegion(regionPos);
        var regionSecond    = regionCache.ReadRegion(regionPos);
        Assert.AreSame(region, regionSecond);

        regionCache.WriteRegions();
        Assert.FiileExistsNot(".\\Regiondata\\20_11_12.rgn");
    }


    [TestMethod]
    public void BlockServerDefaultWorldTest() {
        var regionCreator   = new RegionCreator(null);
        var blockServer     = new BlockServer(regionCreator);

        var block = blockServer.ReadBlock(new WorldPoint(0, 32, 0));
        Assert.AreEqual(block.Definition, BlockDescription.NoBlock);

        block = blockServer.ReadBlock(new WorldPoint(0, 31, 0));
        Assert.AreEqual(block.Definition, BlockDescription.Water);

        block = blockServer.ReadBlock(new WorldPoint(0, 0, 0));
        Assert.AreEqual(block.Definition, BlockDescription.Water);

        block = blockServer.ReadBlock(new WorldPoint(0, 0, 0));
        Assert.AreEqual(block.Definition, BlockDescription.Water);

        block = blockServer.ReadBlock(new WorldPoint(0, -1, 0));
        Assert.AreEqual(block.Definition, BlockDescription.Stone);

        block = blockServer.ReadBlock(new WorldPoint(0, -16368, 0));
        Assert.AreEqual(block.Definition, BlockDescription.Stone);

        block = blockServer.ReadBlock(new WorldPoint(0, -16369, 0));
        Assert.AreEqual(block.Definition, BlockDescription.Lava);

        block = blockServer.ReadBlock(new WorldPoint(0, -16384, 0));
        Assert.AreEqual(block.Definition, BlockDescription.Lava);
    }


    [TestMethod]
    public void DevelopTest() {
    }

}
