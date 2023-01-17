namespace Eltisa.Source.Tools; 

using System;
using System.IO;
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
}