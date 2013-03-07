using System.Web.Routing;
using System.Web.Optimization;

[assembly: WebActivator.PreApplicationStartMethod(
    typeof($rootnamespace$.App_Start.RegisterSample), "PreStart")]

[assembly: WebActivator.PostApplicationStartMethod(
    typeof($rootnamespace$.App_Start.RegisterSample), "PostStart")]

namespace $rootnamespace$.App_Start {
    public static class RegisterSample {
        public static void PreStart() {
            // Register the default hubs route: ~/signalr/hubs
            RouteTable.Routes.MapHubs();
        }

        public static void PostStart() {
            BundleTable.Bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));
        }
    }
}