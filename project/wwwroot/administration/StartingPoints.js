'use strict';


const StartingPoints = new function() {

    const self                    = this;

    this.visitors                 = [];
    this.citizen                  = [];
    this.currentPosition          = createStartingPoint("", NaN, NaN, NaN);
    
    this.getStartingPoint = function(startingPointName, player) {
        if(player.isVisitor()) {
            const startingPoint = self.visitors.find( sp => sp.name == startingPointName);
            if(startingPoint) return startingPoint;
            else              return self.visitors[0];
        }
        else {
            const startingPoint = self.citizen.find( sp => sp.name == startingPointName);
            if(startingPoint) return startingPoint;
            else              return self.citizen[0];            
        }
    }


    initializeStartingPoints();
    
    function createStartingPoint(name, x, y, z) {
        const startingPoint       = {};
        startingPoint.name        = name;
        startingPoint.x           = x;
        startingPoint.y           = y;
        startingPoint.z           = z;
        startingPoint.toString    = function() { return this.name; }
        return startingPoint;
    }
    
    
    function addVisitorStartingPoint(name, x, y, z) {
        const startingPoint = createStartingPoint(name, x, y, z);
        self.visitors.push(startingPoint);
    }
    
    
    function addCitizenStartingPoint(name, x, y, z) {
        const startingPoint = createStartingPoint(name, x, y, z);
        self.citizen.push(startingPoint);
    }
    
    
    function initializeStartingPoints() {    
        addCitizenStartingPoint( "Bonstetten",       -150-2048, 140, -250+2048);
        addCitizenStartingPoint( "Lake",             -1000-2048, 100, 800+2048);
        addCitizenStartingPoint( "Ice Lake",         900-2048, 100, -700+2048);
        addCitizenStartingPoint( "River Delta",      -4000, 100, 4000 );
        addCitizenStartingPoint( "Plain",            -1000, 200, 3000);
        addCitizenStartingPoint( "Pillar Mountains", -2048, 250, 3300);
        addCitizenStartingPoint( "Center",           -150, 200, -250);
        addCitizenStartingPoint( "Space",            4000, 14000, 4000);        

        addVisitorStartingPoint( "Bonstetten",       +150+2048, 140, -250+2048);
        addVisitorStartingPoint( "Lake",             +1000+2048, 100, 800+2048);
        addVisitorStartingPoint( "Ice Lake",         -900+2048, 100, -700+2048);
        addVisitorStartingPoint( "River Delta",      4000, 100, 4000 );
        addVisitorStartingPoint( "Plain",            1000, 200, 3000);
        addVisitorStartingPoint( "Pillar Mountains", 2048, 250, 3300);
        addVisitorStartingPoint( "Center",           150, 200, 250);
        addVisitorStartingPoint( "Space",            4000, 14000, 4000);
        
        // starting points for test world
        // addCitizenStartingPoint( "Center",           0, 140, 0);
        // addCitizenStartingPoint( "Space",            4000, 14000, 4000);
        // addVisitorStartingPoint( "Center",           0, 140, 0);
        // addVisitorStartingPoint( "Space",            4000, 14000, 4000);                
    }
    

}






