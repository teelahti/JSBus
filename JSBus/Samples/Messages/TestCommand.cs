namespace JSBus.Sample.Messages
{
    public class TestCommand : ICommand
    {
        public string Id { get; set; }

        public string Name { get; set; }
    }
}