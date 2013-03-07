namespace JSBus.Sample.Messages
{
    public class TestEvent : ICommand
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Answer { get; set; }        
    }
}