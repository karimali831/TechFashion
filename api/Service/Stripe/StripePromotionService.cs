using api.Data.Stripe;
using api.Repository.Stripe;
using api.Service.Stripe;

namespace api.Service
{

    public interface IStripePromotionService
    {
        Task<StripeCoupon?> GetCouponByPromotionCode(string code);
        Task<StripePromotion?> GetByCouponIdAsync(int couponId, int userID);
        Task<StripePromotion?> GetByPromoCodeAsync(string code, bool activeOnly);
    }

    public class StripePromotionService(
        IStripePromotionRepository stripePromotionRepository,
        IStripeCustomerService stripeCustomerService,
        IStripeCouponService stripeCouponService,
        ICacheService cacheService) : IStripePromotionService
    {
        private readonly IStripePromotionRepository _stripePromotionRepository = stripePromotionRepository;
        private readonly IStripeCustomerService _stripeCustomerService = stripeCustomerService;
        private readonly IStripeCouponService _stripeCouponService = stripeCouponService;
        private readonly ICacheService _cacheService = cacheService;

        public async Task<StripeCoupon?> GetCouponByPromotionCode(string code)
        {
            var promo = await _stripePromotionRepository.GetByPromoCodeAsync(code, activeOnly: true);

            if (promo is null)
                return null;

            return await _stripeCouponService.GetAsync(promo.CouponId);
        }


        public async Task<StripePromotion?> GetByCouponIdAsync(int couponId, int userId)
        {
            return await _stripePromotionRepository.GetByCouponIdAsync(couponId, userId);
        }

        public async Task<StripePromotion?> GetByPromoCodeAsync(string code, bool activeOnly)
        {
            return await _stripePromotionRepository.GetByPromoCodeAsync(code, activeOnly);
        }
    }
}