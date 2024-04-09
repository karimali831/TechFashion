using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface ICartRepository
    {
        Task<Cart> GetAsync(int id);
        Task<Cart?> GetByUserIdAsync(int userId);
        Task<Cart?> GetByGuestCheckoutIdAsync(Guid guestCheckoutId);
        Task EmptyAsync(int cartId);
        Task SetUserIdAsync(int userId, Guid guestCheckoutId);
        Task ArchiveInactiveAsync();
    }

    public class CartRepository(DapperContext context) : DapperBaseRepository(context), ICartRepository
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
            await ExecuteAsync($"UPDATE {Table} SET ArchiveDate = GETDATE() WHERE UserId = @userId AND GuestCheckoutId IS NOT NULL AND GuestCheckoutId != @guestCheckoutId", new { userId, guestCheckoutId });
            await ExecuteAsync($"UPDATE {Table} SET UserId = @userId WHERE GuestCheckoutId = @guestCheckoutId", new { userId, guestCheckoutId });
        }

        public async Task<Cart> GetAsync(int id)
        {
            return await QueryFirstAsync<Cart>($"{DapperHelper.Select(Table, Fields)} WHERE Id = @id", new { id });
        }

        public async Task ArchiveInactiveAsync()
        {
            var sqlTxt = @$"
                UPDATE Carts 
                SET ArchiveDate = GETDATE(), ArchivedByJob = 1 
                FROM Carts AS C
                WHERE NOT Exists (
                    SELECT CartId 
                    FROM CartProducts AS CP
                    WHERE CP.CartId = C.Id
                    AND CP.RemovedDate IS NULL
                )
                AND C.ArchiveDate IS NULL
            ";

            await ExecuteAsync(sqlTxt);
        }
    }
}