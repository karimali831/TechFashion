using api.Service;
using api.Service.Ebay;

namespace api
{
    public static partial class StartupExtensions
    {
        public static IServiceCollection Modules(this IServiceCollection services)
        {
            services.AddScoped<IProductListingService, ProductListingService>();
            services.AddScoped<IEbayFeedService, EbayFeedService>();

            return services;
        }
    }
}