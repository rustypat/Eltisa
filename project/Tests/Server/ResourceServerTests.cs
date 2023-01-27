namespace Eltisa.Server.Resources;

using System;
using System.Text;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Eltisa.Models;
using Assert = Eltisa.Tools.Assert;
using static Eltisa.Models.BlockDescription;
using static Eltisa.Models.ResourceResultType;
using Eltisa.Tools;

[TestClass]
public class ResourceServerTests {
    
    [TestMethod]
    public void CRUDTest() {
        var resourcePersister = new ResourcePersister(".\\resources\\");
        var resourceCache     = new ResourceCache(resourcePersister);
        var resourceControl   = new ResourceControl(resourceCache);

        var actor   = new Actor(1, "Tester", "noSecret", null, Actor.Type.Administrator, 1, null);
        var pos = new WorldPoint(17, 66, 19);
        Computer.DeleteDirectory(".\\resources\\");

        // create
        var resType = resourceControl.CreateResource(actor, pos, Tresor, "secret", Encoding.UTF8.GetBytes("Hello Resource World"));
        resourceCache.PersistResources();
        Assert.AreEqual(resType, Ok);
        Assert.FiileExists(".\\resources\\17_66_19.rsc");

        // read
        var result = resourceControl.ReadResource(actor, pos, Tresor, "secret");
        Assert.AreEqual(result.Result, ResourceResultType.Ok);
        Assert.AreEqual(Encoding.UTF8.GetString( result.Resource.Data), "Hello Resource World");

        // update
        resType = resourceControl.UpdateResource(actor, pos, Tresor, "secret", "verySecret", Encoding.UTF8.GetBytes("Hello World"));
        Assert.AreEqual(resType, Ok);
        result = resourceControl.ReadResource(actor, pos, Tresor, "verySecret");
        Assert.AreEqual(result.Result, ResourceResultType.Ok);
        Assert.AreEqual(Encoding.UTF8.GetString( result.Resource.Data), "Hello World");

        // delete
        resType = resourceControl.DeleteResource(actor, pos, Tresor, "verySecret");
        Assert.AreEqual(resType, Ok);
        Assert.FiileExistsNot(".\\resources\\17_66_19.rsc");
    }


    [TestMethod]
    public void PasswordTest() {
        var resourcePersister = new ResourcePersister(".\\resources\\");
        var resourceCache     = new ResourceCache(resourcePersister);
        var resourceControl   = new ResourceControl(resourceCache);

        var actor   = new Actor(1, "Tester", "noSecret", null, Actor.Type.Administrator, 1, null);
        var pos = new WorldPoint(17, 66, 19);
        Computer.DeleteDirectory(".\\resources\\");

        // create
        var resType = resourceControl.CreateResource(actor, pos, Tresor, "secret", Encoding.UTF8.GetBytes("Hello World"));
        resourceCache.PersistResources();
        Assert.AreEqual(resType, Ok);
        Assert.FiileExists(".\\resources\\17_66_19.rsc");

        // read with correct password
        var result = resourceControl.ReadResource(actor, pos, Tresor, "secret");
        Assert.AreEqual(result.Result, ResourceResultType.Ok);

        // read with wrong password
        result = resourceControl.ReadResource(actor, pos, Tresor, "wrongPassword");
        Assert.AreEqual(result.Result, ResourceResultType.PasswordInvalid);
        Assert.IsNull(result.Resource);
    }


}