namespace Eltisa.Administration; 

using System;
using Eltisa.Models;

public static class Policy {

    public static bool CanEdit(Actor actor, WorldPoint blockPos) {
        if ( actor.ActorType == Actor.Type.Administrator ) return true;
        if ( actor.ActorType == Actor.Type.Citizen       ) return true;
        if ( actor.ActorType == Actor.Type.Visitor       ) return blockPos.X > 0 && blockPos.Z > 0;
        return false;
    }


    public static bool CanAdministrate(Actor actor) {
        return actor.ActorType == Actor.Type.Administrator;
    } 

    
    public static bool CanVideoChat(Actor sender, Actor receiver) {
        if( sender.ActorType   == receiver.ActorType       ) return true;
        if( sender.ActorType   == Actor.Type.Administrator ) return true;
        if( receiver.ActorType == Actor.Type.Administrator ) return true;
        return false;
    } 

    
}