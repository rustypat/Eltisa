namespace Eltisa.Import; 

using System;
using System.IO;
using System.IO.Compression;
using System.Text;
using Eltisa.Models;
using Eltisa.Server;
using Eltisa.Tools;
using static System.Diagnostics.Debug;
using static Eltisa.Tools.Tools;
using static Eltisa.Models.BlockDescription;
using static Eltisa.Models.Block;
using static Eltisa.Models.Block.Faces;


/// <summary>
/// represents a Mindcraft data file chunk of data
/// </summary>
class ChunkData {
    public int x, z;
    public byte[][] blocks = new byte[16][];
    public byte[][] states = new byte[16][];
    public int sectionHeight;
    public byte[] sectionBlocks;
    public byte[] sectionStates;
}


/// <summary>
/// Imports a part of a Mindcraft World into Eltisa
/// </summary>
public class McImporter {
    private readonly Actor actor = new Actor(1, "Importer", "notImportand", null, Actor.Type.Administrator, 1);

    string sourceDirectory;

    int xFrom       = int.MinValue;
    int xTo         = int.MaxValue;
    int zFrom       = int.MinValue;
    int zTo         = int.MaxValue;

    int shiftX      = 0;
    int shiftY      = 0;
    int shiftZ      = 0;

    bool mirrorX    = false;
    bool mirrorZ    = true; 


    ///////////////////////////////////////////////////////////////////////////////////////////
    // configure import
    ///////////////////////////////////////////////////////////////////////////////////////////

    public McImporter(string sourceDirectory) {
        this.sourceDirectory = sourceDirectory;
    }


    public void Borders(int xFrom, int xTo, int zFrom, int zTo) {
        this.xFrom = xFrom;
        this.xTo   = xTo;
        this.zFrom = zFrom;
        this.zTo   = zTo;
    }


    public void Shift(int x, int y, int z) {
        this.shiftX          = x;
        this.shiftY          = y;
        this.shiftZ          = z;
    }


    public void MirrorInXDirection() {
        if(xFrom == int.MinValue || xTo == int.MaxValue) {
            Log.Error("Can't mirror because borders are not defined");
        }
        else {
            mirrorX = true;
        }
    }


