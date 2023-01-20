namespace Eltisa.Source.Server.Blocks; 

using System;
using Eltisa.Source.Models;


public readonly record struct Changed(WorldPoint Position, Block Block);


public static class Constants {
    public static readonly Changed[] NoChanges = {};
}