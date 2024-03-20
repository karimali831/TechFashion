using api.Data.Stripe;
using api.Dto.Stripe;
using api.Service;
using api.Service.Stripe;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController(
        IStripePaymentIntentService stripePaymentIntentService,
        IStripePromotionService stripePromotionService,
        IStripeCustomerService stripeCustomerService,
        IStripeBillingCustomerService stripeBillingCustomerService)
    {
        private readonly IStripePromotionService _stripePromotionService = stripePromotionService;
        private readonly IStripePaymentIntentService _stripePaymentIntentService = stripePaymentIntentService;
        private readonly IStripeCustomerService _stripeCustomerService = stripeCustomerService;
        private readonly IStripeBillingCustomerService _stripeBillingCustomer = stripeBillingCustomerService;


        [HttpPost("CreatePaymentIntent/{userId}/{promoCode?}")]
        public async Task<PaymentIntentResponse> CreatePaymentIntent(int userId,
           string? promoCode = null)
        {
            var stripeCustomer = await _stripeBillingCustomer.GetByUserIdAsync(userId) ??
                await _stripeBillingCustomer.CreateAsync(userId,
                    (await _stripeCustomerService.CreateAsync(userId)).Id
                );

            StripeCoupon? coupon = null;
            if (!string.IsNullOrEmpty(promoCode))
            {
                var couponByPromoCode = await _stripePromotionService.GetCouponByPromotionCode(promoCode);

                if (couponByPromoCode is null)
                {
                    return new PaymentIntentResponse { ErrorMsg = "Invalid promotion code" };
                }

                coupon = couponByPromoCode;
            }

            return await _stripePaymentIntentService.CreateAsync(stripeCustomer.CustomerId, coupon, promoCode);
        }
    }
}