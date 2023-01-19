namespace Eltisa.Source.Server;

using System;
using System.Linq;
using Eltisa.Source.Models;
using Assert = Eltisa.Source.Tools.Assert;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using static Eltisa.Source.Models.BlockDescription;
using static Eltisa.Source.Models.Block.Faces;

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
        Assert.BlockIs(block, NoBlock);

        block = blockServer.ReadBlock(new WorldPoint(0, 31, 0));
        Assert.BlockIs(block, Water);

        block = blockServer.ReadBlock(new WorldPoint(0, 0, 0));
        Assert.BlockIs(block, Water);

        block = blockServer.ReadBlock(new WorldPoint(0, -1, 0));
        Assert.BlockIs(block, Stone);

        block = blockServer.ReadBlock(new WorldPoint(0, -16368, 0));
        Assert.BlockIs(block, Stone);

        block = blockServer.ReadBlock(new WorldPoint(0, -16369, 0));
        Assert.BlockIs(block, Lava);

        block = blockServer.ReadBlock(new WorldPoint(0, -16384, 0));
        Assert.BlockIs(block, Lava);
    }


    [TestMethod]
    public void AddBlockTest() {
        var regionPersister = new RegionPersister(".\\RegionData\\");
        var regionCreator   = new RegionCreator(regionPersister);
        var regionCache     = new RegionCache(regionCreator);
        var blockServer     = new BlockServer(regionCache);

        var pos = new WorldPoint(98, 32, 99);
        blockServer.CreateBlock(pos, Stone);

        var block = blockServer.ReadBlock(pos);
        Assert.BlockIs(block, Stone);
        Assert.BlockHasFaces(block, Top, Left, Right, Front, Back);
        Assert.BlockHasFacesNot(block, Bottom);

        var blockBelow = blockServer.ReadBlock(new WorldPoint(98, 31, 99));
        Assert.BlockHasFacesNot(blockBelow, Top, Left, Right, Front, Back, Bottom);
    }


    [TestMethod]
    public void RemoveBlockTest() {
        var regionPersister = new RegionPersister(".\\RegionData\\");
        var regionCreator   = new RegionCreator(regionPersister);
        var regionCache     = new RegionCache(regionCreator);
        var blockServer     = new BlockServer(regionCache);

        var pos = new WorldPoint(0, 31, 0);
        blockServer.DeleteBlock(pos);

        var block = blockServer.ReadBlock(new WorldPoint(0, 30, 0));
        Assert.BlockHasFaces(block, Top);
        Assert.BlockHasFacesNot(block, Left, Right, Front, Back, Bottom);

        block = blockServer.ReadBlock(new WorldPoint(-1, 31, 0));
        Assert.BlockHasFaces(block, Top, Right);
        Assert.BlockHasFacesNot(block, Left, Front, Back, Bottom);

        block = blockServer.ReadBlock(new WorldPoint(0, 31, -1));
        Assert.BlockHasFaces(block, Top, Front);
        Assert.BlockHasFacesNot(block, Left, Right, Back, Bottom);
    }


    [TestMethod]
    public void ChangeBlockTest() {
        var regionPersister = new RegionPersister(".\\RegionData\\");
        var regionCreator   = new RegionCreator(regionPersister);
        var regionCache     = new RegionCache(regionCreator);
        var blockServer     = new BlockServer(regionCache);

        var pos = new WorldPoint(0, 31, 0);
        var block = blockServer.ReadBlock(pos);
        Assert.BlockIs(block, Water);

        blockServer.UpdateBlock(pos, Ice);
        block = blockServer.ReadBlock(pos);
        Assert.BlockIs(block, Ice);
    }


    [TestMethod]
    public void ChangeBlockTestFailing() {
        var regionPersister = new RegionPersister(".\\RegionData\\");
        var regionCreator   = new RegionCreator(regionPersister);
        var regionCache     = new RegionCache(regionCreator);
        var blockServer     = new BlockServer(regionCache);

        var pos = new WorldPoint(0, 31, 0);
        var block = blockServer.ReadBlock(pos);
        Assert.BlockIs(block, Water);

        blockServer.UpdateBlock(pos, Lava);
        block = blockServer.ReadBlock(pos);
        Assert.BlockIs(block, Water);
    }


    [TestMethod]
    public void DevelopTest() {
    }

}
