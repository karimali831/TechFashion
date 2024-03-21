using api.Data;
using api.Data.Stripe;
using api.Dto.Stripe;
using api.Service.Stripe;

namespace api.Service
{
    public interface IStripeOrderService
    {
        Task<PaymentIntentResponse> InitiateAsync(PaymentIntentRequest request);
    }

    public class StripeOrderService(
        IUserService userService,
        ICartService cartService,
        IStripePaymentService stripePaymentService,
        IStripeCustomerService stripeCustomerService,
        IStripePromotionService stripePromotionService) : IStripeOrderService
    {
        private readonly IUserService _userService = userService;
        private readonly ICartService _cartService = cartService;
        private readonly IStripePaymentService _stripePaymentService = stripePaymentService;
        private readonly IStripeCustomerService _stripeCustomerService = stripeCustomerService;
        private readonly IStripePromotionService _stripePromotionService = stripePromotionService;

        public async Task<PaymentIntentResponse> InitiateAsync(PaymentIntentRequest request)
        {
            User? user = null;
            if (request.CartUser.FirebaseUid is not null)
            {
                user = await _userService.GetByFirebaseUIdAsync(request.CartUser.FirebaseUid);
            }
            else if (request.GuestEmail is not null && request.CartUser.GuestCheckoutId.HasValue)
            {
                var userByEmail = await _userService.GetByEmailAsync(request.GuestEmail);

                if (userByEmail is not null)
                {
                    return new PaymentIntentResponse { ErrorMsg = "Account already exists, please login" };
                }
                else
                {
                    var userByGuestCheckout = await _userService.GetByGuestCheckoutIdAsync(request.CartUser.GuestCheckoutId.Value);

                    if (userByGuestCheckout is not null)
                    {
                        if (userByGuestCheckout.Email == "")
                        {
                            await _userService.SetEmailAsync(userByGuestCheckout.Email, request.CartUser.GuestCheckoutId.Value);
                        }

                        user = userByGuestCheckout;
                    }
                    else
                    {
                        user = await _userService.CreateGuestAccountAsync(request.GuestEmail, request.CartUser.GuestCheckoutId.Value);

                    }

                    if (user is null)
                        throw new ApplicationException("An error occurred");

                    await _cartService.SetUserIdAsync(user.Id, request.CartUser.GuestCheckoutId.Value);
                }
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

                    return new PaymentIntentResponse { ErrorMsg = "Invalid promotion code" };
                }

                coupon = couponByPromoCode;
            }

            return await _stripePaymentService.CreateIntentAsync(user, coupon, request.PromoCode);
        }
    }
}