    public void MirrorInZDirection() {
        if(zFrom == int.MinValue || zTo == int.MaxValue) {
            Log.Error("Can't mirror because borders are not defined");
        }
        else {
            mirrorZ = false;
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // import from mc
    ///////////////////////////////////////////////////////////////////////////////////////////

    public void ImportMcMap() {            
        string[] regionFiles = Directory.GetFiles(sourceDirectory, "*.mca");
        foreach(string regionFile in regionFiles) {   
            foreach(long chunkPos in ReadChunkPositions(regionFile)) {
                if(chunkPos > 0) {
                    ChunkData chunkData = new ChunkData();
                    ReadChunk(regionFile, chunkPos, chunkData);
                    WriteChunk(chunkData);
                }
            }
        }
        Log.Info("import mc map end");
    }


    void WriteChunk(ChunkData chunkData) {
        for( int section=0; section < 16; section++ ) {
            if(chunkData.blocks[section]==null) continue;

            for( int i=0; i<4096; i++ ) {
                WorldPoint pos = ToWorldPoint(chunkData.x, section, chunkData.z, i);
                if( pos.IsNotAPoint()) continue;

                byte mcBlock = chunkData.blocks[section][i];
                byte mcState = chunkData.states[section][i];
                ushort block  = McMapper.ToEltisaBlock(mcBlock, mcState);
                if(block == BlockDescription.Air) continue;
                
                if( IsWaterlilyBlock(block) || IsCarpet(mcBlock) ) {
                    WorldPoint lowerPos = pos.Bottom();
                    World.RemoveVisibleBlock(actor, lowerPos);
                    World.AddBlock(actor, lowerPos, block);
                }
                else  {
                    World.AddBlock(actor, pos, block);
                }                    
            }
        }
    }


    bool IsWaterlilyBlock(ushort block) => block == Waterlily;
    bool IsCarpet(byte mcBlock)         => mcBlock == 171;


    WorldPoint ToWorldPoint(int chunkX, int section, int chunkZ, int i) {
        int y = section * 16 + ((i >> 8) & 0xF) + 1;
        int z = chunkZ * 16 + ((i >> 4) & 0xF);
        int x = chunkX * 16 + (i & 0xF);
        if(x >= xFrom && x <= xTo && z >= zFrom && z <= zTo) {
            return GetWorldPoint(x, y, z);
        }
        else {
            return WorldPoint.NotAPoint;
        }
    }


    WorldPoint GetWorldPoint(int mcx, int mcy, int mcz) {
        int x;
        int y;
        int z;
        if(mirrorX) { x = xTo - (mcx-xFrom) + shiftX; }
        else        { x = mcx + shiftX;                 }

        y = mcy + shiftY;

        if(mirrorZ) { z = zTo - (mcz-zFrom) + shiftZ; }
        else        { z = mcz + shiftZ;                 }

        return new WorldPoint(x, y, z);
    }


    static long[] ReadChunkPositions(string fileName) {
        long[] chunkPositions = new long[1024];

        FileStream stream = File.OpenRead(fileName);
        BinaryReader reader = new BinaryReader(stream);

        for(int i=0; i < 1024; i++) {
            int a = reader.ReadByte();
            int b = reader.ReadByte();
            int c = reader.ReadByte();
            int d = reader.ReadByte();

            long chunkPos = ( (a<<16) + (b<<8) + c ) * 4096L;      
            chunkPositions[i]  = chunkPos;
        }

        return chunkPositions;
    }


    static void ReadChunk(string fileName, long pos, ChunkData chunkData) {
        FileStream stream = File.OpenRead(fileName);
        stream.Seek(pos, 0);
        BinaryReader reader = new BinaryReader(stream);
        int a = reader.ReadByte();
        int b = reader.ReadByte();
        int c = reader.ReadByte();
        int d = reader.ReadByte();
        long chunkLength = (a<<24) + (b<<16) + (c<<8) + d;  
            
        int compressionType = reader.ReadByte();
        Assert(compressionType == 2);  
        int zlibHeaderA = reader.ReadByte();
        int zlibHeaderB = reader.ReadByte();
        reader.Close();
        stream.Close();

        FileStream regionStream = File.OpenRead(fileName);
        regionStream.Seek(pos+7, 0);
        DeflateStream chunkStream = new DeflateStream(regionStream, CompressionMode.Decompress);
        BinaryReader  chunkReader = new BinaryReader(chunkStream, Encoding.UTF8);

        int tagId;
        string tagName;
        ReadTag(chunkReader, out tagId, out tagName);
        ReadTagPayload(chunkReader, tagId, tagName, chunkData);
    }


    static void ReadTag(BinaryReader reader, out int tagId, out string tagName) {
        tagId       = reader.ReadByte();
        tagName     = "Root";

        if(tagId == 0) return;

        int tagNameLength  = ReadShort(reader);
        if(tagNameLength > 0) {
            tagName  = new String(reader.ReadChars(tagNameLength));
        }

        return;
    }


    static void ReadTagPayload(BinaryReader reader, int tagId, string tagName, ChunkData chunkData) {
        if(tagId == 1) {
            int value = reader.ReadByte();
            if("Y".Equals(tagName)) {
                chunkData.sectionHeight = value;
            }
        }
        else if(tagId == 2) {
            reader.ReadByte();
            reader.ReadByte();
        }
        else if(tagId == 3) {
            byte a = reader.ReadByte();
            byte b = reader.ReadByte();
            byte c = reader.ReadByte();
            byte d = reader.ReadByte();
            int value = (a << 24) | (b << 16) | (c << 8) | d;
            if("xPos".Equals(tagName)) {
                chunkData.x = value;                   
            }
            if("zPos".Equals(tagName)) {
                chunkData.z = value;                   
            }
        }
        else if(tagId == 4) {
            reader.ReadByte();
            reader.ReadByte();
            reader.ReadByte();
            reader.ReadByte();
            reader.ReadByte();
            reader.ReadByte();
            reader.ReadByte();
            reader.ReadByte();
        }
        else if(tagId == 5) {
            reader.ReadByte();
            reader.ReadByte();
            reader.ReadByte();
            reader.ReadByte();
        }
        else if(tagId == 6) {
            reader.ReadByte();
            reader.ReadByte();
            reader.ReadByte();
            reader.ReadByte();
            reader.ReadByte();
            reader.ReadByte();
            reader.ReadByte();
            reader.ReadByte();
        }
        else if(tagId == 7) {  // byte array
            int listSize  = ReadInt(reader);
            for(int i=0; i < listSize; i++) {
                byte value = reader.ReadByte();
                if("Blocks".Equals(tagName)) {
                    chunkData.sectionBlocks[i] = value;
                }
                if("Data".Equals(tagName)) {
                    chunkData.sectionStates[i*2+1] = (byte)((value>>4) & 0x0F);
                    chunkData.sectionStates[i*2]   = (byte)((value   ) & 0x0F);
                }
            }
        }
        else if(tagId == 8) {
            int  size  = ReadShort(reader);
            string str = new String(reader.ReadChars(size));
        }
        else if(tagId == 9) {
            int listTagId = reader.ReadByte();
            int listSize  = ReadInt(reader);
            for(int i=0; i < listSize; i++) {
                if("Sections".Equals(tagName)) {
                    chunkData.sectionHeight = -1;
                    chunkData.sectionBlocks = new byte[4096];
                    chunkData.sectionStates  = new byte[4096];
                    ReadTagPayload(reader, listTagId, "List", chunkData);
                    if(chunkData.sectionHeight >= 0) {
                        chunkData.blocks[chunkData.sectionHeight] = chunkData.sectionBlocks;
                        chunkData.states[chunkData.sectionHeight] = chunkData.sectionStates;
                    }
                }
                else {
                    ReadTagPayload(reader, listTagId, "List", chunkData);
                }
            }
        }
        else if(tagId == 10) {
            int tag;
            string name;
            ReadTag(reader, out tag, out name);
            while(tag != 0) {
                ReadTagPayload(reader, tag, name, chunkData);
                ReadTag(reader, out tag, out name);
            }
        }
        else if(tagId == 11) {
            int size =  ReadInt(reader);
            for(int i=0; i < size; i++) {
                int value =  ReadInt(reader);
            }
        }
        else if(tagId == 12) {
            throw new Exception("not implemented");
        }

    }


    static int ReadShort(BinaryReader reader) {
        return (reader.ReadByte() << 8) + reader.ReadByte();
    }


    static int ReadInt(BinaryReader reader) {
        return (reader.ReadByte() << 24) + (reader.ReadByte() << 16) + (reader.ReadByte() << 8) + reader.ReadByte();
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // addjust block states
    ///////////////////////////////////////////////////////////////////////////////////////////

    public void AdjustBlocks() {
        Log.Info("adjust directional elements start");
        for(int x=xFrom+shiftX; x <= xTo+shiftX; x++) {
            for(int y=0+shiftY; y <= 255+shiftY; y++) {
                for(int z=zFrom+shiftZ; z <= zTo+shiftZ; z++) {
                    WorldPoint pos = new WorldPoint(x, y, z);
                    Block block    = World.GetBlock(actor, pos);        
                    ushort adjustedBlock = GetAdjustedBlock(block, pos);      
                    if( block.BlockType.IsOneOf(MC_TrapDoor1_Lower_Left, MC_TrapDoor2_Lower_Left)) {
                        World.RemoveVisibleBlock(actor, pos);
                        World.AddBlock(actor, pos.Bottom(), adjustedBlock);
                    }
                    else if( block.BlockType == Fence_BackFront ) {
                        World.RemoveVisibleBlock(actor, pos);
                        World.AddBlock(actor, pos, adjustedBlock);
                    }
                    else if( block.BlockType == MC_UpperDoor_RightAttached ) {
                        World.RemoveVisibleBlock(actor, pos);
                        if( adjustedBlock != Air ) World.ChangeStateOfVisibleBlock(actor, pos.Bottom(), adjustedBlock);
                    }
                    else if( adjustedBlock != Air ) {
                        World.ChangeStateOfVisibleBlock(actor, pos, adjustedBlock);
                    }
                }
            }
        }
        Log.Info("adjust directional elements end");
    }


    ushort GetAdjustedBlock(Block block, WorldPoint pos) {
        if( block.Definition == MC_UpperDoor_RightAttached ) {
            Block door = World.GetBlock(actor, pos.Bottom());
            return (ushort)(door.Definition + 4);
        }
        if( block.BlockType == Fence_BackFront ) {
            Block.Faces solidNeighbours = GetSolidHorizontalNeighbours(pos, Fence_BackFront, Fence_Special_NoLeft);
            switch(solidNeighbours) {
                case NoFaces:                        return Fence_Pole;
                case Right:                          return Fence_Special_Right;
                case Left:                           return Fence_Special_Left;
                case Back:                           return Fence_Special_Back;
                case Front:                          return Fence_Special_Front;
                case (Back  | Front):                return Fence_BackFront;
                case (Left  | Right):                return Fence_LeftRight;
                case (Left  | Back):                 return Fence_LeftBack;
                case (Back  | Right):                return Fence_BackRight;
                case (Right | Front):                return Fence_RightFront;
                case (Front | Left):                 return Fence_FrontLeft;
                case (Back | Right | Front):         return Fence_Special_NoLeft;
                case (Left | Right | Front):         return Fence_Special_NoBack;
                case (Left | Back | Front):          return Fence_Special_NoRight;
                case (Left | Back | Right):          return Fence_Special_NoFront;                    
                case (Left | Back | Right | Front):  return Fence_Cross;
                default :  throw new Exception("invalid block " + block.Definition);
            }
        }
        if( block.BlockType == Glass_BackFront ) {
            Block.Faces solidNeighbours = GetSolidHorizontalNeighbours(pos, Glass_BackFront);
            switch(solidNeighbours) {
                case NoFaces:       return Glass_BackFront;
                case Right:         return Glass_LeftRight;
                case Left:          return Glass_LeftRight;
                case Back:          return Glass_BackFront;
                case Front:         return Glass_BackFront;
                case Back  | Front: return Glass_BackFront;
                case Left  | Right: return Glass_LeftRight;
                case Left  | Back:  return Glass_LeftBack;
                case Back  | Right: return Glass_BackRight;
                case Right | Front: return Glass_RightFront;
                case Front | Left:  return Glass_FrontLeft;
                default :  return Glass_Cross;
            }
        }
        if( block.BlockType == Bars_BackFront ) {
            Block.Faces solidNeighbours = GetSolidHorizontalNeighbours(pos, Bars_BackFront);
            switch(solidNeighbours) {
                case Right:         return Bars_LeftRight;
                case Left:          return Bars_LeftRight;
                case Back:          return Bars_BackFront;
                case Front:         return Bars_BackFront;
                case Back  | Front: return Bars_BackFront;
                case Left  | Right: return Bars_LeftRight;
                case Left  | Back:  return Bars_LeftBack;
                case Back  | Right: return Bars_BackRight;
                case Right | Front: return Bars_RightFront;
                case Front | Left:  return Bars_FrontLeft;
                default :  return Bars_Cross;
            }
        }
        if( block.BlockType == Panel_BackFront ) {
            Block.Faces solidNeighbours = GetSolidHorizontalNeighbours(pos, Panel_BackFront);
            switch(solidNeighbours) {
                case NoFaces:       return Panel_BackFront;
                case Right:         return Panel_LeftRight;
                case Left:          return Panel_LeftRight;
                case Back:          return Panel_BackFront;
                case Front:         return Panel_BackFront;
                case Back  | Front: return Panel_BackFront;
                case Left  | Right: return Panel_LeftRight;
                case Left  | Back:  return Panel_LeftBack;
                case Back  | Right: return Panel_BackRight;
                case Right | Front: return Panel_RightFront;
                case Front | Left:  return Panel_FrontLeft;
                default :  return Panel_Cross;
            }
        }
        if( block.BlockType == MC_TrapDoor2_Lower_Left ) {
            switch(block.Definition) {
                case MC_TrapDoor2_Lower_Left:       return TrapDoor2_Left;
                case MC_TrapDoor2_Lower_Back:       return TrapDoor2_Back;
                case MC_TrapDoor2_Lower_Right:      return TrapDoor2_Right;
                case MC_TrapDoor2_Lower_Front:      return TrapDoor2_Front;
                case MC_TrapDoor2_Lower_LeftOpen:   return TrapDoor2_LeftOpen;
                case MC_TrapDoor2_Lower_BackOpen:   return TrapDoor2_BackOpen;
                case MC_TrapDoor2_Lower_RightOpen:  return TrapDoor2_RightOpen;
                case MC_TrapDoor2_Lower_FrontOpen:  return TrapDoor2_FrontOpen;
                default :  throw new Exception("invalid block " + block.Definition);
            }
        }
        if( block.BlockType == MC_TrapDoor1_Lower_Left ) {
            switch(block.Definition) {
                case MC_TrapDoor1_Lower_Left:       return TrapDoor1_Left;
                case MC_TrapDoor1_Lower_Back:       return TrapDoor1_Back;
                case MC_TrapDoor1_Lower_Right:      return TrapDoor1_Right;
                case MC_TrapDoor1_Lower_Front:      return TrapDoor1_Front;
                case MC_TrapDoor1_Lower_LeftOpen:   return TrapDoor1_LeftOpen;
                case MC_TrapDoor1_Lower_BackOpen:   return TrapDoor1_BackOpen;
                case MC_TrapDoor1_Lower_RightOpen:  return TrapDoor1_RightOpen;
                case MC_TrapDoor1_Lower_FrontOpen:  return TrapDoor1_FrontOpen;
                default :  throw new Exception("invalid block " + block.Definition);
            }
        }
        return Air;
    }


    Faces GetSolidHorizontalNeighbours(WorldPoint pos, params ushort[] blockTypes) {
        Faces neighbours = NoFaces;

        Block neighbour;
        neighbour = World.GetBlock(actor, pos.Left() );
        if( neighbour.IsSolid() || neighbour.BlockType.IsOneOf(blockTypes) ) neighbours |= Left;
        neighbour = World.GetBlock(actor, pos.Right() );
        if( neighbour.IsSolid() || neighbour.BlockType.IsOneOf(blockTypes) ) neighbours |= Right;
        neighbour = World.GetBlock(actor, pos.Back() );
        if( neighbour.IsSolid() || neighbour.BlockType.IsOneOf(blockTypes) ) neighbours |= Back;
        neighbour = World.GetBlock(actor, pos.Front() );
        if( neighbour.IsSolid() || neighbour.BlockType.IsOneOf(blockTypes) ) neighbours |= Front;

        return neighbours;
    }


}