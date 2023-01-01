// Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved
using System;
using System.IO;
using System.Diagnostics;

using Eltisa.Source.Administration;

namespace Eltisa.Source.Tools {

    public static class Log {

        private static Stopwatch stopwatch = new Stopwatch();
        private static string    logFile   = null;

        public static void SetLogFile(string _logFile) {
            logFile = _logFile;
        }

        public static void Debug(string message) {
            #if DEBUG  
                Console.WriteLine("DEBUG: " + message);
            #endif              
        }


        public static void Trace(string message) {
            #if DEBUG  
                Console.WriteLine("TRACE: " + message);
            #endif              
        }


        public static void TraceStart(string message) {
            #if DEBUG  
                stopwatch.Restart();
                Console.WriteLine("TRACE start: " + message);
            #endif              
        }


        public static void TraceEnd(string message) {
            #if DEBUG  
                stopwatch.Stop();
                Console.WriteLine("TRACE end: " + message + "    timespan: " + stopwatch.Elapsed);
            #endif              
        }


        public static void Info(string message) {
            Console.WriteLine("INFO : " + message);
            if(logFile != null) {
                using (StreamWriter fileWriter = File.AppendText(logFile)) {
                    fileWriter.WriteLine(Time() + "INFO:  " + message);
                }            
            }
        }


        public static void Warn(string message) {
            Console.WriteLine("WARNING:" + message);
            if(logFile != null) {
                using (StreamWriter fileWriter = File.AppendText(logFile)) {
                    fileWriter.WriteLine(Time() + "WARNING:" + message);
                }            
            }
        }


        public static void Error(string message) {
            Console.WriteLine("ERROR: " + message);
            if(logFile != null) {
                using (StreamWriter fileWriter = File.AppendText(logFile)) {
                    fileWriter.WriteLine(Time() + "ERROR: " + message);
                }            
            }
        }


        public static void Error(Exception e) {
            Console.WriteLine("ERROR: " + e.Message);
            Console.WriteLine(e.StackTrace);
            if(logFile != null) {
                using (StreamWriter fileWriter = File.AppendText(logFile)) {
                    fileWriter.WriteLine(Time() + "ERROR: " + e.Message);
                    fileWriter.WriteLine(e.StackTrace);
                }            
            }
        }


        private static string Time() {
            return DateTime.Now.ToString("dd.MM.yy H:mm:ss ");
        }


    }

}