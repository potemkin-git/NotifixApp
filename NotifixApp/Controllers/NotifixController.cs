using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using NotifixApp.Models;

namespace NotifixApp.Controllers
{
    [EnableCors("AllowAll")]
    public class NotifixController : Controller
    {

        [Route("/")]
        public IActionResult Index()
        {
            return View();
        }

        [Route("/map")]
        public IActionResult Map()
        {
            return View();
        }

        [Route("/Settings")]
        public IActionResult Settings()
        {
            return View();
        }

        [Route("/Password")]
        public IActionResult Password()
        {
            return View();
        }

    }
}
