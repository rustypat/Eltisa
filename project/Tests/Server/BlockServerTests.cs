namespace Eltisa.Server.Blocks;

using System;
using System.Linq;
using Eltisa.Models;
using Assert = Eltisa.Tools.Assert;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using static Eltisa.Models.BlockDescription;
using static Eltisa.Models.Block.Faces;
using static Eltisa.Server.Blocks.Constants;
using System.IO;
using Eltisa.Tools;

[TestClass]
public class BlockServerTests {
    
    [TestMethod]
    public void RegionPersisterTest() {
        Computer.DeleteDirectory(".\\RegionData\\");
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
        Computer.DeleteDirectory(".\\RegionData\\");
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
    public void RegionCacheSameTest() {
        Computer.DeleteDirectory(".\\RegionData\\");
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
    public void RegionCacheWriteTest() {
        Computer.DeleteDirectory(".\\RegionData\\");
        var regionPersister = new RegionPersister(".\\RegionData\\");
        var regionCreator   = new RegionCreator(regionPersister);
        var regionCache     = new RegionCache(regionCreator);

        var regionPos       = new RegionPoint(20, 11, 12);
        var region          = regionCache.ReadRegion(regionPos);
        var regionSecond    = regionCache.ReadRegion(regionPos);
        Assert.AreSame(region, regionSecond);

        regionCache.WriteRegions(true);
        Assert.FiileExistsNot(".\\Regiondata\\20_11_12.rgn");
    }


    [TestMethod]
    public void DefaultWorldTest() {
        var regionCreator   = new RegionCreator(null);
        var blockProvider   = new BlockProvider(regionCreator);

        var block = blockProvider.ReadBlock(new WorldPoint(0, 32, 0));
        Assert.BlockIs(block, Air);

        block = blockProvider.ReadBlock(new WorldPoint(0, 31, 0));
        Assert.BlockIs(block, Water);

        block = blockProvider.ReadBlock(new WorldPoint(0, 0, 0));
        Assert.BlockIs(block, Water);

        block = blockProvider.ReadBlock(new WorldPoint(0, -1, 0));
        Assert.BlockIs(block, Stone);

        block = blockProvider.ReadBlock(new WorldPoint(0, -16368, 0));
        Assert.BlockIs(block, Stone);

        block = blockProvider.ReadBlock(new WorldPoint(0, -16369, 0));
        Assert.BlockIs(block, Lava);

        block = blockProvider.ReadBlock(new WorldPoint(0, -16384, 0));
        Assert.BlockIs(block, Lava);
    }


    [TestMethod]
    public void AddBlockTest() {
        var regionPersister = new RegionPersister(".\\RegionData\\");
        var regionCreator   = new RegionCreator(regionPersister);
        var regionCache     = new RegionCache(regionCreator);
        var blockProvider   = new BlockProvider(regionCache);

        var pos = new WorldPoint(98, 32, 99);
        var changes = blockProvider.CreateBlock(pos, Stone);

        var block = blockProvider.ReadBlock(pos);
        Assert.BlockIs(block, Stone);
        Assert.BlockHasFaces(block, Top, Left, Right, Front, Back);
        Assert.BlockHasFacesNot(block, Bottom);
        Assert.SizeIs(changes, 2);

        var blockBelow = blockProvider.ReadBlock(new WorldPoint(98, 31, 99));
        Assert.BlockHasFacesNot(blockBelow, Top, Left, Right, Front, Back, Bottom);
    }


    [TestMethod]
    public void AddBlockFailingTest() {
        var regionPersister = new RegionPersister(".\\RegionData\\");
        var regionCreator   = new RegionCreator(regionPersister);
        var regionCache     = new RegionCache(regionCreator);
        var blockProvider   = new BlockProvider(regionCache);

        var pos = new WorldPoint(98, 20, 99);
        var result = blockProvider.CreateBlock(pos, Stone);
        Assert.AreEqual(result, new Changed[0]);
    }


    [TestMethod]
    public void RemoveBlockTest() {
        var regionPersister = new RegionPersister(".\\RegionData\\");
        var regionCreator   = new RegionCreator(regionPersister);
        var regionCache     = new RegionCache(regionCreator);
        var blockProvider   = new BlockProvider(regionCache);

        var pos = new WorldPoint(0, 31, 0);
        var changes = blockProvider.DeleteBlock(pos);
        Assert.SizeIs(changes, 6);

        var block = blockProvider.ReadBlock(pos);
        Assert.BlockIs(block, Air);

        block = blockProvider.ReadBlock(new WorldPoint(0, 30, 0));
        Assert.BlockHasFaces(block, Top);
        Assert.BlockHasFacesNot(block, Left, Right, Front, Back, Bottom);

        block = blockProvider.ReadBlock(new WorldPoint(-1, 31, 0));
        Assert.BlockHasFaces(block, Top, Right);
        Assert.BlockHasFacesNot(block, Left, Front, Back, Bottom);

        block = blockProvider.ReadBlock(new WorldPoint(0, 31, -1));
        Assert.BlockHasFaces(block, Top, Front);
        Assert.BlockHasFacesNot(block, Left, Right, Back, Bottom);
    }


    [TestMethod]
    public void RemoveBlockFailingTest() {
        var regionPersister = new RegionPersister(".\\RegionData\\");
        var regionCreator   = new RegionCreator(regionPersister);
        var regionCache     = new RegionCache(regionCreator);
        var blockProvider   = new BlockProvider(regionCache);

        // at 99 there is no block to delete
        var pos = new WorldPoint(0, 99, 0);
        var changes = blockProvider.DeleteBlock(pos);
        Assert.Equals(changes, NoChanges);

        // cannot delete a block, that is not on the visible surface
        pos = new WorldPoint(0, 0, 0);
        changes = blockProvider.DeleteBlock(pos);
        Assert.Equals(changes, NoChanges);
    }


    [TestMethod]
    public void ChangeBlockTest() {
        var regionPersister = new RegionPersister(".\\RegionData\\");
        var regionCreator   = new RegionCreator(regionPersister);
        var regionCache     = new RegionCache(regionCreator);
        var blockProvider   = new BlockProvider(regionCache);

        var pos = new WorldPoint(0, 31, 0);
        var block = blockProvider.ReadBlock(pos);
        Assert.BlockIs(block, Water);

        blockProvider.UpdateBlock(pos, Ice);
        block = blockProvider.ReadBlock(pos);
        Assert.BlockIs(block, Ice);
    }


    [TestMethod]
    public void ChangeBlockTestFailing() {
        var regionPersister = new RegionPersister(".\\RegionData\\");
        var regionCreator   = new RegionCreator(regionPersister);
        var regionCache     = new RegionCache(regionCreator);
        var blockProvider   = new BlockProvider(regionCache);

        var pos = new WorldPoint(0, 31, 0);
        var block = blockProvider.ReadBlock(pos);
        Assert.BlockIs(block, Water);

        blockProvider.UpdateBlock(pos, Flower);
        block = blockProvider.ReadBlock(pos);
        Assert.BlockIs(block, Water);
    }


    [TestMethod]
    public void SwitchTest() {
        var regionCreator   = new RegionCreator(null);
        var regionCache     = new RegionCache(regionCreator);
        var blockProvider   = new BlockProvider(regionCache);
        var blockController = new BlockController(blockProvider);

        var pos = new WorldPoint(0, 99, 0);
        var changes = blockController.CreateBlock(null, pos, Lamp);
        Assert.SizeIs(changes, 1);
        Assert.BlockIs(changes[0].Block, Lamp);

        changes = blockController.SwitchBlocks(null, pos);
        Assert.SizeIs(changes, 1);
        Assert.BlockIs(changes[0].Block, Lamp_On);

        changes = blockController.SwitchBlocks(null, pos);
        Assert.SizeIs(changes, 1);
        Assert.BlockIs(changes[0].Block, Lamp);
    }


    [TestMethod]
    public void SwitchTestFailing() {
        var regionCreator   = new RegionCreator(null);
        var regionCache     = new RegionCache(regionCreator);
        var blockProvider   = new BlockProvider(regionCache);
        var blockController = new BlockController(blockProvider);

        var pos = new WorldPoint(0, 99, 0);
        var changes = blockController.SwitchBlocks(null, pos);
        Assert.Equals(changes, NoChanges);

        pos = new WorldPoint(0, 0, 0);
        changes = blockController.SwitchBlocks(null, pos);
        Assert.Equals(changes, NoChanges);
    }


    [TestMethod]
    public void DevelopTest() {
    }

}
