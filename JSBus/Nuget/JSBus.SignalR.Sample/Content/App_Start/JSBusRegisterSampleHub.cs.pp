using System.Web.Routing;

[assembly: WebActivator.PreApplicationStartMethod(
    typeof($rootnamespace$.App_Start.RegisterSampleHub), "PreStart")]

namespace $rootnamespace$.App_Start {
    public static class RegisterSampleHub {
        public static void PreStart() {
            // Register the default hubs route: ~/signalr/hubs
            RouteTable.Routes.MapHubs();
        }
    }
}