namespace Eltisa.Models; 

using System;
using Eltisa.Models;


public readonly record struct Change(WorldPoint Position, Block Block);


public static class Constants {
    public static readonly Change[] NoChanges = {};
}