using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface IReturnRepository
    {
        Task AddAsync(Order model);
    }

    public class ReturnRepository(IConfiguration configuration) : DapperBaseRepository(configuration), IReturnRepository
    {
        private const string Table = "OrderReturns";
        private static readonly string[] Fields = typeof(Order).DapperFields();


        public async Task AddAsync(Order model)
        {
            await ExecuteAsync(DapperHelper.Insert(Table, Fields), model);
        }
    }
}