using api.Repository;
using api.Repository.EF;
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
            services.AddScoped<ICartProductService, CartProductService>();

            // Repositories
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IProductEFRepository, ProductEFRepository>();
            services.AddScoped<ICartProductRepository, CartProductRepository>();
            services.AddScoped<ICartRepository, CartRepository>();
            services.AddScoped<IProductVariantRepository, ProductVariantRepository>();

            return services;
        }
    }
}