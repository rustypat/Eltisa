namespace Eltisa.Server.Resources; 

using System;
using Eltisa.Administration;
using Eltisa.Models;
using static Eltisa.Models.ResourceResponse;

public class ResourceControl {

    private readonly ResourceCache resourceCache;

    public ResourceControl(ResourceCache resourceCache) {     
        this.resourceCache = resourceCache;   
    }


    public ResourceResponse CreateResource(Actor actor, WorldPoint pos, ushort blockType, string password, byte[] data) {
        if(!Policy.CanEdit(actor, pos)) return NotAllowed;
        var resource = resourceCache.ReadResource(pos);
        if(resource != null && resource.BlockType == blockType) return ResourceAlreadyExists;
        resource = new Resource(blockType, actor.ID, password, data);
        resourceCache.WriteResource(pos, resource);
        return Ok;
    }


    public ResourceResult ReadResource(Actor actor, WorldPoint pos, ushort blockType, string password) {
        var resource = resourceCache.ReadResource(pos);
        if(resource == null)                return new ResourceResult(ResourceDoesNotExist, null);
        if(resource.BlockType != blockType) return new ResourceResult(ResourceDoesNotExist, null);
        if(resource.Password != password)   return new ResourceResult(PasswordInvalid, null);
        return new ResourceResult(Ok, resource);
    }


    public ResourceResponse WriteResource(Actor actor, WorldPoint pos, ushort blockType, string password, byte[] data) {
        if(!Policy.CanEdit(actor, pos) && blockType != BlockDescription.Book) return NotAllowed;
        var resource = resourceCache.ReadResource(pos);
        if(resource == null)  {
            resource = new Resource(blockType, actor.ID, password, data);
            resourceCache.WriteResource(pos, resource);
            return Ok;
        }   
        else if(resource.BlockType != blockType) {
            resource = new Resource(blockType, actor.ID, password, data);
            resourceCache.WriteResource(pos, resource);
            return Ok;
        } 
        else {
            if(resource.Password != password)  return PasswordInvalid;
            lock(resource) {
                resource.UpdateData(data);
            }
            return Ok;
        }
    }


    public ResourceResponse UpdateResource(Actor actor, WorldPoint pos, int blockType, string password, string newPassword, byte[] newData) {
        if(!Policy.CanEdit(actor, pos)) return NotAllowed;
        var resource = resourceCache.ReadResource(pos);
        if(resource == null)                return ResourceDoesNotExist;
        if(resource.BlockType != blockType) return ResourceDoesNotExist;
        if(resource.Password != password)   return PasswordInvalid;
        lock(resource) {
            resource.UpdatePassword(newPassword);
            resource.UpdateData(newData);
        }
        return Ok;
    }


    public ResourceResponse DeleteResource(Actor actor, WorldPoint pos, int blockType, string password) {
        if(!Policy.CanEdit(actor, pos)) return NotAllowed;
        var resource = resourceCache.ReadResource(pos);
        if(resource == null)                return ResourceDoesNotExist;
        if(resource.BlockType != blockType) return ResourceDoesNotExist;
        if(resource.Password != password)   return PasswordInvalid;
        resourceCache.DeleteResource(pos);
        return Ok;
    }

}
