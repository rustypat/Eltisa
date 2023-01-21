namespace Eltisa.Server.Blocks; 

using System;
using Eltisa.Administration;
using Eltisa.Models;
using static Eltisa.Server.Blocks.Constants;


public class BlockPermit : IBlockAccess {

    private readonly IBlockAccess blockAccess;

    public BlockPermit(IBlockAccess blockAccess) {   
        this.blockAccess = blockAccess;     
    }


    public Changed[] CreateBlock(Actor actor, WorldPoint worldPos, ushort blockDescription) {
        if(CanModifyBlock(actor, worldPos)) return blockAccess.CreateBlock(actor, worldPos, blockDescription);
        else                                return NoChanges;
    }


    public Block ReadBlock(Actor actor, WorldPoint worldPos) {
        return blockAccess.ReadBlock(actor, worldPos);
    }


    public Changed[] UpdateBlock(Actor actor, WorldPoint worldPos, ushort newBlockDefinition) {
        if(CanModifyBlock(actor, worldPos)) return blockAccess.UpdateBlock(actor, worldPos, newBlockDefinition);
        else                                return NoChanges;        
    }


    public Changed[] SwitchBlocks(Actor actor, params WorldPoint[] worldPositions) {
        return blockAccess.SwitchBlocks(actor, worldPositions);
    }


    public Changed[] DeleteBlock(Actor actor, WorldPoint worldPos) {
        if(CanModifyBlock(actor, worldPos)) return blockAccess.DeleteBlock(actor, worldPos);
        else                                return NoChanges;                
    }


    public Chunk ReadChunk(Actor actor, WorldPoint worldPos)  {
        return blockAccess.ReadChunk(actor, worldPos);
    }


    private bool CanModifyBlock(Actor actor, WorldPoint blockPos) {
        if( Configuration.Mode == RunMode.Eltisa) {
            if ( actor.ActorType == Actor.Type.Administrator ) return true;
            if ( actor.ActorType == Actor.Type.Citizen       ) return true;
            if ( actor.ActorType == Actor.Type.Visitor       ) return blockPos.X > 0 && blockPos.Z > 0;
            return false;
        }
        else if( Configuration.Mode == RunMode.Server) {
            if ( actor.ActorType == Actor.Type.Administrator ) return true;
            if ( actor.ActorType == Actor.Type.Citizen       ) return true;
            if ( actor.ActorType == Actor.Type.Visitor       ) return false;
            return false;
        }
        else if( Configuration.Mode == RunMode.Develop) {
            if ( actor.ActorType == Actor.Type.Administrator ) return true;
            if ( actor.ActorType == Actor.Type.Citizen       ) return true;
            if ( actor.ActorType == Actor.Type.Visitor       ) return false;
            return false;
        }
        else throw new Exception("unknown runmode");
    }

}


