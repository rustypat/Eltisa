using System;
using System.IO;
using System.Text;
using System.Xml;
using System.Xml.Serialization;
using System.Collections.Generic;
using static System.String;
using static System.Diagnostics.Debug;

using Eltisa.Source.Models;
using Eltisa.Source.Communication;
using static Eltisa.Source.Tools.Tools;
using static Eltisa.Source.Tools.StringExtensions;
using static Eltisa.Source.Administration.Configuration;


namespace Eltisa.Source.Administration {

    public enum RunMode { Develop, Server, Eltisa };

    public static class Configuration {

        public const string Version              = "0.25";

        #if DEBUG
            public const string VersionType      = "Debug";
            public const string RegionDirectory  = "C:\\develop\\eltisa\\regions\\";
            public const string ResourceDirectory= "C:\\develop\\eltisa\\resources\\";
            public const string LogFile          = "C:\\develop\\eltisa\\rundata\\log.txt";
            public const string CitizenFile      = "C:\\develop\\eltisa\\rundata\\citizen.xml";
            public const string ConfigFile       = "C:\\develop\\eltisa\\rundata\\config.xml";
        #else
            public const string VersionType      = "Release";
            public const string RegionDirectory  = "..\\regions\\";
            public const string ResourceDirectory= "..\\resources\\";
            public const string LogFile          = "..\\rundata\\log.txt";
            public const string CitizenFile      = "..\\rundata\\citizen.xml";
            public const string ConfigFile       = "..\\rundata\\config.xml";
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


}