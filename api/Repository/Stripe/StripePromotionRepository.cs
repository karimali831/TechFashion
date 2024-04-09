using api.Data.Stripe;
using api.Helper;
using api.Infrastructure;
using api.ViewModels;

namespace api.Repository.Stripe
{
    public interface IStripePromotionRepository
    {
        Task<IEnumerable<PromotionViewModel>> GetAllAsync(int userId);
        Task<StripePromotion?> GetByCouponIdAsync(int couponId, int userId);
        Task<StripePromotion?> GetByPromoCodeAsync(string code, bool activeOnly);
        Task<bool> AddAsync(StripePromotion model);
    }

    public class StripePromotionRepository(DapperContext context) : DapperBaseRepository(context),
        IStripePromotionRepository
    {
        private const string Table = "[dbo].[StripePromotions]";
        private static readonly string[] Fields = typeof(StripePromotion).SqlFields();

        public async Task<IEnumerable<PromotionViewModel>> GetAllAsync(int userId)
        {
            const string sqlTxt = $@"
                SELECT c.Name AS CouponName, p.Code, p.ExpiryDate
                FROM StripePromotions AS p
                INNER JOIN StripeCoupons AS c
                ON p.CouponId = c.Id
                WHERE p.UserId = @userId
                AND p.ExpiryDate > GETDATE()
                AND p.Active = 1
                AND c.Active = 1
            ";

            return await QueryAsync<PromotionViewModel>(sqlTxt,
                new { userId });
        }

        public async Task<StripePromotion?> GetByCouponIdAsync(int couponId, int userId)
        {
            var sqlTxt = $@"
                {DapperHelper.Select(Table, Fields)} 
                WHERE CouponId = @couponId 
                AND UserId = @userId
                AND ExpiryDate > GETDATE()
                AND Active = 1";

            return await QueryFirstOrDefaultAsync<StripePromotion>(sqlTxt,
                new
                {
                    couponId,
                    userId
                });
        }

        public async Task<StripePromotion?> GetByPromoCodeAsync(string code, bool activeOnly)
        {
            var sqlTxt = $@"
                {DapperHelper.Select(Table, Fields)} 
                WHERE Code = @code 
                AND ExpiryDate > GETDATE()
                {(activeOnly ? "AND Active = 1" : "")}";

            return await QuerySingleOrDefaultAsync<StripePromotion>(sqlTxt,
                new { code });
        }

        public async Task<bool> AddAsync(StripePromotion model)
        {
            return await ExecuteAsync(DapperHelper.Insert(Table, Fields), model);
        }
    }
}