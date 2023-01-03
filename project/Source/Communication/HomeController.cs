using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Eltisa.Source.Communication {

    public class HomeController : Controller  {

        public IActionResult Info() {
            return View();
        }

        public string Index() {
            return "This is the default action for the HomeController";
        }
        
    }
    
}
