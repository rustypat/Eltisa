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
using static Eltisa.Models.ResourceResponse;


[TestClass]
public class WorldTests {

    Actor actor = new Actor(1, "Tester", "noSecret", null, Actor.Type.Administrator, 1, null);



    [TestInitialize]
    public void TestInitialize() {
        Computer.DeleteDirectory(".\\regions\\");
        Computer.DeleteDirectory(".\\resources\\");
        World.Initialize(".\\regions\\", ".\\resources\\");
    }


    [TestCleanup]
    public void TestCleanup() {
        Computer.DeleteDirectory(".\\regions\\");
        Computer.DeleteDirectory(".\\resources\\");
    }


    [TestMethod]
    public void AddAndRemoveBlock() {
        var pos = new WorldPoint(17, 32, 19);        
        var changes = World.AddBlock(actor, pos, BlockDescription.Stone);
        Assert.SizeIs(changes, 2);
        Assert.PositionIs(changes[0].Position, 17, 31, 19);
        Assert.BlockHasFacesNot(changes[0].Block, Top, Left, Right, Front, Back, Bottom);
        Assert.PositionIs(changes[1].Position, 17, 32, 19);
        Assert.BlockHasFaces(changes[1].Block, Top, Left, Right, Front, Back);
        Assert.BlockHasFacesNot(changes[1].Block, Bottom);

        changes = World.RemoveVisibleBlock(actor, pos);
        Assert.SizeIs(changes, 2);
    }


    [TestMethod]
    public void AddAndRemoveMultipleBlocks() {
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


    [TestMethod]
    public void WriteResource() {
        var actor   = new Actor(1, "Tester", "noSecret", null, Actor.Type.Administrator, 1, null);
        var pos     = new WorldPoint(18, 66, 19);
        var data1   = new byte[] { 1, 2, 3 };
        var data2   = new byte[] { 4, 5, 6 };

        var result = World.WriteResource(actor, pos, Stone, "", data1);
        Assert.AreEqual(result, Ok);

        var response = World.ReadResource(actor, pos, Stone, "");
        Assert.AreEqual(response.Resource.Data, data1);

        result = World.WriteResource(actor, pos, Stone, "", data2);
        Assert.AreEqual(result, Ok);

        response = World.ReadResource(actor, pos, Stone, "");
        Assert.AreEqual(response.Response, Ok);
        Assert.AreEqual(response.Resource.Data, data2);

        result = World.WriteResource(actor, pos, Grass, "Abrakadabra", data1);
        Assert.AreEqual(result, Ok);

        response = World.ReadResource(actor, pos, Stone, "");
        Assert.AreEqual(response.Response, ResourceDoesNotExist);
        Assert.AreEqual(response.Resource, null);

        response = World.ReadResource(actor, pos, Grass, "");
        Assert.AreEqual(response.Response, PasswordInvalid);
        Assert.AreEqual(response.Resource, null);

        response = World.ReadResource(actor, pos, Grass, "Abrakadabra");
        Assert.AreEqual(response.Response, Ok);
        Assert.AreEqual(response.Resource.Data, data1);

        result = World.WriteResource(actor, pos, Grass, "Idontknow", data2);
        Assert.AreEqual(result, PasswordInvalid);

        response = World.ReadResource(actor, pos, Grass, "Abrakadabra");
        Assert.AreEqual(response.Response, Ok);
        Assert.AreEqual(response.Resource.Data, data1);

        result = World.WriteResource(actor, pos, Grass, "Abrakadabra", data2);
        Assert.AreEqual(result, Ok);

        response = World.ReadResource(actor, pos, Grass, "Abrakadabra");
        Assert.AreEqual(response.Response, Ok);
        Assert.AreEqual(response.Resource.Data, data2);
    }

}
