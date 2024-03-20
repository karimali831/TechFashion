using api.Data;
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
        IUserService userService,
        IStripePaymentService stripePaymentService,
        IStripePromotionService stripePromotionService,
        IStripeCustomerService stripeCustomerService) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IStripePromotionService _stripePromotionService = stripePromotionService;
        private readonly IStripePaymentService _stripePaymentService = stripePaymentService;
        private readonly IStripeCustomerService _stripeCustomerService = stripeCustomerService;


        [HttpPost("CreatePaymentIntent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentIntentRequest request)
        {
            User? user = null;
            if (request.FirebaseUid is not null)
            {
                user = await _userService.GetByFirebaseUIdAsync(request.FirebaseUid);
            }
            else if (request.GuestEmail is not null)
            {
                user = await _userService.GetByEmailAsync(request.GuestEmail)
                 ?? await _userService.CreateAsync(request.GuestEmail);
            }

            if (user is null)
                throw new ApplicationException("An error occurred");

            if (user.StripeCustomerId is null)
            {
                user.StripeCustomerId = (await _stripeCustomerService.CreateAsync(user.Id)).Id;
                await _userService.SetCustomerIdAsync(user.StripeCustomerId, user.Id);
            }

            StripeCoupon? coupon = null;
            if (!string.IsNullOrEmpty(request.PromoCode))
            {
                var couponByPromoCode = await _stripePromotionService.GetCouponByPromotionCode(request.PromoCode);

                if (couponByPromoCode is null)
                {

                    return Ok(new PaymentIntentResponse { ErrorMsg = "Invalid promotion code" });
                }

                coupon = couponByPromoCode;
            }

            var response = await _stripePaymentService.CreateIntentAsync(user.StripeCustomerId, coupon, request.PromoCode);
            return Ok(response);
        }
    }
}