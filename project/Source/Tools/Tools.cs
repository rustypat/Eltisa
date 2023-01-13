namespace Eltisa.Source.Tools; 

using System;


public static class Tools {

    public static int ToCube(int num) {
        return num * num * num;
    }


    public static bool IsOneOf(this int i, params int[] values) {
        foreach (var v in values) {
            if (i == v) {
                return true;
            }
        }
        return false;
    }


    // mathematical modulo, in contrast to % returns always a positiv result
    public static int Modulo(this int dividend, int divisor) {
         return ((dividend % divisor) + divisor) % divisor;
    }

}