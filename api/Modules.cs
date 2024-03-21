using api.ExceptionHandler;
using api.ExceptionHandler.Sentry;
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
            services.AddSingleton<IExceptionHandlerService, ExceptionHandlerService>();

            // Services
            services.AddScoped<IEbayFeedService, EbayFeedService>();

            services.AddScoped<IStripeCouponService, StripeCouponService>();
            services.AddScoped<IStripeCustomerService, StripeCustomerService>();
            services.AddScoped<IStripeOrderService, StripeOrderService>();
            services.AddScoped<IStripePaymentService, StripePaymentService>();
            services.AddScoped<IStripePaymentMethodService, StripePaymentMethodService>();
            services.AddScoped<IStripePromotionService, StripePromotionService>();

            services.AddScoped<ICartProductService, CartProductService>();
            services.AddScoped<IProductListingService, ProductListingService>();
            services.AddScoped<IUserService, UserService>();

            // Repositories
            services.AddScoped<IProductEFRepository, ProductEFRepository>();

            services.AddScoped<IStripeCouponRepository, StripeCouponRepository>();
            services.AddScoped<IStripePaymentRepository, StripePaymentRepository>();
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