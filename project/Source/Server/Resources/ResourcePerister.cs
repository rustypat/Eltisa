namespace Eltisa.Server.Resources; 

using System;
using System.IO;
using System.IO.Compression;
using Eltisa.Models;
using Eltisa.Administration;
using Eltisa.Tools;
using static System.Diagnostics.Debug;


public class ResourcePersister {

    public const string      FileType            =  ".rsc";
    private const ushort     storeFormatVersion  = 1;
    private const int        endTag              = 01110111;
    private readonly string  resourceDirectory;      


    public ResourcePersister(string resourceDirectory) {
        this.resourceDirectory = resourceDirectory;
    }



    public void WriteResource(WorldPoint position, Resource resource) {
        string fileName = GetFileNameFromPosition(position); 
        Directory.CreateDirectory(resourceDirectory);

        using FileStream resourceStream = File.OpenWrite(fileName);
        using BinaryWriter  writer = new BinaryWriter(resourceStream);

        writer.Write((ushort)storeFormatVersion);       
        writer.Write((short)resource.AccessRights);
        writer.Write((int)resource.BlockType);       
        writer.Write((int)resource.OwnerId); 
        writer.Write((string)resource.Password);   
        writer.Write((int)resource.Data.Length);         
        writer.Write((byte[])resource.Data);                
        writer.Write((int)endTag);            
    }

    
    public Resource ReadResource(WorldPoint position) {
        string  fileName = GetFileNameFromPosition(position); 
        if(!File.Exists(fileName)) return null;

        using FileStream regionStream = File.OpenRead(fileName);
        using BinaryReader  reader    = new BinaryReader(regionStream);

        ushort formatVersion   = reader.ReadUInt16();
        Assert(formatVersion == storeFormatVersion);
        short accessRights     = reader.ReadInt16();
        int blockType          = reader.ReadInt32();
        int ownerId            = reader.ReadInt32();
        string password        = reader.ReadString();
        int dataSize           = reader.ReadInt32();
        byte[] data            = reader.ReadBytes(dataSize);
        int endTag             = reader.ReadInt32(); 
        Assert(endTag == ResourcePersister.endTag);

        return new Resource(blockType, ownerId, password, data);
    }


    public void DeleteResource(WorldPoint position) {
        string  fileName = GetFileNameFromPosition(position); 
        if(!File.Exists(fileName)) return;
        File.Delete(fileName);
    }



    public string ReadText(WorldPoint blockPosition, int requestedType, string password=null) {
        string  fileName = GetTextFileNameFromPosition(blockPosition); 
        if(!File.Exists(fileName)) return null;

        string text = null;
        using(FileStream regionStream = File.OpenRead(fileName)) {
            DeflateStream deflateStream = new DeflateStream(regionStream, CompressionMode.Decompress);
            BinaryReader  reader        = new BinaryReader(regionStream);

            int type               = reader.ReadInt32();  
            int owner              = reader.ReadInt32();
            string storedPassword  = reader.ReadString();
            text                   = reader.ReadString();
            int endTag             = reader.ReadInt32(); Assert(endTag == ResourcePersister.endTag);
            reader.Close();
        
            if( type != requestedType )              return null;
            if(storedPassword.IsUndefined())         return text;
            else if(String.IsNullOrEmpty(password))  return "PASSWORD REQUIRED";
            else if(password != storedPassword)      return "WRONG PASSWORD";
            else                                     return text;
        }
    }

    public void WriteText(WorldPoint blockPosition, int type, string text, string password="", string newPassword="") {
        Log.Trace("Store block resource for " + blockPosition);

        //check permission
        string  fileName = GetTextFileNameFromPosition(blockPosition);
        if(File.Exists(fileName)) {
            using(FileStream regionStream = File.OpenRead(fileName)) {
                DeflateStream deflateStream = new DeflateStream(regionStream, CompressionMode.Decompress);
                BinaryReader  reader        = new BinaryReader(regionStream);

                reader.ReadInt32();  
                reader.ReadInt32();
                string storedPassword  = reader.ReadString();
                reader.Close();

                if(storedPassword != "" && storedPassword != password) return;
            }
        }
        else Log.Trace("File doen't exist");





        if(String.IsNullOrWhiteSpace(text) ) {
            DeleteText(blockPosition);
            return;
        }
        
        fileName = GetTextFileNameFromPosition(blockPosition); 
        Directory.CreateDirectory(resourceDirectory);
        using(FileStream resourceStream = File.OpenWrite(fileName)) {
            DeflateStream deflateStream = new DeflateStream(resourceStream, CompressionMode.Compress);
            BinaryWriter  writer = new BinaryWriter(resourceStream);

            writer.Write((int)type);       
            writer.Write((int)0);         // owner
            writer.Write((string)newPassword);            
            writer.Write((string)text);                
            writer.Write((int)endTag);            
            writer.Close();
        }
    }


    public void DeleteText(WorldPoint blockPosition) {
        try {
            string fileName = GetTextFileNameFromPosition(blockPosition); 
            File.Delete(fileName);
        }
        catch(Exception) {
            // nothing to delete, no problem
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // support methods
    ///////////////////////////////////////////////////////////////////////////////////////////


    public string GetFileNameFromPosition(WorldPoint position) {
        return resourceDirectory + position.X + "_" + position.Y + "_" + position.Z + FileType;            
    }


    public string GetTextFileNameFromPosition(WorldPoint position) {
        return resourceDirectory + position.X + "_" + position.Y + "_" + position.Z + ".rtx";            
    }


    public static WorldPoint GetPositionFromFileName(string fileName) {
        string trimedName    = fileName.TrimEnd(FileType);
        string[] coordinates = trimedName.Split("_");
        int x                = int.Parse(coordinates[0]);
        int y                = int.Parse(coordinates[1]);
        int z                = int.Parse(coordinates[2]);
        return new WorldPoint(x, y, z);
    }
    
    
}