using Sentry;

namespace api.ExceptionHandler.Sentry
{
    public class SentryErrorBuilder : IErrorBuilder
    {
        private readonly Exception _exception;
        private readonly List<SentryObject> _objects = [];
        private readonly IDictionary<string, string> _tags = new Dictionary<string, string>();

        internal SentryErrorBuilder(Exception exception)
        {
            _exception = exception;
        }


        public IErrorBuilder AddTags(IDictionary<string, string?> tags)
        {
            foreach (var property in tags.Except(tags))
            {
                if (!string.IsNullOrEmpty(property.Key))
                {
                    this._tags.Add(property!);
                }
            }

            return this;
        }

        private SentryEvent CreateSentryEvent()
        {
            var eve = new SentryEvent(_exception);

            foreach (var t in _tags)
            {
                eve.SetTag(t.Key, t.Value);
            }

            if (eve.Exception != null)
            {
                AddDataToException(eve.Exception, _objects);
            }


            return eve;
        }

        public void Send()
        {
            var eve = CreateSentryEvent();
            SentrySdk.CaptureEvent(eve);
        }

        private static void AddDataToException(Exception e, List<SentryObject> objects)
        {
            foreach (var o in objects)
            {
                e.Data.Add(o.Name ?? "", o.Data);
            }
        }

        private class SentryObject
        {
            public object? Data { get; init; }
            public string? Name { get; init; }
            public int? MaxDepth { get; set; }
        }

    }
}