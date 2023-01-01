// Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved
using System;
using System.Linq;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Collections;
using static System.Diagnostics.Debug;

using Eltisa.Source.Server;
using Eltisa.Source.Tools;
using static Eltisa.Source.Models.BlockListExtensions;
using static Eltisa.Source.Administration.Configuration;

namespace Eltisa.Source.Models {

    public class Chunk {

        public  readonly ChunkPoint    Position;
        public  ushort                 DefaultBlockDefinition { get; private set; }
        public  ushort                 BlockCount        { get; set; }
        
        public  BlockList              TransparentBlocks { get; private set; }
        public  BlockList              BorderBlocks      { get; private set; }
        public  BlockList              InnerBlocks       { get; private set; }
        public  BlockList              EmptyBlocks       { get; private set; }


        public Chunk(ChunkPoint position, ushort defaultBlockDefinition = Block.NoBlock) {
            Position = position;
            this.DefaultBlockDefinition = defaultBlockDefinition;
            if(defaultBlockDefinition == Block.NoBlock) BlockCount = 0;
            else                                        BlockCount = ChunkVolume;
        }


        ///////////////////////////////////////////////////////////////////////////////////////////
        // info
        ///////////////////////////////////////////////////////////////////////////////////////////


        public bool IsAdditiv() {
            return DefaultBlockDefinition == Block.NoBlock;
        }


        public bool IsSubtractiv()  {
            return DefaultBlockDefinition != Block.NoBlock;
        }


        public bool HasBlockAt(BlockPoint blockPos) {
            if(BlockCount == 0)                                 return false;
            if(BlockCount == ChunkVolume)                       return true;
            if(IsAdditiv()) {
                if(TransparentBlocks.ContainsBlock(blockPos))   return true;
                if(BorderBlocks.ContainsBlock(blockPos) )       return true;
                if(InnerBlocks.ContainsBlock(blockPos) )        return true;
                return false;
            }
            else {  // isSubtractiv
                if(EmptyBlocks.ContainsBlock(blockPos))         return false;
                return true;
            }
        }


        public bool HasSolidBlockAt(BlockPoint blockPos) {
            if(BlockCount == 0)                                 return false;
            if(IsAdditiv()) {
                if(BorderBlocks.ContainsBlock(blockPos) )       return true;
                if(InnerBlocks.ContainsBlock(blockPos) )        return true;
                return false;
            }
            else {  // isSubtractiv
                if(EmptyBlocks.ContainsBlock(blockPos))         return false;
                if(TransparentBlocks.ContainsBlock(blockPos))   return false;
                return true;
            }
        }


        public Block GetBlock(BlockPoint blockPos) {
            Block block = BorderBlocks.GetBlock(blockPos);
            if(block.IsABlock())                                return block;

            block = TransparentBlocks.GetBlock(blockPos);            
            if(block.IsABlock())                                return block;

            block = InnerBlocks.GetBlock(blockPos);            
            if(block.IsABlock())                                return block;

            if(IsAdditiv()) {
                return Block.NotABlock;
            }
            else {
                if(EmptyBlocks.ContainsBlock(blockPos))         return Block.NotABlock;
                else                                            return new Block(blockPos, DefaultBlockDefinition, Block.NoFaces);
            }
        }


        public bool IsModified() {
            return (TransparentBlocks.Size() != 0) || (BorderBlocks.Size() != 0) || (InnerBlocks.Size() != 0) || (EmptyBlocks.Size() != 0);
        }


        override
        public string ToString() {
            return "Chunk " + Position.X + "/" + Position.Y + "/" + Position.Z + "   type:" + DefaultBlockDefinition + "   tb:" + TransparentBlocks.Size()  + "   bb:" + BorderBlocks.Size() + "   ib:" + InnerBlocks.Size() + "   eb:" + EmptyBlocks.Size();
        }


        ///////////////////////////////////////////////////////////////////////////////////////////
        // block management
        ///////////////////////////////////////////////////////////////////////////////////////////


