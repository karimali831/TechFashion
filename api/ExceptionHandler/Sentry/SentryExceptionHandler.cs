namespace api.ExceptionHandler.Sentry
{
    public class ExceptionHandlerService : IExceptionHandlerService
    {
        public IErrorBuilder ReportException(Exception exception)
        {
            return new SentryErrorBuilder(exception);
        }
    }
}