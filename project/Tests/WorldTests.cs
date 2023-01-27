namespace Eltisa.Server;

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
public class WorldTests {

    Actor actor = new Actor(1, "Tester", "noSecret", null, Actor.Type.Administrator, 1, null);

    [TestMethod]
    public void AddAndRemoveBlock() {
        Computer.DeleteDirectory(".\\regions\\");
        World.Initialize(".\\regions\\", ".\\resources\\");

        var pos = new WorldPoint(17, 32, 19);        
        var changes = World.AddBlock(actor, pos, BlockDescription.Stone);
        Assert.SizeIs(changes, 2);

        changes = World.RemoveVisibleBlock(actor, pos);
        Assert.SizeIs(changes, 2);
    }


    [TestMethod]
    public void AddAndRemoveMultipleBlocks() {
        Computer.DeleteDirectory(".\\regions\\");
        World.Initialize(".\\regions\\", ".\\resources\\");

        var pos1 = new WorldPoint(17, 44, 19);        
        var pos2 = new WorldPoint(17, 45, 19);        
        var changes = World.AddBlock(actor, pos1, BlockDescription.Stone);
        Assert.SizeIs(changes, 1);
        changes = World.AddBlock(actor, pos2, BlockDescription.Stone);
        Assert.SizeIs(changes, 2);

        changes = World.RemoveVisibleBlock(actor, pos2);
        Assert.SizeIs(changes, 2);
        changes = World.RemoveVisibleBlock(actor, pos1);
        Assert.SizeIs(changes, 1);
    }


    [TestMethod]
    public void SubtractiveChunkRemoveBlock() {
        Computer.DeleteDirectory(".\\regions\\");
        World.Initialize(".\\regions\\", ".\\resources\\");

        Change[] changes;
        changes = World.RemoveVisibleBlock(actor, new WorldPoint(-1, 31, 0));
        changes = World.RemoveVisibleBlock(actor, new WorldPoint( 0, 31, 0));
        changes = World.RemoveVisibleBlock(actor, new WorldPoint( 1, 31, 0));

        changes = World.AddBlock(actor, new WorldPoint(0, 31, 0), Stone);

        changes = World.RemoveVisibleBlock(actor, new WorldPoint(-1, 31, 0));
        Assert.AreEqual(changes, NoChanges);
        changes = World.RemoveVisibleBlock(actor, new WorldPoint( 0, 31, 0));
        Assert.SizeIs(changes, 4);
        changes = World.RemoveVisibleBlock(actor, new WorldPoint( 1, 31, 0));
        Assert.AreEqual(changes, NoChanges);
    }


    [TestMethod]
    public void SubtractiveChunkFaceTest() {
        Computer.DeleteDirectory(".\\regions\\");
        World.Initialize(".\\regions\\", ".\\resources\\");
        Change[] changes;

        // create empty pit
        World.RemoveVisibleBlock(actor, new WorldPoint(-1, 31, -1));
        World.RemoveVisibleBlock(actor, new WorldPoint( 0, 31, -1));
        World.RemoveVisibleBlock(actor, new WorldPoint( 1, 31, -1));
        World.RemoveVisibleBlock(actor, new WorldPoint(-1, 31, 0));
        World.RemoveVisibleBlock(actor, new WorldPoint( 0, 31, 0));
        World.RemoveVisibleBlock(actor, new WorldPoint( 1, 31, 0));
        World.RemoveVisibleBlock(actor, new WorldPoint(-1, 31, 1));
        World.RemoveVisibleBlock(actor, new WorldPoint( 0, 31, 1));
        World.RemoveVisibleBlock(actor, new WorldPoint( 1, 31, 1));

        World.RemoveVisibleBlock(actor, new WorldPoint( 0, 30, 0));
        World.AddBlock(actor, new WorldPoint(0, 30, 0), Grass);

        // add block in the center of the pit
        changes = World.AddBlock(actor, new WorldPoint(0, 31, 0), Stone);
        Assert.SizeIs(changes, 2);
        var grassBlock = changes[0].Block;
        var stoneBlock = changes[1].Block;
        Assert.BlockIs(grassBlock, Grass);
        Assert.BlockIs(stoneBlock, Stone);
        Assert.BlockHasFacesNot(grassBlock, Top, Left, Right, Front, Back, Bottom);
        Assert.BlockHasFaces(stoneBlock, Top, Left, Right, Front, Back);

        // remove block again and check surface of block below
        changes = World.RemoveVisibleBlock(actor, new WorldPoint( 0, 31, 0));
        Assert.SizeIs(changes, 2);
        grassBlock = changes[0].Block;
        var airBlock   = changes[1].Block;
        Assert.BlockIs(grassBlock, Grass);
        Assert.BlockIs(airBlock, Air);
        Assert.BlockHasFaces(grassBlock, Top);
        Assert.BlockHasFacesNot(grassBlock, Left, Right, Front, Back, Bottom);
        Assert.BlockHasFacesNot(airBlock, Top, Left, Right, Front, Back, Bottom);
    }

}