        public Block AddBlock(WorldPoint worldPos, ushort blockDefinition) {
            Assert(blockDefinition != 0);
            var pos = worldPos.GetBlockPoint();

            // check if is allowed
            if(HasBlockAt(pos) ) return Block.NotABlock;

            if(EmptyBlocks.Size() > 0) {
                EmptyBlocks.RemoveBlock(pos);
            }

            if(Block.IsTransparent(blockDefinition)) {
                var faces    = DetermineVisibleFaces(worldPos, pos);
                var block    = new Block(pos, blockDefinition, faces);
                InsertTransparentBlock(block);
                BlockCount++;
                return block;
            }
            else {  // solid block
                var faces    = RemoveVisibleFacesOfNeighbours(worldPos, pos);
                var block    = new Block(pos, blockDefinition, faces);
                if(block.BlockFaces == Block.NoFaces) {                    
                    if(IsAdditiv() || block.Definition != DefaultBlockDefinition) {
                        InsertInnerBlock(block);                
                    }
                }
                else {
                    InsertBorderBlock(block);
                }                
                BlockCount++;
                return block;
            }

        }


        public Block RemoveVisibleBlock(WorldPoint worldPos) {
            BlockPoint pos = worldPos.GetBlockPoint();
            Block      block;

            // remove transparent block
            block = TransparentBlocks.RemoveBlock(pos);
            if(block.IsABlock()) {
                BlockCount--;
                if(IsSubtractiv()) {
                    InsertEmptyBlock(new Block(pos, Block.Air, Block.NoFaces));
                }
                return block;
            }

            // remove solid block
            block = BorderBlocks.RemoveBlock(pos);
            if(block.IsABlock()) {
                BlockCount--;
                if(IsSubtractiv()) {
                    InsertEmptyBlock(new Block(pos, Block.Air, Block.NoFaces));
                }
                // adjust faces and regroup neighbour blocks
                AddVisibleFacesToNeighbours(worldPos, pos);
                return block;
            }
            
            return Block.NotABlock;
        }


        public Block ChangeStateOfVisibleBlock(WorldPoint worldPos, ushort blockDefinition) {
            Assert(blockDefinition != 0);
            var pos = worldPos.GetBlockPoint();

            var oldBlock    = BorderBlocks.GetBlock(pos);
            if(oldBlock.IsABlock()) {
                var newBlock    = new Block(pos, blockDefinition, oldBlock.BlockFaces);  
                if( oldBlock.GetData() == newBlock.GetData() ) {
                    return Block.NotABlock;                       
                }
                if(!oldBlock.EqualsExceptState(newBlock)) {
                    return Block.NotABlock;   // new block type does not match old block type
                }
                else {
                    ReplaceBorderBlock(newBlock);
                    return newBlock;
                }
            }

            oldBlock = TransparentBlocks.GetBlock(pos);
            if(oldBlock.IsABlock()) {
                var newBlock    = new Block(pos, blockDefinition, oldBlock.BlockFaces);            
                if(!oldBlock.EqualsExceptState(newBlock)) {
                    return Block.NotABlock;
                }
                else {
                    ReplaceTransparentBlock(newBlock);
                    return newBlock;
                }
            }

            // there was no block to change
            return Block.NotABlock;
        }


        ///////////////////////////////////////////////////////////////////////////////////////////
        // face management
        ///////////////////////////////////////////////////////////////////////////////////////////


        private Block.Faces DetermineVisibleFaces(WorldPoint  worldPos, BlockPoint blockPos) {
            Block.Faces faces = Block.NoFaces;
            
            if(blockPos.IsMostLeft()) {
                if( !World.HasSolidBlockAt(worldPos.Left())   )  faces |= Block.Faces.Left;
            }
            else {
                if(       !HasSolidBlockAt(blockPos.Left())   )  faces |= Block.Faces.Left;
            }

            if(blockPos.IsMostRight()) {
                if( !World.HasSolidBlockAt(worldPos.Right())  )  faces |= Block.Faces.Right;
            }
            else {
                if(       !HasSolidBlockAt(blockPos.Right())  )  faces |= Block.Faces.Right;
            }

            if(blockPos.IsMostBack()) {
                if( !World.HasSolidBlockAt(worldPos.Back())   )  faces |= Block.Faces.Back;
            }
            else {
                if(       !HasSolidBlockAt(blockPos.Back())   )  faces |= Block.Faces.Back;
            }

            if(blockPos.IsMostFront()) {
                if( !World.HasSolidBlockAt(worldPos.Front())  )  faces |= Block.Faces.Front;
            }
            else {
                if(       !HasSolidBlockAt(blockPos.Front())  )  faces |= Block.Faces.Front;
            }

            if(blockPos.IsMostBottom()) {
                if( !World.HasSolidBlockAt(worldPos.Bottom()) )  faces |= Block.Faces.Bottom;
            }
            else {
                if(       !HasSolidBlockAt(blockPos.Bottom()) )  faces |= Block.Faces.Bottom;
            }

            if(blockPos.IsMostTop()) {
                if( !World.HasSolidBlockAt(worldPos.Top())    )  faces |= Block.Faces.Top;
            }
            else {
                if(       !HasSolidBlockAt(blockPos.Top())    )  faces |= Block.Faces.Top;
            }
            
            return faces;
        }


