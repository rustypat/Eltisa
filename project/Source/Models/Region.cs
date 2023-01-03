using System;
using System.Text;
using System.Collections.Generic;
using static System.Diagnostics.Debug;

using Eltisa.Source.Server;


namespace Eltisa.Source.Models {

    public class Region {

        public readonly RegionPoint                    Position;  
        public int                                     Owner;      
        public int                                     AccessRights;      

        private DateTime                               lastUsed;
        private bool                                   hasChanged;  
        private Dictionary<ChunkPoint, Chunk>          chunks;        
        private HashSet<Actor>                         actors; 


        public Region(RegionPoint pos, int owner=0, int accessRights=0, List<Chunk> chunkList=null) {
            Position         = pos;
            Owner            = owner;
            AccessRights     = accessRights;
            lastUsed         = DateTime.Now;
            hasChanged       = false;
            if(chunkList != null && chunkList.Count > 0) {
                chunks = new Dictionary<ChunkPoint, Chunk>();
                foreach(Chunk chunk in chunkList) {
                    chunks.Add(chunk.Position, chunk);
                }
            }
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


        public int CountModifiedChunks() {
            lastUsed  = DateTime.Now;
            if(chunks == null) return 0;            
            
            int chunkCount = 0;
            foreach(Chunk chunk in chunks.Values) {
                if(DefaultWorld.IsModifiedChunk(chunk)) {
                    chunkCount++;
                }
            }  
            return chunkCount;          
        }


        private static Dictionary<ChunkPoint, Chunk> emptyDictionaryDummy = new Dictionary<ChunkPoint, Chunk>();

        public IEnumerable<Chunk> GetChunks() {
            lastUsed    = DateTime.Now;
            if(chunks == null) return emptyDictionaryDummy.Values;
            else               return chunks.Values;
        }


        public bool LastUsedBefore(DateTime dateTime) { return lastUsed.CompareTo(dateTime) < 0; }
        public void SetChanged()   => hasChanged = true;
        public void SetUnchanged() => hasChanged = false;     
        public bool HasChanged()   => hasChanged; 
        public bool HasActors()    => actors != null && actors.Count > 0; 

        override
        public string ToString() {
            StringBuilder strb = new StringBuilder();
            strb.Append("Region " + Position.X + "/" + Position.Y + "/" + Position.Z);
            if( actors != null ) strb.Append(" actors:" + actors.Count);
            if( HasChanged() ) strb.Append("  changed");
            return strb.ToString();
        }


        ///////////////////////////////////////////////////////////////////////////////////////////
        // actors
        ///////////////////////////////////////////////////////////////////////////////////////////

        public void AddActor(Actor actor) {
            lastUsed    = DateTime.Now;
            if(actors == null) actors = new HashSet<Actor>();
            lock(actors) {
                actors.Add(actor);
            }
        }

        
        public void RemoveActor(Actor actor) {
            lastUsed    = DateTime.Now;
            if(actors == null) return;
            lock(actors) {
                actors.Remove(actor);
            }
        }        

        
        private static readonly HashSet<Actor> emptyActorsDummy = new HashSet<Actor>();

        public IEnumerable<Actor> GetActors()  {
            lastUsed    = DateTime.Now;
            if(actors == null) return emptyActorsDummy;
            else               return actors;
        }
        

    }

}