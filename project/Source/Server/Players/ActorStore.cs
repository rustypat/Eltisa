namespace Eltisa.Server.Players; 

using System;
using System.Text;
using System.Collections.Generic;
using System.Collections.Concurrent;
using static System.String;
using Eltisa.Models;
using Eltisa.Communication;
using Eltisa.Administration;
using static Eltisa.Tools.StringExtensions;


public static class ActorStore {

    private static readonly ConcurrentDictionary<string, Actor>   actors         = new ConcurrentDictionary<string, Actor>();

    static private int actorId          = 0;

    static private Object lockObject    = new Object();


    ///////////////////////////////////////////////////////////////////////////////////////////
    // Actor methods
    ///////////////////////////////////////////////////////////////////////////////////////////


    public static (Actor, string) CreateActor(string name, string password, HomeSocket homeSocket) {
        
        if(IsNullOrEmpty(password)) {
            // to many connections
            if(actors.Count > Configuration.MaxVisitors) return (null, "to many visitors");

            actorId++;
            // empty name
            name = name.LimitLength(20);                
            if(IsNullOrEmpty(name) ) {
                name = "visitor" + actorId;
            }
            // name allready in use
            else if(ActorStore.GetActor(name) != null) {
                name = name + actorId;
            }
            // name is same as a citizen name
            else if(CitizenStore.GetCitizen(name) != null) {
                name = name + actorId;
            }

            Actor actor = new Actor(actorId, name, password, homeSocket, Actor.Type.Visitor, 0xaaaaaa);
            actors[name] = actor;
            return (actor, "login ok");
        }
        else {
            Actor connectedActor = ActorStore.GetActor(name, password);
            if(connectedActor != null ) return (null, name + " is already logged in");
            if(IsNullOrEmpty(name))          return (null, "name missing");
            Citizen citizen = CitizenStore.GetCitizen(name);
            if(citizen == null)              return (null, "unknown citizen");
            if(password != citizen.Password) return (null, "wrong password");
            if(actors.ContainsKey(name))     return (null, "citizen already logged in");

            Actor actor = new Actor(++actorId, name, password, homeSocket, citizen.ActorType, citizen.Color, citizen);
            actors[name] = actor;
            return (actor, "login ok");
        }
    }

    
    public static void RemoveActor(Actor actor) {
        actors.TryRemove(actor.Name, out _);
    }   


    public static Actor GetActor(string name) {
        if(!name.IsDefined()) return null;
        Actor actor;
        actors.TryGetValue(name, out actor);   
        return actor;         
        
    }


    public static Actor GetActor(string name, string password) {
        Actor actor;
        actors.TryGetValue(name, out actor);   

        if(actor != null && actor.Password == password) {
            return actor;
        }
        else {
            return null;
        }
    }


    public static (IEnumerable<Actor>, int)  GetActorsAndCount() {
        lock(lockObject) {
            return (actors.Values, actors.Count);
        }
    }


    public static IEnumerable<Actor>  GetActors() {
        return actors.Values;
    }


    public static string GetDescription() {
        StringBuilder sb = new StringBuilder();
        sb.AppendLine();
        sb.AppendLine("Actors connected: " + actors.Count);

        foreach(var actor in actors.Values) {
            string position = Math.Floor(actor.PositionX) + "/" + Math.Floor(actor.PositionY) + "/" + Math.Floor(actor.PositionZ);
            sb.AppendLine("      " + actor.ID + "  " + actor.Name + "  " + actor.ActorType + "  " + position);
        }

        return sb.ToString();
    }
    
}