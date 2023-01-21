namespace Eltisa.Tools; 

using System;
using System.IO;

public static class Computer {

    public static void DeleteDirectory(string path) {
        if(!Directory.Exists(path)) return;
        Directory.Delete(path, true);
    }

}