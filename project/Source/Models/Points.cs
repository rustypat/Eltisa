namespace Eltisa.Source.Models; 

using System;
using static System.Diagnostics.Debug;
using static Eltisa.Source.Administration.Configuration;


// coordinates of a block in a chunk
public struct BlockPoint {
    private ushort   data;
    public  ushort   Data { get{ return data;} }

    public int Y   {  get { return (data >> 8)      ; }  }
    public int Z   {  get { return (data >> 4) & 0xF; }  }
    public int X   {  get { return (data     ) & 0xF; }  }

    public static BlockPoint NotAPoint = new BlockPoint() { data = 0xFFFF };


    public BlockPoint(int x, int y, int z) {
        Assert(x >= 0 && x < ChunkSize);
        Assert(y >= 0 && y < ChunkSize);
        Assert(z >= 0 && z < ChunkSize);
        data =  (ushort) ( (y << 8) | (z << 4) | x );
    }


    public BlockPoint(uint x, uint y, uint z) {
        Assert(x >= 0 && x < ChunkSize);
        Assert(y >= 0 && y < ChunkSize);
        Assert(z >= 0 && z < ChunkSize);
        data =  (ushort) ( (y << 8) | (z << 4) | x );
    }


    public BlockPoint(int data)    => this.data = (ushort)data;
    public bool IsNotAPoint()      => data == 0xFFFF;
    override 
    public int GetHashCode()       => data;
    override 
    public string ToString()       => X + "/" + Y + "/" + Z;

    public override bool Equals(object obj)  {
        if (obj is BlockPoint) {
            return data == ((BlockPoint) obj).data;
        }
        else {
            return false;
        }
    }


    public bool IsMostLeft()       =>  X == 0;
    public bool IsMostRight()      =>  X == 15;
    public bool IsMostBack()       =>  Z == 0;
    public bool IsMostFront()      =>  Z == 15;
    public bool IsMostBottom()     =>  Y == 0;
    public bool IsMostTop()        =>  Y == 15;


    public BlockPoint Left() {
        Assert( X > 0);
        return new BlockPoint(data - 1);
    } 

    public BlockPoint Right() {
        Assert( X < 15);
        return new BlockPoint(data + 1);
    }

    public BlockPoint Back() {
        Assert(Z > 0);
        return new BlockPoint(data - 0b10000);
    }

    public BlockPoint Front() {
        Assert( Z < 15);
        return new BlockPoint(data + 0b10000);
    }

    public BlockPoint Bottom() {
        Assert(Y > 0);
        return  new BlockPoint(data - 0b100000000);
    }

    public BlockPoint Top() {
        Assert(Y < 15);
        return new BlockPoint(data + 0b100000000);
    }    

}


// coordinates of a chunk in the region
public struct ChunkPoint {
    private ushort   data;
    public  ushort   Data { get{ return data;} }

    public int Y   {  get { return (data >> 8)      ; }  }
    public int Z   {  get { return (data >> 4) & 0xF; }  }
    public int X   {  get { return (data     ) & 0xF; }  }

    public static ChunkPoint NotAPoint = new ChunkPoint() { data = 0xFFFF };


    public ChunkPoint(int x, int y, int z) {
        Assert(x >= 0 && x < RegionSize);
        Assert(y >= 0 && y < RegionSize);
        Assert(z >= 0 && z < RegionSize);
        data =  (ushort) ( (y << 8) | (z << 4) | x );
    }


    public ChunkPoint(ushort data) => this.data = data;
    public bool IsNotAPoint()      => data == 0xFFFF;
    override 
    public int GetHashCode()       => data;
    override 
    public string ToString()       => X + "/" + Y + "/" + Z;

    public override bool Equals(object obj)  {
        if (obj is ChunkPoint) {
            return data == ((ChunkPoint) obj).data;
        }
        else {
            return false;
        }
    }

}


// coordinates of a region in region coordinates
public struct RegionPoint {
    private int   data;                           // Y: 8bit signed, Z: 12bit signed, X: 12bit signed
    public  int   Data { get{ return data;} }

    public int Y   {  get { return (data      ) >> 24; }  }
    public int Z   {  get { return (data <<  8) >> 20; }  }
    public int X   {  get { return (data << 20) >> 20; }  }
    
    public static RegionPoint NotAPoint = new RegionPoint() { data = int.MinValue };


    public RegionPoint(int x, int y, int z) {
        Assert(x >= -RegionRadius && x < RegionRadius);
        Assert(y >= -RegionRadiusVertical && y < RegionRadiusVertical);
        Assert(z >= -RegionRadius && z < RegionRadius);
        data = (y << 24) | ( (z & 0xFFF) << 12) | (x & 0xFFF);
    }


    public RegionPoint(int data)   => this.data = data;
    public bool IsNotAPoint()      => data == int.MinValue;


    public RegionPoint Add(int x, int y, int z) {
        int newX = X+x;
        int newY = Y+y;
        int newZ = Z+z;
        if( newX <= -RegionRadius || newX >= RegionRadius-1                 ) return NotAPoint;
        if( newY <= -RegionRadiusVertical || newY >= RegionRadiusVertical-1 ) return NotAPoint;
        if( newZ <= -RegionRadius || newZ >= RegionRadius-1                 ) return NotAPoint;
        return new RegionPoint(X+x, Y+y, Z+z);
    }


    public RegionPoint Left() {
        if(X == -RegionRadius) return NotAPoint;
        else return new RegionPoint(X-1, Y, Z);
    }


    public RegionPoint Right() {
        if(X == RegionRadius-1) return NotAPoint;
        else return new RegionPoint(X+1, Y, Z);
    }


