namespace Eltisa.Models; 

using System;
using System.Collections.Generic;
using static System.Diagnostics.Debug;


class BlockPositionComparer : IComparer<Block> {
    public int Compare(Block a, Block b)  =>  a.ComparePosition(b);  
}


public class BlockList: List<Block> {

    public BlockList() {}
    public BlockList(int capacity): base(capacity) { }

    private static readonly BlockPositionComparer positionComparer = new BlockPositionComparer();

    public void Insert(Block block) {
        var index = BinarySearch(block, positionComparer);
        if (index < 0) {
            index = ~index;
            Insert(index, block);
        }
        else {
            throw new Exception("list already contains block " + block.Position);
        }
    }


    public void Replace(Block block) {
        var index = BinarySearch(block, positionComparer);
        if (index >= 0) {
            this[index] = block;
        }
        else {
            throw new Exception("list contains no block at " + block.Position);
        }
    }


    // ignores the block type, checks only for the position
    public new void Remove(Block block) {
        var index = BinarySearch(block, positionComparer);
        if (index >= 0) {
            this.RemoveAt(index);
        }
        else {
            throw new Exception("list contains no block at " + block.Position);
        }
    }


    public Block Get(int i) {
        return this[i];
    }


    public void Set(int i, Block block) {
        this[i] = block;
    }

}


public static class BlockListExtensions {

    private static readonly BlockPositionComparer comparer       = new BlockPositionComparer();
    private static readonly BlockList             emptyBlockList = new BlockList();

    public static int Size(this BlockList blockList) {
        if(blockList == null)  return 0;

        return blockList.Count;
    }


    public static bool ContainsBlock(this BlockList blockList, BlockPoint blockPosition) {
        if(blockList == null) return false;

        Block descrBlock = new Block(blockPosition);
        return blockList.BinarySearch(descrBlock, comparer) >= 0;                
    }


    public static Block GetBlock(this BlockList blockList, BlockPoint blockPosition) {
        if(blockList == null) return BlockDescription.NoBlock;

        Block descrBlock = new Block(blockPosition);
        int pos = blockList.BinarySearch(descrBlock, comparer);                
        if(pos >= 0) return blockList[pos];
        else         return BlockDescription.NoBlock;
    }


    public static int FindIndexOfBlock(this BlockList blockList, BlockPoint blockPosition) {
        if(blockList == null) return -1;

        Block descrBlock = new Block(blockPosition);
        return blockList.BinarySearch(descrBlock, comparer);                
    }


    public static Block RemoveBlock(this BlockList blockList, BlockPoint blockPosition) {
        if(blockList == null) return BlockDescription.NoBlock;

        Block descrBlock = new Block(blockPosition);
        int i = blockList.BinarySearch(descrBlock, comparer);
        if(i >= 0) {
            Block removedBlock = blockList[i];           
            blockList.RemoveAt(i);
            Assert(removedBlock.IsBlock());
            return removedBlock;
        }
        else {
            return BlockDescription.NoBlock;
        }
    }


    // returns the block at blockPosition after adding face
    public static Block AddFace(this BlockList blockList, BlockPoint blockPosition, Block.Faces face) {
        if(blockList == null) return BlockDescription.NoBlock;

        Block descrBlock = new Block(blockPosition);
        int i = blockList.BinarySearch(descrBlock, comparer);
        if(i >= 0) {
            Block block = blockList[i];
            block.AddFace(face);
            blockList[i] = block;
            return block;
        }
        else {
            return BlockDescription.NoBlock;
        }
    }


    // returns the block at blockPosition after removing face
    public static Block RemoveFace(this BlockList blockList, BlockPoint blockPosition, Block.Faces face) {
        if(blockList == null) return BlockDescription.NoBlock;

        Block descrBlock = new Block(blockPosition);
        int i = blockList.BinarySearch(descrBlock, comparer);
        if(i >= 0) {
            Block block = blockList[i];
            block.RemoveFace(face);
            blockList[i] = block;
            return block;
        }
        else {
            return BlockDescription.NoBlock;
        }
    }


    public static IEnumerable<Block> GetBlocks(this BlockList blockList) {
        if(blockList == null) {
            return emptyBlockList;
        }
        else                  {
            return blockList;                
        }            
    }


}