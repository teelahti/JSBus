
using JSBus.App_Start;

[assembly: WebActivator.PreApplicationStartMethod(typeof(RegisterHubs), "Start")]

namespace JSBus.App_Start
{
    using System.Web.Routing;

    public static class RegisterHubs
    {
        public static void Start()
        {
            // Register the default hubs route: ~/signalr/hubs
            RouteTable.Routes.MapHubs();
        }
    }
}
