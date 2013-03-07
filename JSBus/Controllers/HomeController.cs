using System.Web.Mvc;

namespace JSBus.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return this.Redirect("~/Sample/");
        }
    }
}
