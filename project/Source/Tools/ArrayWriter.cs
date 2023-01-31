namespace Eltisa.Tools; 

using System;
using System.IO;
using System.Text;


public struct ArrayWriter {
    private MemoryStream stream;
    private BinaryWriter writer;


    public ArrayWriter() {
        stream = new MemoryStream();
        writer = new BinaryWriter(stream, Encoding.UTF8);
    }


    public byte[] ToArray() {
        return stream.ToArray();
    }


    public void WriteByte(byte value) {
        writer.Write(value);
    }


    public void WriteShort(short value) {
        writer.Write(value);
    }


    public void WriteUShort(ushort value) {
        writer.Write(value);
    }


    public void WriteInt(int value) {
        writer.Write(value);
    }


    public void WriteUint(uint value) {
        writer.Write(value);
    }


    public void WriteFloat(float value) {
        writer.Write(value);
    }


    public void WriteString(string str) {
        if(str == null) {
            writer.Write((int)-1);
        }
        else {
            byte[] utf8Array = Encoding.UTF8.GetBytes(str);
            writer.Write((int)utf8Array.Length);
            writer.Write(utf8Array);
        }
    }


    public void WriteBytes(byte[] data) {
        if(data == null) {
            writer.Write((int)-1);
        }
        else {
            writer.Write((int)data.Length);
            writer.Write(data);
        }
    }
}