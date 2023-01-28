namespace Eltisa.Tools; 

using System;
using System.IO;
using System.Text;


public class ArrayReader {

    private Stream       stream;
    private BinaryReader reader;

    public ArrayReader(byte[] buffer) {
        stream = new MemoryStream(buffer);
        reader = new BinaryReader(stream);
    }


    public byte ReadByte() {
        return reader.ReadByte();
    }


    public short ReadShort() {
        return reader.ReadInt16();
    }


    public ushort ReadUShort() {
        return reader.ReadUInt16();
    }


    public int ReadInt() {
        return reader.ReadInt32();
    }


    public uint ReadUInt() {
        return reader.ReadUInt32();
    }


    public float ReadFloat() {
        return reader.ReadSingle();
    }


    public string ReadString() {
        int length = reader.ReadInt32();
        if(length < 0) return null;
        byte[] buffer = new byte[length];
        reader.Read(buffer, 0, length);
        string str = Encoding.UTF8.GetString(buffer);
        return str;
    }        


    public byte[] ReadBytes() {
        int length = reader.ReadInt32();
        if(length < 0) return null;
        byte[] buffer = new byte[length];
        reader.Read(buffer, 0, length);
        return buffer;
    }        

}