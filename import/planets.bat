cd ../release

:: import small map
dotnet eltisa.dll create:Planet xCenter:4000 yCenter:13500 zCenter:4000 radius:150 radiusInner:50 radiusCore:10
dotnet eltisa.dll create:Planet xCenter:4100 yCenter:13700 zCenter:4000 radius:10 block:17
dotnet eltisa.dll create:Planet xCenter:4100 yCenter:13680 zCenter:3900 radius:15 block:10
dotnet eltisa.dll create:Planet xCenter:4000 yCenter:13750 zCenter:4100 radius:50 radiusInner:30 radiusCore:7 block:662
