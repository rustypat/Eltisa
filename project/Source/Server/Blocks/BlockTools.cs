namespace Eltisa.Server.Blocks; 

using System;
using Eltisa.Models;


public readonly record struct Changed(WorldPoint Position, Block Block);


public static class Constants {
    public static readonly Changed[] NoChanges = {};
}