    public RegionPoint Back() {
        if(Z == -RegionRadius) return NotAPoint;
        else return new RegionPoint(X, Y, Z-1);
    }


    public RegionPoint Front() {
        if(Z == RegionRadius-1) return NotAPoint;
        else return new RegionPoint(X, Y, Z+1);
    }


    public RegionPoint Bottom() {
        if(Y == -RegionRadiusVertical) return NotAPoint;
        else return new RegionPoint(X, Y-1, Z);
    }


    public RegionPoint Top() {
        if(Y == RegionRadiusVertical-1) return NotAPoint;
        else return new RegionPoint(X, Y+1, Z);
    }  


    override public string ToString() {
        return X + "/" + Y + "/" + Z;
    }              


    override public int GetHashCode() {
        return data;
    }


    public override bool Equals(object obj)  {
        if (obj is RegionPoint) {
            return data == ((RegionPoint) obj).data;
        }
        else {
            return false;
        }
    }

}




// coordinates of a block in the world
public struct WorldPoint {
    public int X   { get; private set; }
    public int Y   { get; private set; }
    public int Z   { get; private set; }

    public static WorldPoint NotAPoint = new WorldPoint() { X=Int32.MaxValue, Y=Int32.MaxValue, Z=Int32.MaxValue};

    public WorldPoint(int x, int y, int z) {
        Assert(x >= -WorldRadius && x < WorldRadius);
        Assert(y >= -WorldRadiusVertical && y < WorldRadiusVertical);
        Assert(z >= -WorldRadius && z < WorldRadius);
        X = x;
        Y = y;
        Z = z;
    }


    public WorldPoint(float x, float y, float z) {
        Assert(x >= -WorldRadius && x < WorldRadius);
        Assert(y >= -WorldRadiusVertical && y < WorldRadiusVertical);
        Assert(z >= -WorldRadius && z < WorldRadius);
        X = (int)Math.Floor(x);
        Y = (int)Math.Floor(y);
        Z = (int)Math.Floor(z);
    }


    public WorldPoint(RegionPoint regionPos, ChunkPoint chunkPos, BlockPoint blockPos) {
        Assert(!regionPos.IsNotAPoint());
        Assert(!chunkPos.IsNotAPoint());
        Assert(!blockPos.IsNotAPoint());
        X = (regionPos.X << 8) + (chunkPos.X << 4) + blockPos.X;
        Y = (regionPos.Y << 8) + (chunkPos.Y << 4) + blockPos.Y;
        Z = (regionPos.Z << 8) + (chunkPos.Z << 4) + blockPos.Z;
    }


    public WorldPoint(RegionPoint regionPos, ChunkPoint chunkPos) {
        Assert(!regionPos.IsNotAPoint());
        Assert(!chunkPos.IsNotAPoint());
        X = (regionPos.X << 8) + (chunkPos.X << 4);
        Y = (regionPos.Y << 8) + (chunkPos.Y << 4);
        Z = (regionPos.Z << 8) + (chunkPos.Z << 4);
    }


    public WorldPoint Add(int x, int y, int z) {
        return new WorldPoint( X+x, Y+y, Z+z);
    }


    public bool IsNotAPoint() {
        return Y==Int32.MaxValue; // && Y==Int32.MaxValue && Z==Int32.MaxValue;
    }


    public BlockPoint GetBlockPoint() {
        if(IsNotAPoint()) return BlockPoint.NotAPoint;
        return new BlockPoint( X & 0xF, Y & 0xF, Z & 0xF);
    }


    public ChunkPoint GetChunkPoint() {
        if(IsNotAPoint()) return ChunkPoint.NotAPoint;
        return new ChunkPoint( X >> 4 & 0xF, Y >> 4 & 0xF, Z >> 4 & 0xF);
    }


    public int GetChunkPointY() {
        return Y >> 4;
    }


    public RegionPoint GetRegionPoint() {
        if(IsNotAPoint()) return RegionPoint.NotAPoint;
        return new RegionPoint( X >> 8, Y >> 8, Z >> 8 );
    }



    public WorldPoint Left() {
        if(X <= -WorldRadius) return NotAPoint;
        else return new WorldPoint(X-1, Y, Z);
    }

    public WorldPoint Right() {
        if(X >= WorldRadius-1) return NotAPoint;
        else return new WorldPoint(X+1, Y, Z);
    }

    public WorldPoint Back() {
        if(Z <= -WorldRadius) return NotAPoint;
        else return new WorldPoint(X, Y, Z-1);
    }

    public WorldPoint Front() {
        if(Z >= WorldRadius-1) return NotAPoint;
        else return new WorldPoint(X, Y, Z+1);
    }

    public WorldPoint Bottom() {
        if(Y <= -WorldRadiusVertical) return NotAPoint;
        else return new WorldPoint(X, Y-1, Z);
    }

    public WorldPoint Top() {
        if(Y >= WorldRadiusVertical-1) return NotAPoint;
        else return new WorldPoint(X, Y+1, Z);
    }

    public int GetChebyshevDistanceTo(WorldPoint point) {
        int divX = Math.Abs(X - point.X);
        int divY = Math.Abs(Y - point.Y);
        int divZ = Math.Abs(Z - point.Z);
        return Math.Max(Math.Max(divX, divY), divX);
    }


    public double GetEuclidDistanceTo(WorldPoint point) {
        int dx = X - point.X;
        int dy = X - point.Y;
        int dz = X - point.Z;
        int sum = dx*dx + dy*dy + dz*dz;
        return Math.Sqrt(sum);
    }


    override public string ToString() {
        return X + "/" + Y + "/" + Z;
    }        
    
}