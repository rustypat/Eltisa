namespace Eltisa.Tools;

using System;



/// <summary>
/// This class provides extensions to read out parameters from command line arguments.
/// Usualy they take the form NAME:VALUE
/// </summary>
public static class ArgumentsExtensions 
{
    ///////////////////////////////////////////////////////////////////////////////////////////
    // comand line arguments access
    ///////////////////////////////////////////////////////////////////////////////////////////


    static public bool Has(this string[] args, string argumentName) {
        if( args == null ) {
            return false;
        }
        foreach( var s in args ) {
            if( s.StartsWith(argumentName )) {
                return true;
            }
        }
        return false;
    }


    static public string Get(this string[] args, string argumentName) {
        if( args == null ) {
            throw new Exception("required attribute " + argumentName + " is missing");
        }
        foreach( var s in args ) {
            if (s.StartsWith(argumentName + ":")) {
                return s.TrimStart(argumentName + ":").Trim();
            }
        }
        throw new Exception("required attribute " + argumentName + " is missing");
    }


    static public string Get(this string[] args, string argumentName, string defaultValue) {
        if( args == null ) {
            return defaultValue;
        }
        foreach( var s in args ) {
            if( s.StartsWith(argumentName + ":") ) {
                return s.TrimStart(argumentName + ":").Trim();
            }
        }
        return defaultValue;
    }


    static public int GetInt(this string[] args, string argumentName, int defaultValue) {
        if( args == null ) {
            return defaultValue;
        }
        foreach( var s in args ) {
            if( s.StartsWith(argumentName + ":") ) {
                string value = s.TrimStart(argumentName + ":").Trim();
                return int.Parse(value);
            }
        }
        return defaultValue;
    }


    static public int GetInt(this string[] args, string argumentName) {
        if( args == null ) {
            throw new Exception("required attribute " + argumentName + " is missing");
        }
        foreach( var s in args ) {
            if (s.StartsWith(argumentName + ":")) {
                string value = s.TrimStart(argumentName + ":").Trim();
                return int.Parse(value);
            }
        }
        throw new Exception("required attribute " + argumentName + " is missing");
    }


    static public ushort GetUshort(this string[] args, string argumentName, ushort defaultValue) {
        if( args == null ) {
            return defaultValue;
        }
        foreach( var s in args ) {
            if( s.StartsWith(argumentName + ":") ) {
                string value = s.TrimStart(argumentName + ":").Trim();
                return ushort.Parse(value);
            }
        }
        return defaultValue;
    }


    static public ushort GetUshort(this string[] args, string argumentName) {
        if( args == null ) {
            throw new Exception("required attribute " + argumentName + " is missing");
        }
        foreach( var s in args ) {
            if( s.StartsWith(argumentName + ":") ) {
                string value = s.TrimStart(argumentName + ":").Trim();
                return ushort.Parse(value);
            }
        }
        throw new Exception("required attribute " + argumentName + " is missing");
    }

}