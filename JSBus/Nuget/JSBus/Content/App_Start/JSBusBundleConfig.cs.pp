using System;
using System.Web.Optimization;

[assembly: WebActivator.PreApplicationStartMethod(
    typeof($rootnamespace$.App_Start.JSBus), "PreStart")]

namespace $rootnamespace$.App_Start {
    public static class JSBusBundleConfig {
        public static void PreStart() {
            bundles.Add(new ScriptBundle("~/bundles/JSBus").Include(
                "~/Scripts/JSBus/LocalStorageStore.js", 
                "~/Scripts/JSBus/LocalStorageQueue.js",
                "~/Scripts/JSBus/Bus.js")
            );
        }
    }
}