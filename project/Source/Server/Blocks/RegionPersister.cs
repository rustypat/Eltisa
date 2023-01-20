namespace Eltisa.Server.Blocks; 

using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using Eltisa.Tools;
using Eltisa.Models;
using static System.Diagnostics.Debug;

public class RegionPersister : IRegionAccess {

    public const string      FileType =  ".rgn";
    private const int        STOREFORMAT_VERSION_1 = 01010101;
    private readonly string  regionDirectory;      


    public RegionPersister(string regionDirectory) {
        this.regionDirectory = regionDirectory;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////
    // read and write
    ///////////////////////////////////////////////////////////////////////////////////////////

    public Region ReadRegion(RegionPoint pos) {
        string  fileName = GetFilePath(pos); 
        if(!File.Exists(fileName)) return null;
        Log.Trace("Read region from " + fileName);

        using(FileStream regionStream = File.OpenRead(fileName)) {
            //DeflateStream deflateStream = new DeflateStream(regionStream, CompressionMode.Decompress);
            BinaryReader  reader      = new BinaryReader(regionStream);

            int version       = reader.ReadInt32();  Assert(version == STOREFORMAT_VERSION_1, "stored data has not same version format");
            int owner         = reader.ReadInt32();
            int accessRights  = reader.ReadInt32();
            int chunkCount    = reader.ReadInt32();
            List<Chunk> chunks = new List<Chunk>(chunkCount);
            for(int i = 0; i < chunkCount; i++) {
                chunks.Add(ReadChunk(reader));
            }
            int endTag        = reader.ReadInt32();  Assert(endTag == STOREFORMAT_VERSION_1);
            reader.Close();

            Region region = new Region(pos, owner, accessRights, chunks);            
            return region;
        }
    }


    private Chunk ReadChunk(BinaryReader reader) {
        ushort posData                  = reader.ReadUInt16();
        ushort defaultBlockDefinition   = reader.ReadUInt16();
        ushort blockCount               = reader.ReadUInt16();

        ChunkPoint pos   = new ChunkPoint(posData);
        Chunk chunk      = new Chunk(pos, defaultBlockDefinition);            
        chunk.BlockCount = blockCount;

        int transparentBlocks = reader.ReadUInt16();
        chunk.SetTransparentBlockCapacity(transparentBlocks);
        for(int i=0; i < transparentBlocks; i++) {
            uint data = reader.ReadUInt32();
            Block block = new Block(data );
            chunk.AddTransparentBlock(block);
        }

        int borderBlocks = reader.ReadUInt16();
        chunk.SetBorderBlockCapacity(borderBlocks);
        for(int i=0; i < borderBlocks; i++) {
            uint data = reader.ReadUInt32();
            Block block = new Block(data );
            chunk.AddBorderBlock(block);
        }

        int innerBlocks = reader.ReadUInt16();
        chunk.SetInnerBlockCapacity(innerBlocks);
        for(int i=0; i < innerBlocks; i++) {
            uint data = reader.ReadUInt32();
            Block block = new Block(data );
            Assert(block.BlockFaces == Block.NoFaces);
            chunk.AddInnerBlock(block);
        }

        int emptyBlocks = reader.ReadUInt16();
        chunk.SetEmptyBlockCapacity(emptyBlocks);
        for(int i=0; i < emptyBlocks; i++) {
            uint data = ((uint)reader.ReadUInt32()) << 16;
            Block block = new Block(data);
            chunk.AddEmptyBlock(block);
        }

        return chunk;
    }


    public void WriteRegion(Region region) {
        Directory.CreateDirectory(regionDirectory);
        string fileName = GetFilePath(region.Position); 
        Log.Trace("Store region to " + fileName);

        using(FileStream regionStream = File.OpenWrite(fileName)) {
            //DeflateStream deflateStream = new DeflateStream(regionStream, CompressionMode.Compress);
            BinaryWriter  writer = new BinaryWriter(regionStream);

            writer.Write((int)STOREFORMAT_VERSION_1);            
            writer.Write((int)region.Owner);            
            writer.Write((int)region.AccessRights);            
            writer.Write((int)region.GetChunks().Count(chunk => DefaultWorld.IsModifiedChunk(chunk)));
            
            foreach(Chunk chunk in region.GetChunks()) {
                if(DefaultWorld.IsModifiedChunk(chunk)) {

                    // optimize storage 
                    ushort defaultBlockDefinition = chunk.RecommendDefaultBlock();
                    if(defaultBlockDefinition != chunk.DefaultBlockDefinition) {
                        chunk.ConvertToNewDefaultBlockDefinition(defaultBlockDefinition);  // TODO: needs a mutex lock
                    }
                    WriteChunk(writer, chunk);
                }
            }
            writer.Write((int)STOREFORMAT_VERSION_1);            
            writer.Close();
        }
    }


    private void WriteChunk(BinaryWriter writer, Chunk chunk) {
        writer.Write((ushort)chunk.Position.Data);
        writer.Write((ushort)chunk.DefaultBlockDefinition);
        writer.Write((ushort)chunk.BlockCount);

        writer.Write((ushort)chunk.TransparentBlocks.Size());       
        foreach(Block block in chunk.TransparentBlocks.GetBlocks()) {
            writer.Write((uint)block.GetData());
        }
        
        writer.Write((ushort)chunk.BorderBlocks.Size());       
        foreach(Block block in chunk.BorderBlocks.GetBlocks()) {
            writer.Write((uint)block.GetData());
        }
        
        writer.Write((ushort)chunk.InnerBlocks.Size());       
        foreach(Block block in chunk.InnerBlocks.GetBlocks()) {
            Assert(block.BlockFaces == Block.NoFaces);
            writer.Write((uint)block.GetData());
        }
        
        writer.Write((ushort)chunk.EmptyBlocks.Size());       
        foreach(Block block in chunk.EmptyBlocks.GetBlocks()) {
            writer.Write( (uint)(block.GetData() >> 16) );
        }            
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // support methods
    ///////////////////////////////////////////////////////////////////////////////////////////


    public string GetFilePath(RegionPoint pos) {
        return regionDirectory + pos.X + "_" + pos.Y + "_" + pos.Z + FileType;
    }


    public RegionPoint GetFilePosition(string fileName) {
        string trimedName    = fileName.TrimEnd(FileType);
        string[] coordinates = trimedName.Split("_");
        int x                = int.Parse(coordinates[0]);
        int y                = int.Parse(coordinates[1]);
        int z                = int.Parse(coordinates[2]);
        return new RegionPoint(x, y, z);
    }

}