        private Block.Faces RemoveVisibleFacesOfNeighbours(WorldPoint  worldPos, BlockPoint blockPos) {
            Block.Faces faces = Block.NoFaces;

            Block neighbour;
            
            if(blockPos.IsMostLeft())   neighbour = World.RemoveFace(worldPos.Left(),  Block.Faces.Right);
            else                        neighbour =             RemoveFace(blockPos.Left(),  Block.Faces.Right);
            if(!neighbour.IsSolid())    faces |= Block.Faces.Left;

            if(blockPos.IsMostRight())  neighbour = World.RemoveFace(worldPos.Right(), Block.Faces.Left);
            else                        neighbour =             RemoveFace(blockPos.Right(), Block.Faces.Left);
            if(!neighbour.IsSolid())    faces |= Block.Faces.Right;
            
            if(blockPos.IsMostBack())   neighbour = World.RemoveFace(worldPos.Back(),  Block.Faces.Front);
            else                        neighbour =             RemoveFace(blockPos.Back(),  Block.Faces.Front);
            if(!neighbour.IsSolid())    faces |= Block.Faces.Back;
            
            if(blockPos.IsMostFront())  neighbour = World.RemoveFace(worldPos.Front(), Block.Faces.Back);
            else                        neighbour =             RemoveFace(blockPos.Front(), Block.Faces.Back);
            if(!neighbour.IsSolid())    faces |= Block.Faces.Front;
            
            if(blockPos.IsMostBottom()) neighbour = World.RemoveFace(worldPos.Bottom(),Block.Faces.Top); 
            else                        neighbour =             RemoveFace(blockPos.Bottom(),Block.Faces.Top); 
            if(!neighbour.IsSolid())    faces |= Block.Faces.Bottom;
            
            if(blockPos.IsMostTop())    neighbour = World.RemoveFace(worldPos.Top(),   Block.Faces.Bottom); 
            else                        neighbour =             RemoveFace(blockPos.Top(),   Block.Faces.Bottom); 
            if(!neighbour.IsSolid())    faces |= Block.Faces.Top;
            
            return faces;
        }


        private void AddVisibleFacesToNeighbours(WorldPoint  worldPos, BlockPoint blockPos) {
            if(blockPos.IsMostLeft())   World.AddFace(worldPos.Left(),  Block.Faces.Right);
            else                                    AddFace(blockPos.Left(),  Block.Faces.Right);
            if(blockPos.IsMostRight())  World.AddFace(worldPos.Right(), Block.Faces.Left);
            else                                    AddFace(blockPos.Right(), Block.Faces.Left);
            if(blockPos.IsMostBack())   World.AddFace(worldPos.Back(),  Block.Faces.Front);
            else                                    AddFace(blockPos.Back(),  Block.Faces.Front);            
            if(blockPos.IsMostFront())  World.AddFace(worldPos.Front(), Block.Faces.Back);
            else                                    AddFace(blockPos.Front(), Block.Faces.Back);
            if(blockPos.IsMostBottom()) World.AddFace(worldPos.Bottom(),Block.Faces.Top);
            else                                    AddFace(blockPos.Bottom(),Block.Faces.Top);
            if(blockPos.IsMostTop())    World.AddFace(worldPos.Top(),   Block.Faces.Bottom);
            else                                    AddFace(blockPos.Top(),   Block.Faces.Bottom);
        }        


