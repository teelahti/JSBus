namespace JSBus.App_Start
{
    using System.Web.Optimization;

    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/JSBus").Include(
                "~/Scripts/JSBus/LocalStorageStore.js", 
                "~/Scripts/JSBus/LocalStorageQueue.js",
                "~/Scripts/JSBus/Bus.js")
            );

            bundles.Add(new ScriptBundle("~/bundles/JSBusSignalR").Include(
                "~/Scripts/JSBus.SignalR/SignalRSendTransport.js",
                "~/Scripts/JSBus.SignalR/SignalRSubscribeTransport.js")
            );
        }
    }
}