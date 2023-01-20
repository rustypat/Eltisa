namespace Eltisa.Communication; 

using System;
using Microsoft.AspNetCore.Mvc;

public class HomeController : Controller  {

    public IActionResult Info() {
        return View();
    }

    public string Index() {
        return "This is the default action for the HomeController";
    }
    
}

