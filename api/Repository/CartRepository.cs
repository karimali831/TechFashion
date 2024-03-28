using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface ICartRepository
    {
        Task<Cart?> GetByUserIdAsync(int userId);
        Task<Cart?> GetByGuestCheckoutIdAsync(Guid guestCheckoutId);
        Task EmptyAsync(int cartId);
        Task SetUserIdAsync(int userId, Guid guestCheckoutId);
    }

    public class CartRepository(IConfiguration configuration) : DapperBaseRepository(configuration), ICartRepository
    {
        private const string Table = "Carts";
        private static readonly string[] Fields = typeof(Cart).DapperFields();

        public async Task<Cart?> GetByUserIdAsync(int userId)
        {
            return await QueryFirstOrDefaultAsync<Cart>(
                $"{DapperHelper.Select(Table, Fields)} WHERE UserId = @userId AND ArchiveDate IS NULL", new { userId }
            );
        }

        public async Task<Cart?> GetByGuestCheckoutIdAsync(Guid guestCheckoutId)
        {
            return await QueryFirstOrDefaultAsync<Cart>(
                $"{DapperHelper.Select(Table, Fields)} WHERE GuestCheckoutId = @guestCheckoutId AND ArchiveDate IS NULL", new { guestCheckoutId }
            );
        }

        public async Task EmptyAsync(int cartId)
        {
            await ExecuteAsync($"UPDATE {Table} SET ArchiveDate = GETDATE() WHERE Id = @cartId", new { cartId });
        }

        public async Task SetUserIdAsync(int userId, Guid guestCheckoutId)
        {
            await ExecuteAsync($"UPDATE {Table} SET ArchiveDate = GETDATE() WHERE UserId = @userId AND GuestCheckoutId IS NOT NULL", new { userId });
            await ExecuteAsync($"UPDATE {Table} SET UserId = @userId WHERE GuestCheckoutId = @guestCheckoutId", new { userId, guestCheckoutId });
        }
    }
}