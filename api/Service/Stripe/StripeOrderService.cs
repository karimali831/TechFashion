using api.Data;
using api.Data.Stripe;
using api.Dto.Stripe;
using api.Enum;
using api.Service.Stripe;

namespace api.Service
{
    public interface IStripeOrderService
    {
        Task<PaymentIntentResponse> InitiateAsync(PaymentIntentRequest request);
    }

    public class StripeOrderService(
        IUserService userService,
        IOrderService orderService,
        IStripePaymentService stripePaymentService,
        IStripeCustomerService stripeCustomerService,
        IStripePromotionService stripePromotionService) : IStripeOrderService
    {
        private readonly IUserService _userService = userService;
        private readonly IOrderService _orderService = orderService;
        private readonly IStripePaymentService _stripePaymentService = stripePaymentService;
        private readonly IStripeCustomerService _stripeCustomerService = stripeCustomerService;
        private readonly IStripePromotionService _stripePromotionService = stripePromotionService;

        public async Task<PaymentIntentResponse> InitiateAsync(PaymentIntentRequest request)
        {
            User? user = null;
            if (request.FirebaseUid is not null)
            {
                user = await _userService.GetByFirebaseUIdAsync(request.FirebaseUid);
            }
            else if (request.GuestUser is not null)
            {
                var userByEmail = await _userService.GetByEmailAsync(request.GuestUser.Email);

                if (userByEmail is not null)
                {
                    if (userByEmail.FirebaseUid is not null)
                    {
                        return new PaymentIntentResponse { ErrorMsg = "An account already exists with this email. Please login to proceed." };
                    }
                    else
                    {
                        user = userByEmail;
                    }
                }
                else
                {
                    user = await _userService.GetByGuestCheckoutIdAsync(request.GuestUser.Id);
                }

                if (user is null)
                    throw new ApplicationException("An error occurred");
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

            var order = await _orderService.GetPendingByCartIdAsync(request.CartId);
            int orderId;

            if (order is not null)
            {
                orderId = order.Id;

                if (request.AddressId != order.ShippingAddressId)
                {
                    await _orderService.UpdateShippingAddressIdAsync(orderId, request.AddressId);
                }
            }
            else
            {
                orderId = await _orderService.AddAsync(
                     new Order
                     {
                         CartId = request.CartId,
                         ShippingAddressId = request.AddressId,
                         Status = OrderStatus.Created
                     });
            }

            return await _stripePaymentService.CreateIntentAsync(orderId, user,
                request,
                coupon,
                request.PromoCode
            );
        }
    }
}