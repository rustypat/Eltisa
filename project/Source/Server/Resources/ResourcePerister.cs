namespace Eltisa.Server; 

using System;
using System.IO;
using System.IO.Compression;
using Eltisa.Models;
using Eltisa.Administration;
using Eltisa.Tools;
using static System.Diagnostics.Debug;


public static class ResourcePersister {

    private const int  ENDTAG = 01110111;

        static public string ReadText(WorldPoint blockPosition, int requestedType, string password=null) {
            string  fileName = GetFilePath(blockPosition); 
            if(!File.Exists(fileName)) return null;

            string text = null;
            using(FileStream regionStream = File.OpenRead(fileName)) {
                DeflateStream deflateStream = new DeflateStream(regionStream, CompressionMode.Decompress);
                BinaryReader  reader        = new BinaryReader(regionStream);

                int type               = reader.ReadInt32();  
                int owner              = reader.ReadInt32();
                string storedPassword  = reader.ReadString();
                text                   = reader.ReadString();
                int endTag             = reader.ReadInt32();  Assert(endTag == ENDTAG);
                reader.Close();
          
                if( type != requestedType )              return null;
                if(storedPassword.IsUndefined())         return text;
                else if(String.IsNullOrEmpty(password))  return "PASSWORD REQUIRED";
                else if(password != storedPassword)      return "WRONG PASSWORD";
                else                                     return text;
            }
        }

        static public void WriteText(WorldPoint blockPosition, int type, string text, string password="") {
            Log.Trace("Store block resource for " + blockPosition);

            if(String.IsNullOrWhiteSpace(text) ) {
                DeleteText(blockPosition);
                return;
            }
            
            string filePath = GetDirectoryPath(); 
            string fileName = GetFilePath(blockPosition); 
            Directory.CreateDirectory(filePath);
            using(FileStream resourceStream = File.OpenWrite(fileName)) {
                DeflateStream deflateStream = new DeflateStream(resourceStream, CompressionMode.Compress);
                BinaryWriter  writer = new BinaryWriter(resourceStream);

                writer.Write((int)type);       
                writer.Write((int)0);         // owner
                writer.Write((string)password);            
                writer.Write((string)text);                
                writer.Write((int)ENDTAG);            
                writer.Close();
            }
        }


    static public void DeleteText(WorldPoint blockPosition) {
        try {
            string fileName = GetFilePath(blockPosition); 
            File.Delete(fileName);
        }
        catch(Exception) {
            // nothing to delete, no problem
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // support methods
    ///////////////////////////////////////////////////////////////////////////////////////////

    public const string FileType =  ".rtx";

    public static string GetFilePath(WorldPoint position) {
        return Configuration.ResourceDirectory + position.X + "_" + position.Y + "_" + position.Z + ".rtx";            
    }


    public static string GetDirectoryPath() {
        return Configuration.ResourceDirectory;
    }
    

    public static WorldPoint GetFilePosition(string fileName) {
        string trimedName    = fileName.TrimEnd(FileType);
        string[] coordinates = trimedName.Split("_");
        int x                = int.Parse(coordinates[0]);
        int y                = int.Parse(coordinates[1]);
        int z                = int.Parse(coordinates[2]);
        return new WorldPoint(x, y, z);
    }
    
    
}