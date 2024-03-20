using api.Repository;
using api.Repository.EF;
using api.Repository.Stripe;
using api.Service;
using api.Service.Ebay;
using api.Service.Stripe;

namespace api
{
    public static partial class StartupExtensions
    {
        public static IServiceCollection Modules(this IServiceCollection services)
        {
            // Singleton
            services.AddSingleton<ICacheService, CacheService>();

            // Services
            services.AddScoped<IEbayFeedService, EbayFeedService>();

            services.AddScoped<IStripeBillingCustomerService, StripeBillingCustomerService>();
            services.AddScoped<IStripeCouponService, StripeCouponService>();
            services.AddScoped<IStripeCustomerService, StripeCustomerService>();
            services.AddScoped<IStripePaymentIntentService, StripePaymentIntentService>();
            services.AddScoped<IStripePromotionService, StripePromotionService>();

            services.AddScoped<ICartProductService, CartProductService>();
            services.AddScoped<IProductListingService, ProductListingService>();
            services.AddScoped<IUserService, UserService>();

            // Repositories
            services.AddScoped<IProductEFRepository, ProductEFRepository>();

            services.AddScoped<IStripeCouponRepository, StripeCouponRepository>();
            services.AddScoped<IStripeCustomerRepository, StripeCustomerRepository>();
            services.AddScoped<IStripePromotionRepository, StripePromotionRepository>();

            services.AddScoped<ICartProductRepository, CartProductRepository>();
            services.AddScoped<ICartRepository, CartRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IProductVariantRepository, ProductVariantRepository>();
            services.AddScoped<IUserRepository, UserRepository>();

            return services;
        }
    }
}