namespace JSBus.Sample.Messages
{
    public interface ICommand
    {
        string Id { get; set; }
        string Name { get; set; }
    }
}