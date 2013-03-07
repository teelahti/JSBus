using System.Web.Optimization;

[assembly: WebActivator.PostApplicationStartMethod(
    typeof($rootnamespace$.App_Start.JSBusSignalRBundleConfig), "PostStart")]

namespace $rootnamespace$.App_Start {
    public static class JSBusSignalRBundleConfig {
        public static void PostStart() {
            BundleTable.Bundles.Add(new ScriptBundle("~/bundles/JSBusSignalR").Include(
                "~/Scripts/JSBus/SignalRSendTransport.js",
                "~/Scripts/JSBus/SignalRSubscribeTransport.js")
            );
        }
    }
}