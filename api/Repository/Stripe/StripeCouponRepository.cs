using api.Data.Stripe;
using api.Helper;
using api.Infrastructure;

namespace api.Repository.Stripe
{
    public interface IStripeCouponRepository
    {
        Task<StripeCoupon> GetAsync(int id);
        Task<IEnumerable<StripeCoupon>> GetAllAsync();
    }

    public class StripeCouponRepository(IConfiguration configuration) : DapperBaseRepository(configuration),
     IStripeCouponRepository
    {
        private const string Table = "[dbo].[StripeCoupons]";
        private static readonly string[] Fields = typeof(StripeCoupon).SqlFields();


        public async Task<StripeCoupon> GetAsync(int id)
        {
            return await QuerySingleAsync<StripeCoupon>($"{DapperHelper.Select(Table, Fields)} WHERE Id = @id AND Active = 1",
                new { id });
        }

        public async Task<IEnumerable<StripeCoupon>> GetAllAsync()
        {
            return await QueryAsync<StripeCoupon>($"{DapperHelper.Select(Table, Fields)} WHERE Active = 1");
        }
    }
}