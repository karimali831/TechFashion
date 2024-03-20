using api.Service;

namespace api.Helper
{
    public static class CachedKey
    {
        public static string CachePrefix<T>() => typeof(T).Name;
        private static string CacheKey<T>(string key) => $"{CachePrefix<T>()}.{key}";

        // Keys
        public static string PromotionCodes(int userId) =>
            CacheKey<StripePromotionService>($"{nameof(PromotionCodes)}-{userId}");
    }
}