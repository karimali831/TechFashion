namespace api.ExceptionHandler
{
    public interface IExceptionHandlerService
    {
        IErrorBuilder ReportException(Exception exception);
    }
}