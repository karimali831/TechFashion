using api.Data.Stripe;
using api.Helper;
using api.Infrastructure;

namespace api.Repository.Stripe
{
    public interface IStripePaymentRepository
    {
        Task<bool> AddAsync(StripePayment model);
    }

    public class StripePaymentRepository(IConfiguration configuration) : DapperBaseRepository(configuration),
     IStripePaymentRepository
    {
        private const string Table = "[dbo].[StripePayments]";
        private static readonly string[] Fields = typeof(StripePayment).SqlFields();


        public async Task<bool> AddAsync(StripePayment model)
        {
            return await ExecuteAsync(DapperHelper.Insert(Table, Fields), model);
        }
    }
}