namespace Eltisa.Tools; 

using System;
using System.Collections.Generic;


public static class Extensions {

    public static T Find<T>(this List<T> list, Predicate<T> matchCondition) {
        if( list == null) return default(T);
        int i = list.FindIndex(b => matchCondition(b));
        if(i > 0) {
            return list[i];      
        }
        else {
            return default(T);
        }      
    }


    // this is a null pointer save ForEach method
    public static void ForAll<T>(this List<T> list, Action<T>  action) {
        if( list==null ) return;
        list.ForEach(action);
    }


    public static byte Reverse(this byte inByte)   {
        byte result = 0x00;
    
        for (byte mask = 0x80; Convert.ToInt32(mask) > 0; mask >>= 1)  {
            // shift right current result
            result = (byte) (result >> 1);
    
            // tempbyte = 1 if there is a 1 in the current position
            var tempbyte = (byte)(inByte & mask);
            if (tempbyte != 0x00)  {
                // Insert a 1 in the left
                result = (byte) (result | 0x80);
            }
        }
    
        return (result);
    }        


    public static bool IsOneOf<T>(this T valueToMatch, params T[] values) {
        foreach(var value in values) {
            if( valueToMatch.Equals(value) ) return true;
        }
        return false;
    }


    public static T[] Add<T>(this T[] oldArray, T value) {
        T[] newArray = new T[oldArray.Length + 1];
        Array.Copy(oldArray, newArray, oldArray.Length);
        newArray[^1] = value;
        return newArray;
    }



}