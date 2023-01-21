namespace Eltisa.Administration; 

using System;
using System.IO;
using System.Text;
using System.Xml;
using System.Linq;
using System.Xml.Serialization;
using static System.IO.Directory;
using static Eltisa.Tools.StringExtensions;

public enum RunMode { Develop, Server, Eltisa };

public static class Configuration {

    public const string Version              = "0.27";

    public const string DataDirectoryName    = "worldData";

    public static readonly string DataDirectory        = FindWorldDataDirectory();
    public static readonly string RegionDirectory      = DataDirectory + "regions\\";
    public static readonly string ResourceDirectory    = DataDirectory + "resources\\";
    public static readonly string LogFile              = DataDirectory + "rundata\\log.txt";
    public static readonly string CitizenFile          = DataDirectory + "rundata\\citizen.xml";
    public static readonly string ConfigFile           = DataDirectory + "rundata\\config.xml";

    #if DEBUG
        public const string VersionType      = "Debug";
    #else
        public const string VersionType      = "Release";
    #endif

    public const int RegionSize              = 16;
    public const int ChunkSize               = 16;
    public const int ChunkVolume             = ChunkSize * ChunkSize * ChunkSize;

    public const int RegionRadius            = 2048;
    public const int RegionRadiusVertical    = 64;
    public const int ChunkRadius             = RegionRadius * RegionSize; 
    public const int ChunkRadiusVertical     = RegionRadiusVertical * RegionSize;
    public const int WorldRadius             = ChunkRadius * ChunkSize;
    public const int WorldRadiusVertical     = ChunkRadiusVertical * ChunkSize;

    public const int ClientCacheRadius       = 1;                // in regions
    public const int ClientCacheBlockRadius  = 32 * 16;          // maximal 32 chunks with 16 blocks = 512
    public const int WebSocketBufferSize     = 256 * 1024;
    public const int MaxSwitches             = 5;

    public static string CertificateName          { get; private set; }
    public static int MaxVisitors                 { get; private set; }
    public static int MaxStoredChatMessages       { get; private set; }
    public static int WebSocketKeepAliveSeconds   { get; private set; }
    public static int RegionReleaseTime           { get; private set; }
    public static int RegionStoreTime             { get; private set; }
    public static RunMode Mode                    { get; private set; }

    public static string GetDescription() {
        StringBuilder sb = new StringBuilder();
        sb.AppendLine();
        sb.AppendLine("Eltisa Server " + Version + ", " + VersionType);
        return sb.ToString();
    }


    public static void Read(string configFile) {
        Config config;

        if( File.Exists(configFile) ) {
            config = Config.Read(configFile);
        }
        else {
            config = new Config();
            config.Write(configFile);
        }

        CertificateName            = config.CertificateName;
        MaxVisitors                = config.MaxVisitors;
        MaxStoredChatMessages      = config.MaxStoredChatMessages;
        WebSocketKeepAliveSeconds  = config.WebSocketKeepAliveSeconds;
        RegionReleaseTime          = config.RegionReleaseTime;
        RegionStoreTime            = config.RegionStoreTime;

        #pragma warning disable
        if( VersionType == "Develop" )  Mode = RunMode.Develop;
        else                            Mode = config.Mode;
        #pragma warning restore
    }


    public static string FindWorldDataDirectory()
    {
        var path = Environment.CurrentDirectory;

        do
        {
            if(EnumerateDirectories(path).Any(d => d.EndsWith(DataDirectoryName))) 
            {
                Console.Out.WriteLine("found worldData directory in " + path);
                return path + "\\" + DataDirectoryName + "\\";
            }
            path = GetParent(path).FullName;
        }while(path.IsDefined());

        Console.Out.WriteLine("could not find worldData directory!");
        Environment.Exit(1);
        return null;
    }
}


public class Config {

    public string   CertificateName            = "localhost";
    public int      MaxVisitors                = 100;
    public int      MaxStoredChatMessages      = 100;
    public int      WebSocketKeepAliveSeconds  = 120;
    public int      RegionReleaseTime          = 1800 * 1000;      // release a region if unused for more than half an hour
    public int      RegionStoreTime            = 3600 * 1000;      // store changes each hour
    public RunMode  Mode                       = RunMode.Server;


    public void Write(string fileName) {
        var emptyNamepsaces        = new XmlSerializerNamespaces(new[] { XmlQualifiedName.Empty });
        var settings               = new XmlWriterSettings();
        settings.Indent            = true;
        settings.OmitXmlDeclaration= true;

        var serializer             = new System.Xml.Serialization.XmlSerializer(typeof(Config));  
        using(FileStream fileStream = File.Open(fileName, FileMode.Create, FileAccess.Write)) {
            var writer = XmlWriter.Create(fileStream, settings);  
            serializer.Serialize(writer, this, emptyNamepsaces);
            writer.Close();
        }
    }


    public static Config Read(string fileName) {
        Config config;
        var serializer             = new System.Xml.Serialization.XmlSerializer(typeof(Config));              
        using(FileStream fileStream = File.Open(fileName, FileMode.Open, FileAccess.Read)) {
            var reader = XmlReader.Create(fileStream);  
            config = (Config)serializer.Deserialize(reader);
            reader.Close();
        }
        return config;
    }

}