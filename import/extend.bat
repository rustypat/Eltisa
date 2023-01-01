cd ../release

REM fix existing underground
dotnet eltisa.dll create:Cube xFrom:-2048 xTo:2047 yFrom:0 yTo:31 zFrom:-2048 zTo:2047 block:16

REM remove coast
dotnet eltisa.dll clear:Cube xFrom:-2248 xTo:2248  yFrom:32 yTo:300  zFrom:-2248 zTo:-2049
dotnet eltisa.dll clear:Cube xFrom:-2248 xTo:2248  yFrom:32 yTo:300  zFrom:2048  zTo:2248
dotnet eltisa.dll clear:Cube xFrom:-2248 xTo:-2049 yFrom:32 yTo:300  zFrom:-2048 zTo:2047
dotnet eltisa.dll clear:Cube xFrom:2048  xTo:2248  yFrom:32 yTo:300  zFrom:-2048 zTo:2047

REM shift existing island to the upper left
dotnet eltisa.dll shift:World xShift:-2048 zShift:2048

REM import upper right island
dotnet eltisa.dll create:SeaPit xFrom:0 xTo:4095 zFrom:0 zTo:4095 depth:32
dotnet eltisa.dll import:C:\eltisa\import\map xFrom:0 xTo:4095 zFrom:0 zTo:4095 mirrorX mirrorZ
dotnet eltisa.dll create:Cube xFrom:0 xTo:4095 yFrom:0 yTo:31 zFrom:0 zTo:4095 block:16

REM import lower right island
dotnet eltisa.dll create:SeaPit xFrom:0 xTo:4095 zFrom:-4096 zTo:-1 depth:32
dotnet eltisa.dll import:C:\eltisa\import\map xFrom:0 xTo:4095 zFrom:0 zTo:4095 mirrorX zShift:-4096
dotnet eltisa.dll create:Cube xFrom:0 xTo:4095 yFrom:0 yTo:31 zFrom:-4096 zTo:-1 block:16

REM import lower left island
dotnet eltisa.dll create:SeaPit xFrom:-4096 xTo:-1 zFrom:-4096 zTo:-1 depth:32
dotnet eltisa.dll import:C:\eltisa\import\map xFrom:0 xTo:4095 zFrom:0 zTo:4095 xShift:-4096 zShift:-4096
dotnet eltisa.dll create:Cube xFrom:-4096 xTo:-1 yFrom:0 yTo:31 zFrom:-4096 zTo:-1 block:16

REM add coast
dotnet eltisa.dll create:Coast xFrom:-4096 xTo:4095 zFrom:-4096 zTo:4095

::dotnet eltisa.dll validate:World
