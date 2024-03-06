using api.Service;

namespace api
{
    public static partial class StartupExtensions
    {
        public static IServiceCollection Modules(this IServiceCollection services) 
        {
            services.AddScoped<IProductListingService, ProductListingService>();

            return services;
        }
    }
}