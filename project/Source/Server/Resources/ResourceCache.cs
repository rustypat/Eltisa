namespace Eltisa.Server.Resources; 

using System;
using System.Collections.Concurrent;
using Eltisa.Models;
using Eltisa.Tools;

public class ResourceCache {

    private readonly ConcurrentDictionary<WorldPoint, Resource>  resources            = new();
    private readonly ResourcePersister                           resourcePersister;

    public ResourceCache(ResourcePersister resourcePersister) {
        this.resourcePersister = resourcePersister;        
    }


    public void WriteResource(WorldPoint pos, Resource resource) {
        resource.Modified = true;
        resources[pos] = resource;
    }


    public Resource ReadResource(WorldPoint pos) {
        var resourceIsCached = resources.TryGetValue(pos, out Resource resource);
        if(resourceIsCached) {
            resource?.Touch();
            return resource;
        }
        else {
            resource = resourcePersister.ReadResource(pos);
            resources[pos] = resource;
            return resource;
        }
    }


    public void DeleteResource(WorldPoint position) {
        resources.TryRemove(position, out _);
        resourcePersister.DeleteResource(position);
    } 


    public void PersistResources() {
        Log.Info("store resource changes");
        foreach(var resource in resources) {
            if(resource.Value.Modified) {
                lock(resource.Value) {
                    resourcePersister.WriteResource(resource.Key, resource.Value);
                    resource.Value.Modified = false;
                }
            }
        }
    }


    public void FreeResources(int resourcesToKeep, int unusedSinceMilliseconds) {
        DateTime dueTime = DateTime.Now.AddMilliseconds(-unusedSinceMilliseconds);
        if(resources.Count > resourcesToKeep) {
            foreach(var resource in resources) {
                if( !resource.Value.UsedAfter(dueTime) && !resource.Value.Modified ) {
                    resources.TryRemove(resource.Key, out _);
                } 
            }
        }
    }   

}
