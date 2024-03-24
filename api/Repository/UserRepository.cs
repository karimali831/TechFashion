using api.Data;
using api.Dto;
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
        Task CreateGuestAccountAsync(GuestCheckoutDto dto);
        Task SetStripeCustomerIdAsync(string customerId, int userId);
        Task SetStripeCustomerDeletedAsync(string customerId, DateTime? deletedDate);
        Task SetNameAsync(string name, int userId);
        Task SetFirebaseUidAsync(string firebaseUid, int userId);
        Task CreateAsync(CreateUsertDto dto);
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

        public async Task CreateGuestAccountAsync(GuestCheckoutDto dto)
        {
            await ExecuteAsync($"INSERT INTO {Table} (Name, Email, GuestCheckoutId) VALUES (@name, @email, @guestCheckoutId)",
                new
                {
                    guestCheckoutId = dto.Id,
                    name = dto.Name,
                    email = dto.Email
                });
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

        public async Task SetNameAsync(string name, int userId)
        {
            await ExecuteAsync($"UPDATE {Table} SET Name = @name WHERE Id = @userId",
              new { name, userId });
        }

        public async Task SetFirebaseUidAsync(string firebaseUid, int userId)
        {
            await ExecuteAsync($"UPDATE {Table} SET GuestCheckoutId = null, FirebaseUid = @firebaseUid WHERE Id = @userId",
                new { firebaseUid, userId });
        }

        public async Task CreateAsync(CreateUsertDto dto)
        {
            await ExecuteAsync($"INSERT INTO {Table} (Name, Email, FirebaseUid) VALUES (@name, @email, @firebaseUid)",
                new
                {
                    firebaseUid = dto.FirebaseUid,
                    name = dto.Name,
                    email = dto.Email
                });
        }
    }
}