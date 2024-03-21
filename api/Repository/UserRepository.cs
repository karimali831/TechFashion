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
        Task<User?> GetByGuestCheckoutIdAsync(Guid guestCheckoutId);
        Task<User?> GetByCustomerIdAsync(string customerId);
        Task CreateGuestAccountAsync(string email, Guid guestCheckoutId);
        Task SetStripeCustomerIdAsync(string customerId, int userId);
        Task SetStripeCustomerDeletedAsync(string customerId, DateTime? deletedDate);
        Task SetEmailAsync(string email, Guid guestCheckoutId);
    }

    public class UserRepository(IConfiguration configuration) : DapperBaseRepository(configuration),
        IUserRepository
    {
        private const string Table = "[dbo].[Users]";
        private static readonly string[] Fields = typeof(User).DapperFields();


        public async Task<User?> GetByIdAsync(int id)
        {
            return await QuerySingleOrDefaultAsync<User>($"{DapperHelper.Select(Table, Fields)} WHERE Id = @id AND RemovedDate IS NULL", new { id });
        }

        public async Task<User?> GetByFirebaseUidAsync(string id)
        {
            return await QuerySingleOrDefaultAsync<User>($"{DapperHelper.Select(Table, Fields)} WHERE FirebaseUid = @id AND RemovedDate IS NULL", new { id });
        }
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await QuerySingleOrDefaultAsync<User>($"{DapperHelper.Select(Table, Fields)} WHERE Email = @email AND RemovedDate IS NULL", new { email });
        }

        public async Task<User?> GetByGuestCheckoutIdAsync(Guid guestCheckoutId)
        {
            return await QuerySingleOrDefaultAsync<User>($"{DapperHelper.Select(Table, Fields)} WHERE GuestCheckoutId = @guestCheckoutId AND RemovedDate IS NULL", new { guestCheckoutId });
        }

        public async Task<User?> GetByCustomerIdAsync(string customerId)
        {
            return await QuerySingleOrDefaultAsync<User>($"{DapperHelper.Select(Table, Fields)} WHERE StripeCustomerId = @customerId AND RemovedDate IS NULL", new { customerId });
        }

        public async Task CreateGuestAccountAsync(string email, Guid guestCheckoutId)
        {
            await ExecuteAsync($"INSERT INTO {Table} (Email, GuestCheckoutId) VALUES (@email, @guestCheckoutId)", new { email, guestCheckoutId });
            // await ExecuteAsync(DapperHelper.Insert(Table, Fields), model);
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

        public async Task SetEmailAsync(string email, Guid guestCheckoutId)
        {
            await ExecuteAsync($"UPDATE {Table} SET Email = @email WHERE GuestCheckoutId = @guestCheckoutId",
                new { guestCheckoutId });
        }
    }
}