        // return value is the block at pos after potential face removing
        public Block  RemoveFace(BlockPoint pos, Block.Faces face) {
            int i = BorderBlocks.FindIndexOfBlock(pos);
            if(i >= 0) {
                Block block = BorderBlocks.Get(i);
                block.RemoveFace(face);

                if(block.BlockFaces == Block.NoFaces) {                    
                    if(IsAdditiv()) {
                        BorderBlocks.RemoveBlock(pos);
                        InsertInnerBlock(block);                
                    }
                    else {
                        BorderBlocks.RemoveBlock(pos);
                        if(block.Definition != DefaultBlockDefinition) {
                            InsertInnerBlock(block);                
                        }
                    }
                }
                else {
                    BorderBlocks.Set(i, block);
                }
                return block;
            }

            Block transparentBlock = TransparentBlocks.RemoveFace(pos, face);
            if(transparentBlock.IsABlock()) return transparentBlock;

            // inner and empty blocks have no faces to remove
            Block innerBlock = InnerBlocks.GetBlock(pos);
            if(innerBlock.IsABlock()) return innerBlock;

            if(IsAdditiv()) {
                return Block.NotABlock;
            }
            else {
                if(EmptyBlocks.ContainsBlock(pos)) {
                    return Block.NotABlock;
                }
                else {
                    return new Block(pos, DefaultBlockDefinition, Block.NoFaces);
                }
            }

        }


        // returns the block at pos after adding face
        public Block AddFace(BlockPoint pos, Block.Faces face) {
            Block borderBlock = BorderBlocks.AddFace(pos, face);
            if(borderBlock.IsABlock()) return borderBlock;

            Block transparentBlock = TransparentBlocks.AddFace(pos, face);
            if(transparentBlock.IsABlock()) return transparentBlock;

            int j = InnerBlocks.FindIndexOfBlock(pos);
            if(j >= 0) {
                Block block = InnerBlocks.Get(j);
                block.AddFace(face);
                InsertBorderBlock(block);        
                InnerBlocks.RemoveAt(j);
                return block;
            }

            else if(IsSubtractiv()) {
                if(!EmptyBlocks.ContainsBlock(pos)) {
                    Block block = new Block(pos, DefaultBlockDefinition, face);
                    InsertBorderBlock(block);
                    return block;
                }
            }

            return Block.NotABlock;
        }


        ///////////////////////////////////////////////////////////////////////////////////////////
        // convert default block type
        ///////////////////////////////////////////////////////////////////////////////////////////


        public ushort RecommendDefaultBlock() {
            int defaultBlockCount = ChunkVolume - BorderBlocks.Size() - InnerBlocks.Size() - EmptyBlocks.Size();
            if(defaultBlockCount > ChunkVolume / 4)            return DefaultBlockDefinition;

            if(IsAdditiv()) {  // additiv storage mode
                if(BlockCount > ChunkVolume * 0.75)  return DetermineDefaultBlock();   // switch to subtractiv storage mode
                else                                 return DefaultBlockDefinition;        // remain with additiv storage mode
            }
            else {
                if(EmptyBlocks.Size() > ChunkVolume / 2)    return Block.NoBlock;          // switch to additiv storage mode
                if(defaultBlockCount < InnerBlocks.Size() / 3) return DetermineDefaultBlock(); // switch to other subtractive storage type
                else return DefaultBlockDefinition;                                                // remain
            }
        }


        public ushort DetermineDefaultBlock() {
            Log.Trace("DetermineDefaultBlock for chunk " + Position);
            int defaultCount = ChunkVolume - BorderBlocks.Size() - InnerBlocks.Size() - EmptyBlocks.Size();            
            if(defaultCount >= ChunkVolume / 2) return DefaultBlockDefinition;

            (ushort maxType, ushort maxCount) = GetMostCommonInnerBlock();

            if(IsAdditiv() ) {
                if(defaultCount >= maxCount)                                return DefaultBlockDefinition;
                else                                                        return maxType;
            }
            else {
                if(EmptyBlocks.Size() >= Math.Max(defaultCount, maxCount) ) return Block.NoBlock;
                if(defaultCount > maxCount)                                 return DefaultBlockDefinition;
                else                                                        return maxType;
            }
        }


