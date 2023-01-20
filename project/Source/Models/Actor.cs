namespace Eltisa.Models; 

using System;
using Eltisa.Communication;
using Eltisa.Server;
using static Eltisa.Administration.Configuration;


public class Actor {

    public enum Type { NoActor = 0, Visitor = 1, Citizen = 2, Administrator = 4}

    public readonly int            ID;
    public readonly HomeSocket     Socket;
    public readonly Type           ActorType;
    public readonly string         Name;
    public readonly string         Password;
    public readonly int            Color;
    public readonly Citizen        Citizen;

    public float PositionX { get; private set; } = -WorldRadius;
    public float PositionY { get; private set; } = -WorldRadiusVertical;
    public float PositionZ { get; private set; } = -WorldRadius;

    public float RotationY { get; private set; }
    

    public Actor(int id, string name, string password, HomeSocket homeSocket, Type actorType, int color, Citizen citizen=null) {
        ID        = id;
        Name      = name;
        Password  = password;
        Socket    = homeSocket;
        ActorType = actorType;
        Color     = color;
        Citizen   = citizen;
    }        


    public bool Move(float x, float y, float z) {
        if(x < -WorldRadius || x >= WorldRadius) return false;
        if(z < -WorldRadius || z >= WorldRadius) return false;
        if(y < -WorldRadiusVertical || y >= WorldRadiusVertical) return false;
        
        WorldPoint newPos    = new WorldPoint(x, y, z);
        // if(RegionStore.HasSolidBlock(newPos)) return false;  TODO consider reactivating check for non admins

        Region     newRegion = World.GetRegion(newPos);
        WorldPoint oldPos    = new WorldPoint(PositionX, PositionY, PositionZ);
        Region     oldRegion = World.GetRegion(oldPos);

        if(newRegion != oldRegion) {
            newRegion?.AddActor(this);
            oldRegion?.RemoveActor(this);
        }

        PositionX = x;
        PositionY = y;
        PositionZ = z;
        return true;
    }    


    public void Turn(float arcOnYAxis) {
        RotationY = arcOnYAxis;
    }


}