// Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved
using System;


namespace Eltisa.Source.Tools {

    public static class StringExtensions {

        public static string LimitLength(this string str, int maxLength) {
            return str.Length <= maxLength ? str : str.Substring(0, maxLength-3) + "...";
        }


        public static string Substring(this string source, char beginDelimiter, char endDelimiter) {
            int i = source.IndexOf(beginDelimiter);
            int j = source.IndexOf(endDelimiter);
            if( i < 0 ) return null;
            if( j < 0 ) return null;
            return source.Substring(i+1, j);
        }


        static public String TrimStart(this String str, params String[] startStrings) {
            if(str == null ) { return str; }
            foreach (var startString in startStrings) {
                if (str.StartsWith(startString)) {
                    return str.Substring(startString.Length); 
                }
            }
            return str;
        }


        static public String TrimEnd(this String str, params String[] endStrings) {
            if(str == null ) { return str; }
            foreach (var endString in endStrings) {
                if (str.EndsWith(endString)) {
                    return str.Remove(str.Length - endString.Length); 
                }
            }
            return str;
        }


    }

}