        private (ushort, ushort) GetMostCommonInnerBlock() {
            ushort[] innerHistogram  = new ushort[Block.MaxSolidBlockDefinition];

            // count type occurence of inner blocks
            foreach(Block block in InnerBlocks.GetBlocks()) {
                innerHistogram[block.Definition]++;
            }

            // search most common type
            ushort maxType  = 0;
            ushort maxCount = 0;
            for(ushort i=0; i<innerHistogram.Length; i++) {
                if(innerHistogram[i] > maxCount) {
                    maxCount = innerHistogram[i];
                    maxType  = i;
                }
            }

            return (maxType, maxCount);
        }


        public void ConvertToNewDefaultBlockDefinition(ushort newDefaultBlockDefinition) {
            Log.Trace("ConvertToNewDefaultBlockDefinition chunk " + Position);
            Assert(DefaultBlockDefinition != newDefaultBlockDefinition);

            if(DefaultBlockDefinition == Block.NoBlock ) {   // change from additiv to subtractiv
                // search and store empty blocks
                for(int x=0; x<ChunkSize; x++) {
                    for(int y=0; y<ChunkSize; y++) {
                        for(int z=0; z<ChunkSize; z++) {
                            BlockPoint pos = new BlockPoint(x, y, z);
                            if(!BorderBlocks.ContainsBlock(pos) && !InnerBlocks.ContainsBlock(pos) && !TransparentBlocks.ContainsBlock(pos)) {
                                InsertEmptyBlock(new Block(pos, Block.Air, Block.NoFaces));
                            }
                        }                        
                    }
                }

                // remove inner blocks, that are default blocks
                InnerBlocks.RemoveAll(block => block.Definition == newDefaultBlockDefinition);
                DefaultBlockDefinition = newDefaultBlockDefinition;
            }
            else if(newDefaultBlockDefinition == Block.NoBlock) { // change from subtractiv to additiv
                // search and store default blocks
                for(int x=0; x<ChunkSize; x++) {
                    for(int y=0; y<ChunkSize; y++) {
                        for(int z=0; z<ChunkSize; z++) {
                            BlockPoint pos = new BlockPoint(x, y, z);
                            if(!BorderBlocks.ContainsBlock(pos) && !InnerBlocks.ContainsBlock(pos) && !EmptyBlocks.ContainsBlock(pos) && !TransparentBlocks.ContainsBlock(pos)) {
                                InsertInnerBlock(new Block(pos, DefaultBlockDefinition, Block.NoFaces));
                            }
                        }                        
                    }
                }

                if(EmptyBlocks != null) EmptyBlocks.Clear();
                DefaultBlockDefinition = newDefaultBlockDefinition;
            }
            else {  // stay subtractiv and change default block type
                // search and store old default blocks
                for(int x=0; x<ChunkSize; x++) {
                    for(int y=0; y<ChunkSize; y++) {
                        for(int z=0; z<ChunkSize; z++) {
                            BlockPoint pos = new BlockPoint(x, y, z);
                            if(!BorderBlocks.ContainsBlock(pos) && !InnerBlocks.ContainsBlock(pos) && !EmptyBlocks.ContainsBlock(pos) && !TransparentBlocks.ContainsBlock(pos)) {
                                InsertInnerBlock(new Block(pos, DefaultBlockDefinition, Block.NoFaces));
                            }
                        }                        
                    }
                }

                // remove inner blocks, that are new default blocks
                InnerBlocks.RemoveAll(block => block.Definition == newDefaultBlockDefinition);
                DefaultBlockDefinition = newDefaultBlockDefinition;
            }
        }


