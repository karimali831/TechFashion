using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByFirebaseUidAsync(string id);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByCustomerIdAsync(string customerId);
        Task CreateAsync(User model);
        Task SetStripeCustomerIdAsync(string customerId, int userId);
        Task SetStripeCustomerDeletedAsync(string customerId, DateTime? deletedDate);
    }

    public class UserRepository(IConfiguration configuration) : DapperBaseRepository(configuration),
        IUserRepository
    {
        private const string Table = "[dbo].[Users]";
        private static readonly string[] Fields = typeof(User).DapperFields();


        public async Task<User?> GetByIdAsync(int id)
        {
            return await QuerySingleOrDefaultAsync<User>($"{DapperHelper.Select(Table, Fields)} WHERE Id = @id", new { id });
        }

        public async Task<User?> GetByFirebaseUidAsync(string id)
        {
            return await QuerySingleOrDefaultAsync<User>($"{DapperHelper.Select(Table, Fields)} WHERE FirebaseUid = @id", new { id });
        }
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await QuerySingleOrDefaultAsync<User>($"{DapperHelper.Select(Table, Fields)} WHERE Email = @email", new { email });
        }

        public async Task<User?> GetByCustomerIdAsync(string customerId)
        {
            return await QuerySingleOrDefaultAsync<User>($"{DapperHelper.Select(Table, Fields)} WHERE StripeCustomerId = @customerId", new { customerId });
        }

        public async Task CreateAsync(User model)
        {
            await ExecuteAsync(DapperHelper.Insert(Table, Fields), model);
        }

        public async Task SetStripeCustomerIdAsync(string customerId, int userId)
        {
            await ExecuteAsync($"UPDATE {Table} SET StripeCustomerId = @customerId, StripeCustomerDeleted = null WHERE Id = @userId",
                new { customerId, userId });
        }

        public async Task SetStripeCustomerDeletedAsync(string customerId, DateTime? deletedDate)
        {
            await ExecuteAsync($"UPDATE {Table} SET StripeCustomerDeleted = @deletedDate WHERE StripeCustomerId = @customerId",
                new { customerId, deletedDate });
        }
    }
}