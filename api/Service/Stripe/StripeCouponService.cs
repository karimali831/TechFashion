using api.Data.Stripe;
using api.Repository.Stripe;

namespace api.Service.Stripe
{
    public interface IStripeCouponService
    {
        Task<StripeCoupon> GetAsync(int id);
        Task<IEnumerable<StripeCoupon>> GetAllAsync();
    }

    public class StripeCouponService(IStripeCouponRepository stripeCouponRepository) : IStripeCouponService
    {
        private readonly IStripeCouponRepository _stripeCouponRepository = stripeCouponRepository;

        public async Task<StripeCoupon> GetAsync(int id)
        {
            return await _stripeCouponRepository.GetAsync(id);
        }

        public async Task<IEnumerable<StripeCoupon>> GetAllAsync()
        {
            return await _stripeCouponRepository.GetAllAsync();
        }
    }
}