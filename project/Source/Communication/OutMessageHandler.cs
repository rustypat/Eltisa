namespace Eltisa.Communication; 

using System;
using System.Security.Authentication;
using Eltisa.Models;
using Eltisa.Tools;
using Eltisa.Server;
using Eltisa.Server.Players;
using Eltisa.Administration;
using static System.Diagnostics.Debug;
using static Eltisa.Administration.Configuration;


public static class OutMessageHandler {





    public static void SendMessageToAll(byte[] message) {
        foreach(var actor in ActorStore.GetActors()) {
            actor.Socket.SendMessageAsync(message);
        }
    }
    

    public static void SendMessageToAll(byte[] message, Actor excludeActor ) {
        foreach(var actor in ActorStore.GetActors()) {
            if(actor == excludeActor) continue;
            actor.Socket.SendMessageAsync(message);
        }
    }
    

    public static void SendMessageToRange(byte[] message, WorldPoint pos, int chebishevDistance ) {
        foreach(var actor in ActorStore.GetActors()) {
            if(actor.Position.ChebishevDistanceIsSmallerThan(pos, chebishevDistance)) {
                actor.Socket.SendMessageAsync(message);
            }
        }
    }
    

    public static void SendMessageToRange(byte[] message, WorldPoint pos, int chebishevDistance, Actor excludeActor ) {
        foreach(var actor in ActorStore.GetActors()) {
            if(actor == excludeActor) continue;
            if(actor.Position.ChebishevDistanceIsSmallerThan(pos, chebishevDistance)) {
                actor.Socket.SendMessageAsync(message);
            }
        }
    }
 
}