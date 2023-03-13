namespace Eltisa.Server.Resources; 

using System;
using Eltisa.Models;

public class ResourceServer {
    private ResourcePersister resourcePersister;
    private ResourceCache     resourceCache;
    private ResourceControl   resourceControl;

    public ResourceServer(string resourceDirectory) {
        resourcePersister    = new ResourcePersister(resourceDirectory);
        resourceCache        = new ResourceCache(resourcePersister);
        resourceControl      = new ResourceControl(resourceCache);
    }


    public ResourceResponse CreateResource(Actor actor, WorldPoint pos, ushort blockType, string password, byte[] data) {
        return resourceControl.CreateResource(actor, pos, blockType, password, data);
    }

    public ResourceResult ReadResource(Actor actor, WorldPoint pos, ushort blockType, string password) {
        return resourceControl.ReadResource(actor, pos, blockType, password);
    }

    public ResourceResponse WriteResource(Actor actor, WorldPoint pos, ushort blockType, string password, byte[] data) {
        return resourceControl.WriteResource(actor, pos, blockType, password, data);
    }

    public ResourceResponse UpdateResource(Actor actor, WorldPoint pos, ushort blockType, string password, string newPassword, byte[] newData) {
        return resourceControl.UpdateResource(actor, pos, blockType, password, newPassword, newData);
    }

    public ResourceResponse DeleteResource(Actor actor, WorldPoint pos, ushort blockType, string password) {
        return resourceControl.DeleteResource(actor, pos, blockType, password);
    }

    public void     Persist()                                                            => resourceCache.PersistResources();
    public void     FreeCache(int regionsToKeep, int unusedSinceMilliseconds)            => resourceCache.FreeResources(regionsToKeep, unusedSinceMilliseconds);
}

