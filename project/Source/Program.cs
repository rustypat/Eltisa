namespace Eltisa.Source; 
using System;
using System.IO;
using System.Linq;

using Eltisa.Source.Administration;
using Eltisa.Source.Server;
using Eltisa.Source.Tools;
using Eltisa.Source.Models;
using static Eltisa.Source.Tools.ArgumentsExtensions;


public static class Program  {

    public static void Main(string[] args)  {        
        Log.Info("Eltisa " + Configuration.Version + "  " + Configuration.VersionType);
        
        if( args.Length == 0 ) {
            // start Eltisa web server game
            Console.CancelKeyPress     += delegate { WebHost.Stop(); };
            Configuration.Read(Configuration.ConfigFile);
            CitizenStore.ReadCitizen();
            Log.SetLogFile(Configuration.LogFile);
            WebHost.Start();
        }
        else if( args.Has("import") ) {
            // import a world (-part) from a mindcraft file
            string mcWorlDirectory = args.Get("import");
            int    xFrom           = args.GetInt("xFrom", int.MinValue);
            int    xTo             = args.GetInt("xTo", int.MaxValue);
            int    zFrom           = args.GetInt("zFrom", int.MinValue);
            int    zTo             = args.GetInt("zTo", int.MaxValue);
            int    xShift          = args.GetInt("xShift", 0);
            int    yShift          = args.GetInt("yShift", 0);
            int    zShift          = args.GetInt("zShift", 0);

            var importer = new McImporter(mcWorlDirectory);
            importer.Borders(xFrom, xTo, zFrom, zTo);
            importer.Shift(xShift, yShift, zShift);
            if( args.Contains("mirrorX") ) importer.MirrorInXDirection();
            if( args.Contains("mirrorZ") ) importer.MirrorInZDirection();
            importer.ImportMcMap();
            importer.AdjustBlocks();
            WorldAdmin.Store();
        }
        else if( args.Get("create", "") == "SeaPit" ) {
            // create a hole in the sea 
            int    xFrom           = args.GetInt("xFrom");
            int    xTo             = args.GetInt("xTo");
            int    zFrom           = args.GetInt("zFrom");
            int    zTo             = args.GetInt("zTo");
            int    depth           = args.GetInt("depth");
            WorldAdmin.CreateSeaPit(xFrom, xTo, zFrom, zTo, depth);
            WorldAdmin.Store();
        }
        else if( args.Get("create", "") == "Coast" ) {
            // create a coast line around a square island
            int    xFrom           = args.GetInt("xFrom");
            int    xTo             = args.GetInt("xTo");
            int    zFrom           = args.GetInt("zFrom");
            int    zTo             = args.GetInt("zTo");
            WorldAdmin.CreateCoast(xFrom, xTo, zFrom, zTo);
            WorldAdmin.Store();
        }
        else if( args.Get("create", "") == "Planet" ) {
            // create a planet ( a sphere)
            int    xCenter         = args.GetInt("xCenter");
            int    yCenter         = args.GetInt("yCenter");
            int    zCenter         = args.GetInt("zCenter");
            int    radius          = args.GetInt("radius");
            int    radiusInner     = args.GetInt("radiusInner", 0);
            int    radiusCore      = args.GetInt("radiusCore", 0);
            ushort block           = args.GetUshort("block", Block.Stone_2);
            WorldAdmin.CreatePlanet(xCenter, yCenter, zCenter, radius, radiusInner, radiusCore, block);   // recommendation for radius 50,30,6 or 100,0,0
            WorldAdmin.Store();
        }
        else if( args.Get("create", "") == "Cube" ) {
            // create a cube
            int    xFrom           = args.GetInt("xFrom");
            int    xTo             = args.GetInt("xTo");
            int    yFrom           = args.GetInt("yFrom");
            int    yTo             = args.GetInt("yTo");
            int    zFrom           = args.GetInt("zFrom");
            int    zTo             = args.GetInt("zTo");
            ushort block           = args.GetUshort("block");
            WorldAdmin.CreateCube(xFrom, xTo, yFrom, yTo, zFrom, zTo, block);
            WorldAdmin.Store();
        }
        else if( args.Get("clear", "") == "Cube" ) {
            // delete a cubic region
            int    xFrom           = args.GetInt("xFrom");
            int    xTo             = args.GetInt("xTo");
            int    yFrom           = args.GetInt("yFrom");
            int    yTo             = args.GetInt("yTo");
            int    zFrom           = args.GetInt("zFrom");
            int    zTo             = args.GetInt("zTo");
            WorldAdmin.ClearCube(xFrom, xTo, yFrom, yTo, zFrom, zTo);
            WorldAdmin.Store();
        }
        else if( args.Get("shift", "") == "World" ) {
            // move the whole world by an offset
            int    xShift          = args.GetInt("xShift");
            int    zShift          = args.GetInt("zShift");
            WorldAdmin.ShiftWorld(xShift, zShift);
        }
        else if( args.Get("validate", "") == "World" ) {
            // validate, if the stored blocks are still consistent
            WorldAdmin.ValidateWorld();
        }
        else {
            Log.Info("unknown argument, possible arguments are");
            Log.Info("  import:MC_MAP_DIRECTORY xFrom:INT xTo:INT zFrom:INT zTo:INT (xShift:INT) (yShift:INT) (zShift:INT) (mirrorX) (mirrorZ)");
            Log.Info("  shift:World xShift:INT zShift:INT");
            Log.Info("  validate:World");
            Log.Info("  create:SeaPit xFrom:INT xTo:INT zFrom:INT zTo:INT depth:INT");
            Log.Info("  create:Coast xFrom:INT xTo:INT zFrom:INT zTo:INT ");
            Log.Info("  create:Planet xCenter:INT yCenter:INT zCenter:INT radius:INT (radiusInner:INT) (radiusCore:INT) (block:USHORT)");
            Log.Info("  create:Cube xFrom:INT xTo:INT yFrom:INT yTo:INT zFrom:INT zTo:INT block:INT");
            Log.Info("no arguments starts server");
            Log.Info("WARNING: misspelled optional arguments are ignored!");
        }
    }

}