        public void Validate(RegionPoint regionPos) {
            #if DEBUG
                Log.Info("validate " + this);
            #endif                        
            // validate block lists
            BorderBlocks.ForAll( block => {
                WorldPoint  worldPos = new WorldPoint(regionPos, Position, block.Position);
                Block.Faces faces = DetermineVisibleFaces(worldPos, block.Position);
                Validate( faces == block.BlockFaces, "invalid faces: " + block);
                Validate( faces != Block.NoFaces, "block in border block has no visible faces");
                Validate( block.IsSolid(), "block in border block list is not solid: " + block);
            });
            InnerBlocks.ForAll( block => {
                WorldPoint  worldPos = new WorldPoint(regionPos, Position, block.Position);
                Block.Faces faces = DetermineVisibleFaces(worldPos, block.Position);
                Validate( faces == block.BlockFaces, "invalid faces: " + block);
                Validate( faces == Block.NoFaces, "block in inner block list has faces");
                Validate( block.IsSolid(), "block in inner block list is not solid: " + block);
            });
            TransparentBlocks.ForAll( block => {
                WorldPoint  worldPos = new WorldPoint(regionPos, Position, block.Position);
                Block.Faces faces = DetermineVisibleFaces(worldPos, block.Position);
                Validate( faces == block.BlockFaces, "invalid faces: " + block);
                Validate( block.IsTransparent(), "block in transparent block list is not transparent: " + block);
            });
            EmptyBlocks.ForAll( block => {
                Validate( block.Definition == Block.NoBlock, "block in empty list is not zero: " + block);
            });

            // validate number of blocks
            if(BlockCount < 0 || BlockCount > ChunkVolume) throw new Exception("invalid block count: " + BlockCount);
            if(IsAdditiv()) {
                int blockCount = TransparentBlocks.Size() + BorderBlocks.Size() + InnerBlocks.Size();
                Validate( BlockCount == blockCount, "additiv chunk has corrupted block count: " + this);
                Validate( EmptyBlocks.Size() == 0, "additiv chunk has blocks in EmptyBlocks list: " + this);
            }
            else if(IsSubtractiv()) {
                int blockCount = ChunkVolume - EmptyBlocks.Size();
                Validate( BlockCount == blockCount, "subtractiv chunk has corrupted block count: " + this);
            }
            else {
                Validate( false, "chunk is neither additiv nor subtractiv: " + this);
            }

        }

        private void Validate( bool condition, string message) {
            if( !condition ) throw new Exception(message);
        }

        ///////////////////////////////////////////////////////////////////////////////////////////
        // BlockList accessors
        ///////////////////////////////////////////////////////////////////////////////////////////

        public void InsertTransparentBlock(Block block) {
            if( TransparentBlocks == null) TransparentBlocks = new BlockList();
            TransparentBlocks.Insert(block);
        }        


        public void ReplaceTransparentBlock(Block block) {
            if( TransparentBlocks == null) TransparentBlocks = new BlockList();
            TransparentBlocks.Replace(block);
        }        


        public void InsertBorderBlock(Block block) {
            if( BorderBlocks == null) BorderBlocks = new BlockList();
            BorderBlocks.Insert(block);
        }        


        public void ReplaceBorderBlock(Block block) {
            if( BorderBlocks == null) BorderBlocks = new BlockList();
            BorderBlocks.Replace(block);
        }        


        public void InsertInnerBlock(Block block) {
            Assert(!block.IsTransparent());
            if( InnerBlocks == null) InnerBlocks = new BlockList();
            InnerBlocks.Insert(block);
        }        


        public void InsertEmptyBlock(Block block) {
            if( EmptyBlocks == null) EmptyBlocks = new BlockList();
            EmptyBlocks.Insert(block);
        }   


        ///////////////////////////////////////////////////////////////////////////////////////////
        // BlockList accessors for persister
        ///////////////////////////////////////////////////////////////////////////////////////////

        public void SetTransparentBlockCapacity(int capacity) {
            if(capacity > 0) TransparentBlocks = new BlockList(capacity);
        }

        public void SetBorderBlockCapacity(int capacity) {
            if(capacity > 0) BorderBlocks = new BlockList(capacity);
        }

        public void SetInnerBlockCapacity(int capacity) {
            if(capacity > 0) InnerBlocks = new BlockList(capacity);
        }

        public void SetEmptyBlockCapacity(int capacity) {
            if(capacity > 0) EmptyBlocks = new BlockList(capacity);
        }

        // must only be used for chunk loading! does not maintain list sorting!
        public void AddTransparentBlock(Block block)          => TransparentBlocks.Add(block);
        public void AddBorderBlock(Block block)               => BorderBlocks.Add(block);
        public void AddInnerBlock(Block block)                => InnerBlocks.Add(block);
        public void AddEmptyBlock(Block block)                => EmptyBlocks.Add(block);
        

    }

}