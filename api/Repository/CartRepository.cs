using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface ICartRepository
    {
        Task<Cart?> GetAsync();
    }

    public class CartRepository(IConfiguration configuration) : DapperBaseRepository(configuration), ICartRepository
    {
        private static readonly string TABLE = "Carts";
        private static readonly string[] FIELDS = typeof(Cart).DapperFields();

        public async Task<Cart?> GetAsync()
        {
            return await QueryFirstOrDefaultAsync<Cart>(
                DapperHelper.Select(TABLE, FIELDS)
            );
        }
    }
}