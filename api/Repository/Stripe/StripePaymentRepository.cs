using api.Data.Stripe;
using api.Helper;
using api.Infrastructure;

namespace api.Repository.Stripe
{
    public interface IStripePaymentRepository
    {
        Task<int> AddAsync(StripePayment model);
    }

    public class StripePaymentRepository(IConfiguration configuration) : DapperBaseRepository(configuration),
     IStripePaymentRepository
    {
        private const string Table = "[dbo].[StripePayments]";
        private static readonly string[] Fields = typeof(StripePayment).SqlFields();


        public async Task<int> AddAsync(StripePayment model)
        {
            var result = await QueryAsync<int>(DapperHelper.Insert(Table, Fields), model);
            return result.Single();
        }
    }
}