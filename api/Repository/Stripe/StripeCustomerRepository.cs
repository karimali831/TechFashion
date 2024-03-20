using api.Data.Stripe;
using api.Helper;
using api.Infrastructure;

namespace api.Repository.Stripe
{
    public interface IStripeCustomerRepository
    {
        Task<StripeCustomer?> GetByUserIdAsync(int userId);
        Task<StripeCustomer?> GetByCustomerIdAsync(string customerId);
        Task CreateAsync(StripeCustomer model);
        Task SetActiveAsync(string customerId, bool active);
    }

    public class StripeCustomerRepository(IConfiguration configuration) : DapperBaseRepository(configuration),
        IStripeCustomerRepository
    {
        private const string Table = "[dbo].[StripeCustomers]";
        private static readonly string[] Fields = typeof(StripeCustomer).SqlFields();

        public async Task<StripeCustomer?> GetByUserIdAsync(int userId)
        {
            return await QueryFirstOrDefaultAsync<StripeCustomer>($"{DapperHelper.Select(Table, Fields)} WHERE UserId = @userId AND Active = 1",
                new { userId });
        }

        public async Task<StripeCustomer?> GetByCustomerIdAsync(string customerId)
        {
            return await QueryFirstOrDefaultAsync<StripeCustomer>($"{DapperHelper.Select(Table, Fields)} WHERE CustomerId = @customerId AND Active = 1",
                new { customerId });
        }

        public async Task CreateAsync(StripeCustomer model)
        {
            await ExecuteAsync(DapperHelper.Insert(Table, Fields), model);
        }

        public async Task SetActiveAsync(string customerId, bool active)
        {
            await ExecuteAsync($"UPDATE {Table} SET Active = @active WHERE CustomerId = @customerId",
                new { customerId, active });
        }
    }
}
