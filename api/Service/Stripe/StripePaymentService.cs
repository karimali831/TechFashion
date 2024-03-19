using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Service.Stripe
{
    public interface IStripePaymentService
    {
        Task<PaymentIntentResponse> CreatePaymentIntent(string priceId, string customerId,
            Model.Db.Coupon? coupon = null, string? promoCode = null);
    }

    public class StripePaymentService : IStripePaymentService
    {
        private readonly PaymentIntentService _paymentIntentService;
        private readonly IStripePriceService _stripePriceService;

        public StripePaymentService(IStripePriceService stripePriceService)
        {
            _stripePriceService = stripePriceService;
            _paymentIntentService = new PaymentIntentService();
        }

        public async Task<PaymentIntentResponse> CreatePaymentIntent(string priceId,
            string customerId, Model.Db.Coupon? coupon = null, string? promoCode = null)
        {
            var price = await _stripePriceService.GetAsync(priceId);
            var amount = price.UnitAmount ?? 0;
            long discountedAmount = 0;

            if (amount == 0)
                throw new Exception("An error occurred");

            if (coupon is not null)
            {
                if (coupon.PercentOff > 0)
                {
                    discountedAmount = amount * coupon.PercentOff.Value / 100;
                    amount -= amount * (long)coupon.PercentOff.Value / 100;
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
                    { "Tokens", price.TransformQuantity.DivideBy.ToString() }
                };

                if (promoCode is not null)
                {
                    metaData.Add("PromoCode", promoCode);
                }

                var create = await _paymentIntentService.CreateAsync(
                    new PaymentIntentCreateOptions
                    {
                        Amount = amount,
                        Customer = customerId,
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