namespace JSBus.Sample
{
    using System;
    using System.Globalization;
    using System.Threading.Tasks;

    using JSBus.Sample.Messages;

    using Microsoft.AspNet.SignalR;
    using Microsoft.AspNet.SignalR.Hubs;

    [HubName("sample")]
    public class JSBusTestHub : Hub
    {
        private readonly Random randomWait = new Random();

        public Task Execute(TestCommand command)
        {
            // TODO: Should check whether this command has already been received 
            // TODO: Store the message in a message store
            // Acknowledge caller that we have this message persisted
            this.Clients.Caller.ack(command.Id);

            // In reality should find the correct handler for 
            // given command name and give the command to that class
            return Task.Factory.StartNew(
                () => { this.Process(command, this.Clients.Caller); });
        }

        private async void Process(TestCommand command, dynamic client)
        {
            // Wait a random time, max 5 s
            int delay = this.randomWait.Next(5000);

            await Task.Delay(delay);

            // Notify listener about success
            var reply = new TestEvent
            {
                Id = command.Id,
                Name = "TestEvent",
                Answer = "Executed with delay " + delay.ToString(CultureInfo.CurrentCulture)
            };

            client.onEvent(reply);
        }
    }
}