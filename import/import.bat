cd ../release

:: import ships
dotnet eltisa.dll create:SeaPit xFrom:-524 xTo:400 zFrom:300 zTo:700 depth:16
dotnet eltisa.dll import:C:\develop\eltisa\import\mapShips xFrom:-1024 xTo:-100 zFrom:-700 zTo:-300 xShift:500 yShift:-39 zShift:1000

exit

:: import small world
dotnet eltisa.dll create:SeaPit xFrom:0 xTo:511 zFrom:0 zTo:511 depth:32
dotnet eltisa.dll import:C:\develop\eltisa\import\mapSmallWorld xFrom:0 xTo:511 zFrom:0 zTo:511 xShift:0 zShift:0
dotnet eltisa.dll create:Cube xFrom:0 xTo:511 yFrom:0 yTo:32 zFrom:0 zTo:511 block:16




