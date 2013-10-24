namespace JSBus.App_Start
{
    using Owin;

    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Register the default hubs route: ~/signalr/hubs
            app.MapSignalR();
        }
    }
}
