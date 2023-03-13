namespace Eltisa.Server.Resources; 

using System;
using System.IO;
using System.IO.Compression;
using Eltisa.Models;
using Eltisa.Administration;
using Eltisa.Tools;
using static System.Diagnostics.Debug;


class ResourcePersister {

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
        writer.Write((ushort)resource.BlockType);       
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
        ushort blockType       = reader.ReadUInt16();
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



    ///////////////////////////////////////////////////////////////////////////////////////////
    // support methods
    ///////////////////////////////////////////////////////////////////////////////////////////


    public string GetFileNameFromPosition(WorldPoint position) {
        return resourceDirectory + position.X + "_" + position.Y + "_" + position.Z + FileType;            
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