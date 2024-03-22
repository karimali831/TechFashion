using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface IOrderRepository
    {
        Task AddAsync(Order model);
    }

    public class OrderRepository(IConfiguration configuration) : DapperBaseRepository(configuration), IOrderRepository
    {
        private const string Table = "Orders";
        private static readonly string[] Fields = typeof(Order).DapperFields();


        public async Task AddAsync(Order model)
        {
            await ExecuteAsync(DapperHelper.Insert(Table, Fields), model);
        }
    }
}