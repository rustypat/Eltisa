namespace Eltisa.Models; 

using System;
using System.Collections.Generic;
using Eltisa.Administration;


public class Citizen {
    public string         Name;
    public string         Password;
    public Actor.Type     ActorType;
    public int            Color;

    public Citizen() {}

    public Citizen(string name, string password, Actor.Type actorType, int color) {
        Name        = name;
        Password    = password;
        ActorType   = actorType;
        Color       = color;
    }

}