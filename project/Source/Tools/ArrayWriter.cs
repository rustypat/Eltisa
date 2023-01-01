// Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved
using System;
using System.IO;
using System.Text;


namespace Eltisa.Source.Tools {

        public class ArrayWriter {
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
                byte[] utf8Array = Encoding.UTF8.GetBytes(str);
                writer.Write((int)utf8Array.Length);
                writer.Write(utf8Array);
            }

        }
}