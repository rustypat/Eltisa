namespace Eltisa.Tools; 

using System;
using System.Collections.Generic;
using System.IO;
using Eltisa.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;


public static class Assert {

    public static void AreEqual(Object expected, Object actual, string errorMessage=null) 
    {
        if(errorMessage != null) {
            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.AreEqual(expected, actual, errorMessage); 
        }
        else {
            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.AreEqual(expected, actual); 
        }
    }


    public static void AreEqual<T>(T[] firstArray, T[] secondArray) {
        if(firstArray.Length != secondArray.Length) throw new AssertFailedException("array have differing length");
        EqualityComparer<T> comparer = EqualityComparer<T>.Default;
        for(int i=0; i < firstArray.Length; i++) {
            if(!comparer.Equals(firstArray[i], secondArray[i])) throw new AssertFailedException("arrays have differing content");
        }
    }

    
    public static void AreSame(Object expected, Object actual, string errorMessage=null) 
    {
        if(errorMessage != null) {
            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.AreSame(expected, actual, errorMessage); 
        }
        else {
            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.AreSame(expected, actual); 
        }
    }


    public static void AreNotSame(Object expected, Object actual, string errorMessage=null) 
    {
        if(errorMessage != null) {
            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.AreNotSame(expected, actual, errorMessage); 
        }
        else {
            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.AreNotSame(expected, actual); 
        }
    }


    public static void FiileExists(string file, string errorMessage=null) {
        if(File.Exists(file)) return;
        errorMessage ??= $"file {file} does not exist";
        throw new AssertFailedException(errorMessage);
    }


    public static void FiileExistsNot(string file, string errorMessage=null) {
        if(!File.Exists(file)) return;
        errorMessage ??= $"file {file} does exist";
        throw new AssertFailedException(errorMessage);
    }


    public static void BlockHasFaces(Block block, params Block.Faces[] faces) {
        foreach(var face in faces) {
            if(!block.HasFace(face)) throw new AssertFailedException($"block lacks face {face}");
        }
    }


    public static void BlockHasFacesNot(Block block, params Block.Faces[] faces) {
        foreach(var face in faces) {
            if(block.HasFace(face)) throw new AssertFailedException($"block has face {face} but must not");
        }
    }


    public static void BlockIs(Block block, ushort blockDefinition, string errorMessage=null) {
        if(block.Definition == blockDefinition) return;
        errorMessage ??= $"block is {block.Definition} instead of {blockDefinition}";
        throw new AssertFailedException(errorMessage);
    }


    public static void SizeIs<T>(T[] t, int expectedLength, string errorMessage=null) {
        if(t.Length == expectedLength) return;
        errorMessage ??= $"array length is {t.Length} instead of {expectedLength}";
        throw new AssertFailedException(errorMessage);
    }

}