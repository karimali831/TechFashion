using api.Data;
using api.Data.Stripe;
using api.Dto.Stripe;
using api.Helper;
using api.Repository.Stripe;
using Stripe;

namespace api.Service.Stripe
{
    public interface IStripePaymentService
    {
        Task<int> AddAsync(StripePayment model);
        Task<PaymentIntentResponse> CreateIntentAsync(User user, int cartId,
            StripeCoupon? coupon = null, string? promoCode = null);
    }

    public class StripePaymentService(
        ICartService cartService,
        IStripePaymentRepository stripePaymentRepository) : IStripePaymentService
    {
        private readonly PaymentIntentService _paymentIntentService = new();
        private readonly ICartService _cartService = cartService;
        private readonly IStripePaymentRepository _stripePaymentRepository = stripePaymentRepository;

        public async Task<int> AddAsync(StripePayment model)
        {
            return await _stripePaymentRepository.AddAsync(model);
        }

        public async Task<PaymentIntentResponse> CreateIntentAsync(User user, int cartId, StripeCoupon? coupon = null, string? promoCode = null)
        {
            long discountedAmount = 0;

            var cartProducts = await _cartService.GetAsync(user.Id);

            if (cartProducts is null || cartProducts.Total <= 0)
                throw new ApplicationException("An error occurred");

            long amount = (long)cartProducts.Total * 100;

            if (coupon is not null)
            {
                if (coupon.PercentOff > 0)
                {
                    discountedAmount = amount * coupon.PercentOff.Value / 100;
                    amount -= amount * coupon.PercentOff.Value / 100;
                }

                if (coupon.FixedAmountOff is > 0)
                {
                    amount -= (long)coupon.FixedAmountOff.Value * 100;
                }
            }

            try
            {
                var metaData = new Dictionary<string, string>
                {
                    { "CartId", cartId.ToString() }
                };

                if (promoCode is not null)
                {
                    metaData.Add("PromoCode", promoCode);
                }

                var create = await _paymentIntentService.CreateAsync(
                    new PaymentIntentCreateOptions
                    {
                        Amount = amount,
                        Customer = user.StripeCustomerId,
                        Currency = "gbp",
                        Metadata = metaData
                    });

                return new PaymentIntentResponse
                {
                    ClientSecret = create.ClientSecret,
                    Coupon = coupon?.Name,
                    DiscountedAmount = discountedAmount.ToCurrencyGbp(),
                    Amount = amount.ToCurrencyGbp()
                };
            }
            catch (Exception exp)
            {
                return new PaymentIntentResponse { ErrorMsg = exp.Message };
            }
        }
    }
}