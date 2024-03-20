using System.Collections.Concurrent;
using Microsoft.Extensions.Caching.Memory;

namespace api.Service
{
    public interface ICacheService
    {
        DateTime? GetDateByKey(string key);
        T? GetByKey<T>(string key);
        ConcurrentDictionary<string, DateTime?> GetAll();

        Task<T?> GetOrCreateAsync<T>(
            string key,
            Func<Task<T>> action,
            MemoryCacheEntryOptions? options = null);

        void RemoveAll(string? cachePrefix = null);
        void Remove(string key);
    }

    public class CacheService(IMemoryCache memoryCache) : ICacheService
    {
        private readonly IMemoryCache _memoryCache = memoryCache;
        private readonly ConcurrentDictionary<string, DateTime?> _allKeys = new();
        public ConcurrentDictionary<string, DateTime?> GetAll() => _allKeys;

        public async Task<T?> GetOrCreateAsync<T>(
            string key,
            Func<Task<T>> action,
            MemoryCacheEntryOptions? options = null)
        {
            if (!_memoryCache.TryGetValue(key, out T? cacheEntry))
            {
                cacheEntry = await action();
                _memoryCache.Set(key, cacheEntry, options);
            }

            if (!_allKeys.ContainsKey(key))
                _allKeys.TryAdd(key, DateTime.Now);

            return cacheEntry;
        }

        public T? GetByKey<T>(string key)
        {
            return _memoryCache.TryGetValue(key, out T? cacheEntry) ? cacheEntry : default;
        }

        public DateTime? GetDateByKey(string key)
            => _allKeys.FirstOrDefault(x => x.Key == key).Value;

        public void RemoveAll(string? cachePrefix = null)
        {
            if (!_allKeys.Any()) return;
            foreach (var key in _allKeys.Where(x => cachePrefix == null || x.Key.StartsWith(cachePrefix)))
            {
                Remove(key.Key);
            }
        }

        public void Remove(string key)
        {
            if (!_allKeys.TryRemove(key, out _))
                _allKeys.TryUpdate(key, null, GetDateByKey(key));

            _memoryCache.Remove(key);
        }
    }
}