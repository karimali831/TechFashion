using api.ExceptionHandler;
using api.ExceptionHandler.Sentry;
using api.Repository;
using api.Repository.EF;
using api.Repository.Stripe;
using api.Service;
using api.Service.Ebay;
using api.Service.Stripe;
using CloudChef.Library.Services;

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
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<ICustomerAddressService, CustomerAddressService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IProductListingService, ProductListingService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IReturnService, ReturnService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IMailService, MailService>();
            services.AddScoped<IEmailVerificationService, EmailVerificationService>();

            // Repositories
            services.AddScoped<IProductEFRepository, ProductEFRepository>();

            services.AddScoped<IStripeCouponRepository, StripeCouponRepository>();
            services.AddScoped<IStripePaymentRepository, StripePaymentRepository>();
            services.AddScoped<IStripePromotionRepository, StripePromotionRepository>();
            services.AddScoped<ICartProductRepository, CartProductRepository>();
            services.AddScoped<ICartRepository, CartRepository>();
            services.AddScoped<ICustomerAddressRepository, CustomerAddressRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IProductVariantRepository, ProductVariantRepository>();
            services.AddScoped<IReturnRepository, ReturnRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IEmailVerificationRepository, EmailVerificationRepository>();

            return services;
        }
    }
}