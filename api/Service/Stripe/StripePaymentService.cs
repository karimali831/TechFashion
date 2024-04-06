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
        Task<PaymentIntentResponse> CreateIntentAsync(User user,
            int cartId,
            int? addressId = null,
            StripeCoupon? coupon = null,
            string? promoCode = null);
    }

    public class StripePaymentService(
        ICartService cartService,
        ICartProductService cartProductService,
        IStripePaymentRepository stripePaymentRepository) : IStripePaymentService
    {
        private readonly PaymentIntentService _paymentIntentService = new();
        private readonly ICartService _cartService = cartService;
        private readonly ICartProductService _cartProductService = cartProductService;
        private readonly IStripePaymentRepository _stripePaymentRepository = stripePaymentRepository;

        public async Task<int> AddAsync(StripePayment model)
        {
            return await _stripePaymentRepository.AddAsync(model);
        }

        public async Task<PaymentIntentResponse> CreateIntentAsync(User user,
            int cartId,
            int? addressId = null,
            StripeCoupon? coupon = null,
            string? promoCode = null)
        {
            decimal discountedAmount = 0;
            var cartProducts = await _cartService.GetAsync(user.Id);

            if (cartProducts is null)
            {
                return new PaymentIntentResponse
                {
                    ErrorMsg = "Something went wrong"
                };
            }

            var total = cartProducts.Total;

            // foreach (var cp in cartProducts.Products.Where(x => x.Stock is not null))
            // {
            //     bool productIsVariant = cp.VariantId.HasValue;
            //     var stockCheck = await _cartProductService.StockCheckAsync(cp.VariantId ?? cp.ProductId, productIsVariant);

            //     if (stockCheck.Quantity >= stockCheck.Stock)
            //     {
            //         total -= stockCheck.Price;
            //     }
            // }

            var amount = total * 100;

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

                // AddressId will be null when an address from local db
                // is not selected in PaymentElement
                if (addressId.HasValue)
                {
                    metaData.Add("AddressId", addressId.Value.ToString());
                }

                if (promoCode is not null)
                {
                    metaData.Add("PromoCode", promoCode);
                }

                var create = await _paymentIntentService.CreateAsync(
                    new PaymentIntentCreateOptions
                    {
                        Amount = (long)amount,
                        Customer = user.StripeCustomerId,
                        Currency = "gbp",
                        Metadata = metaData
                    });

                return new PaymentIntentResponse
                {
                    ClientSecret = create.ClientSecret,
                    Coupon = coupon?.Name,
                    DiscountedAmount = discountedAmount.ToCurrencyGbp(),
                    Amount = total.ToCurrencyGbp()
                };
            }
            catch (Exception exp)
            {
                return new PaymentIntentResponse { ErrorMsg = exp.Message };
            }
        }
    }
}