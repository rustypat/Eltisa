namespace Eltisa.Source.Server; 

using System;
using Eltisa.Source.Administration;
using Eltisa.Source.Models;


public class BlockPermit : IBlockAccess {

    private readonly IBlockAccess blockAccess;

    public BlockPermit(IBlockAccess blockAccess) {   
        this.blockAccess = blockAccess;     
    }


    public ChangedBlock[] CreateBlock(Actor actor, WorldPoint worldPos, ushort blockDescription) {
        return blockAccess.CreateBlock(actor, worldPos, blockDescription);
    }


    public Block ReadBlock(Actor actor, WorldPoint worldPos) {
        return blockAccess.ReadBlock(actor, worldPos);
    }


    public ChangedBlock[] UpdateBlock(Actor actor, WorldPoint worldPos, ushort newBlockDefinition) {
        return blockAccess.UpdateBlock(actor, worldPos, newBlockDefinition);
    }


    public ChangedBlock[] SwitchBlocks(Actor actor, params WorldPoint[] worldPositions) {
        return blockAccess.SwitchBlocks(actor, worldPositions);
    }


    public ChangedBlock[] DeleteBlock(Actor actor, WorldPoint worldPos) {
        return blockAccess.DeleteBlock(actor, worldPos);
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


