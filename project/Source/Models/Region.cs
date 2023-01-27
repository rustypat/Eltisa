namespace Eltisa.Models; 

using System;
using System.Text;
using System.Collections.Generic;


public class Region {

    public readonly RegionPoint                    Position;  
    public int                                     Owner;      
    public int                                     AccessRights;      

    private DateTime                               lastUsed;
    public bool                                    Changed;  
    private Dictionary<ChunkPoint, Chunk>          chunks;        


    public Region(RegionPoint pos, int owner=0, int accessRights=0, List<Chunk> chunkList=null) {
        Position         = pos;
        Owner            = owner;
        AccessRights     = accessRights;
        lastUsed         = DateTime.Now;
        Changed          = false;
        if(chunkList != null && chunkList.Count > 0) {
            chunks = new Dictionary<ChunkPoint, Chunk>();
            foreach(Chunk chunk in chunkList) {
                chunks.Add(chunk.Position, chunk);
            }
        }
    }


    public override bool Equals(object obj)
    {
        var region = obj as Region;

        if (region == null) return false;
        else                return this.Position == region.Position;
    }


    public override int GetHashCode()
    {
        return Position.GetHashCode();
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // chunks
    ///////////////////////////////////////////////////////////////////////////////////////////


    public Chunk GetChunk(WorldPoint worldPos) {
        ChunkPoint pos   = worldPos.GetChunkPoint();
        return GetChunk(pos);
    }


    public Chunk GetChunk(ChunkPoint pos) {
        lastUsed         = DateTime.Now;
        if(chunks == null) return null;

        Chunk chunk;
        chunks.TryGetValue(pos, out chunk);
        return chunk;
    }


    public void SetChunk(Chunk chunk) {
        lastUsed    = DateTime.Now;
        if(chunks == null) chunks = new Dictionary<ChunkPoint, Chunk>();
        chunks[chunk.Position] = chunk;
    }


    public void OptimizeChunks() {
        lastUsed    = DateTime.Now;
        if(chunks == null) return;
        
        foreach(Chunk chunk in chunks.Values) {
            ushort recommendedType = chunk.DetermineDefaultBlock();
            if(recommendedType != chunk.DefaultBlockDefinition) {
                chunk.ConvertToNewDefaultBlockDefinition(recommendedType);                    
            };
        }
    }


    public void Validate() {
        if(chunks == null) return;            
        foreach(Chunk chunk in chunks.Values) {
            chunk.Validate(Position);
        }
    }


    private static Dictionary<ChunkPoint, Chunk> emptyDictionaryDummy = new Dictionary<ChunkPoint, Chunk>();

    public IEnumerable<Chunk> GetChunks() {
        lastUsed    = DateTime.Now;
        if(chunks == null) return emptyDictionaryDummy.Values;
        else               return chunks.Values;
    }


    public bool UsedAfter(DateTime dateTime) { return lastUsed.CompareTo(dateTime) > 0; }

    override
    public string ToString() {
        StringBuilder strb = new StringBuilder();
        strb.Append("Region " + Position.X + "/" + Position.Y + "/" + Position.Z);
        if( Changed ) strb.Append("  changed");
        return strb.ToString();
    }



}