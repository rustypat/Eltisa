// Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved
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



namespace Eltisa.Source.Server {

    public static class CitizenStore {
        private static Dictionary<string, Citizen> members       = new Dictionary<string, Citizen>();


        public static void WriteCitizen() {
            List<Citizen> citizens = new List<Citizen>();
            citizens.AddRange(members.Values);
            
            var emptyNamepsaces        = new XmlSerializerNamespaces(new[] { XmlQualifiedName.Empty });
            var settings               = new XmlWriterSettings();
            settings.Indent            = true;
            settings.OmitXmlDeclaration= true;

            var serializer             = new System.Xml.Serialization.XmlSerializer(typeof(List<Citizen>));  
            using(FileStream fileStream = File.Open(CitizenFile, FileMode.Create, FileAccess.Write)) {
                var writer = XmlWriter.Create(fileStream, settings);  
                serializer.Serialize(writer, citizens, emptyNamepsaces);
                writer.Close();
            }
        }


        public static void ReadCitizen() {
            List<Citizen> citizens;

            var serializer             = new System.Xml.Serialization.XmlSerializer(typeof(List<Citizen>));  
            using(FileStream fileStream = File.Open(CitizenFile, FileMode.Open, FileAccess.Read)) {
                var reader = XmlReader.Create(fileStream);  
                citizens = (List<Citizen>)serializer.Deserialize(reader);
                reader.Close();
            }

            foreach(var citizen in citizens) {
                members.Add(citizen.Name, citizen);
            }
        }


        private static void AddCitizen(string name, string password, int color, Actor.Type actorType=Actor.Type.Citizen) {
            Citizen citizen = new Citizen(name, password, actorType, color);
            members.Add(citizen.Name, citizen);
        }


        public static Citizen GetCitizen(string name) {
            Citizen citizen;
            members.TryGetValue(name, out citizen);   
            return citizen;         
        }



    }

}