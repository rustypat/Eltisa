// Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved
using System;



namespace Eltisa.Source.Tools {


    public static class FunctionalPlayground {


        public static Func<string, Action<string>> SayCurry = a => b => { Console.WriteLine(a + " " + b); };

        public static Func<int, Func<int, Func<int, int>>> Multiply = a => b => c => a*b*c;
        
        public static void Run() {
            SayCurry("Hello")("World");

            var hello = SayCurry("Hello");
            hello("Sam");

            var scale = Multiply(10)(11);
            Console.WriteLine( scale(12) );
        }        

    }
    

}