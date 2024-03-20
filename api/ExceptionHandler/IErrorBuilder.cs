namespace api.ExceptionHandler
{
    public interface IErrorBuilder
    {
        IErrorBuilder AddTags(IDictionary<string, string?> tags);
        void Send();
    }
}