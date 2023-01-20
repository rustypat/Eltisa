namespace Eltisa.Source.Models;     

using System;
using static System.Diagnostics.Debug;


public struct Block {

    // block faces
    [FlagsAttribute]
    public enum  Faces { Left=1, Right=2, Back=4, Front=8, Bottom=16, Top=32 }
    public const Faces AllFaces = Faces.Left | Faces.Front | Faces.Right | Faces.Back | Faces.Top | Faces.Bottom;
    public const Faces NoFaces = 0;


    // 32 bites:
    // 4 bite y position, 4 bite z position, 4 bite x position, 6 bite faces, 5 bite category, 6 bite type, 3 bite status or subtype
    private uint      data;

    public uint GetData()          { return data;      }    // this method is only for persister

    // properties
    public BlockPoint Position     { get {
        return new BlockPoint( (int)(data >> 20) );
    }}  

    public Faces       BlockFaces   { get {
        return (Faces)( (data >> 14) & 0b111111 );
    }}

    public ushort     Definition   { get {                  // 32 Categories * 64 BlockType * 8 States
        return (ushort) (data & 0b11111111111111);
    }} 

    public byte       Category   { get {
        return (byte)( (data >> 9) & 0b11111 );             // 5 bits
    }}
   

    public ushort     BlockType   { get {                   // 5 + 6 + 3 bits, Definition with status erased
        return (ushort) (data & 0b11111111111000);
    }}
   
    public byte       Status   { get {                      // Status or subtype, 3 bits
        return (byte)( data & 0b111 );
    }}


    public bool IsTransparent() {
        return Category >= 8;
    }


    public static bool IsTransparent(ushort blockDefinition) {
        Assert(blockDefinition <=  0b11111111111111);
        return blockDefinition >> 9 >= 8;
    }


    public bool IsSolid() {
        return data > 7 && Category < 8;
    }


    public bool HasResource() {
        return BlockType == BlockDescription.Scripture_Left;
    }


    // construction
    public Block(uint data) {
        this.data = data;
    }


    public Block(BlockPoint position) {  
        data = ((uint)position.Data) << 20;
    }


    public Block(BlockPoint position, ushort definition, Faces blockFaces) {  
        Assert(definition <=  0b11111111111111);
        Assert( (int)blockFaces <=  0b111111);
        data = ( ((uint)position.Data) << 20) | ( ((uint)blockFaces) << 14) |  (uint)definition;
    }


    // methods
    public bool IsBlock() {
        return data > 7;
    }


    public bool IsNoBlock() {
        return data < 8;
    }


    public bool IsInvalid() => data == BlockDescription.InvalidBlock.data;


    public override bool Equals(object obj)  {
        if (obj is Block) {
            return data == ((Block) obj).data;
        }
        else {
            return false;
        }
    }


    override public int GetHashCode() {
        return (int)data;
    }


    public bool EqualsExceptState(Block block) {
        return (data >> 3) == (block.data >> 3);
    }


    public int ComparePosition(Block block) {
        return (int)(data >> 20) -  (int)(block.data >> 20);
    }


    public void AddFace(Faces face) {
        data |= ((uint)face << 14);
    }


    public void RemoveFace(Faces face) {
        data &= ~((uint)face << 14);
    }


    public bool HasFace(Faces face) {
        return (data & ((uint)face << 14) ) != 0;
    }


    override public string ToString() {
        return Position + " : " + Definition;
    }

}