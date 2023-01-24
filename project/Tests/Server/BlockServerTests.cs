namespace Eltisa.Server.Blocks;

using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Eltisa.Models;
using Eltisa.Tools;
using Assert = Eltisa.Tools.Assert;
using static Eltisa.Models.BlockDescription;
using static Eltisa.Models.Block.Faces;
using static Eltisa.Models.Constants;

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
    public void RegionCacheFreeTest() {
        var regionCreator   = new RegionCreator(null);
        var regionCache     = new RegionCache(regionCreator);

        var regionPos       = new RegionPoint(20, 11, 12);
        regionCache.ReadRegion(regionPos);
        Assert.Equals(regionCache.Size(), 1);

        regionCache.FreeUnusedRegions(0, 0);
        Assert.Equals(regionCache.Size(), 0);
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
    public void AddBlockAboveWaterTest() {
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
        Assert.AreEqual(result, new Change[0]);
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
    public void CreateAndDeleteChangeTest() {
        var regionPersister = new RegionPersister(".\\RegionData\\");
        var regionCreator   = new RegionCreator(regionPersister);
        var regionCache     = new RegionCache(regionCreator);
        var blockProvider   = new BlockProvider(regionCache);
        var blockController = new BlockController(blockProvider);
        var blockPermit     = new BlockPermit(blockController);
        var blockNotify     = new BlockNotify(blockPermit);

        var actor   = new Actor(1, "Tester", "noSecret", null, Actor.Type.Administrator, 1, null);
        var pos = new WorldPoint(17, 66, 19);
        
        var changes = blockNotify.CreateBlock(actor, pos, Stone);
        Assert.SizeIs(changes, 1);
        Block block   = changes[0].Block;
        Assert.BlockHasFaces(block, Top, Left, Right, Front, Back, Bottom);
        Assert.BlockIs(block, Stone);
        Assert.BlockPositionIs(block, 1, 2, 3);
        
        changes = blockNotify.DeleteBlock(actor, pos);
        Assert.SizeIs(changes, 1);
        block   = changes[0].Block;
        Assert.BlockHasFacesNot(block, Top, Left, Right, Front, Back, Bottom);
        Assert.BlockIs(block, Air);
        Assert.BlockPositionIs(block, 1, 2, 3);
    }


}
