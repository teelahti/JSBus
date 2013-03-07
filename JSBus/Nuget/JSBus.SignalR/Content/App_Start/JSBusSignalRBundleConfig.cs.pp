using System;
using System.Web.Optimization;

[assembly: WebActivator.PreApplicationStartMethod(
    typeof($rootnamespace$.App_Start.JSBusSignalR), "PreStart")]

namespace $rootnamespace$.App_Start {
    public static class JSBusSignalRBundleConfig {
        public static void PreStart() {
            bundles.Add(new ScriptBundle("~/bundles/JSBusSignalR").Include(
                "~/Scripts/JSBus.SignalR/SignalRSendTransport.js",
                "~/Scripts/JSBus.SignalR/SignalRSubscribeTransport.js")
            );
        }
    }
}