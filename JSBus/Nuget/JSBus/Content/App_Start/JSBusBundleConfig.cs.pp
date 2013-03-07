using System.Web.Optimization;

[assembly: WebActivator.PostApplicationStartMethod(
    typeof($rootnamespace$.App_Start.JSBusBundleConfig), "PostStart")]

namespace $rootnamespace$.App_Start {
    public static class JSBusBundleConfig {
        public static void PostStart() {
            BundleTable.Bundles.Add(new ScriptBundle("~/bundles/JSBus").Include(
                "~/Scripts/JSBus/LocalStorageStore.js", 
                "~/Scripts/JSBus/LocalStorageQueue.js",
                "~/Scripts/JSBus/Bus.js")
            );
        }
    }
}