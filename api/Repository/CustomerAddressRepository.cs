using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface ICustomerAddressRepository
    {
        Task<CustomerAddress?> GetMainAsync(int userId);
        Task<int> GetOrAddAsync(CustomerAddress model);
        Task<CustomerAddress?> FindAsync(CustomerAddress model);
    }

    public class CustomerAddressRepository(IConfiguration configuration) : DapperBaseRepository(configuration), ICustomerAddressRepository
    {
        private const string Table = "CustomerAddress";
        private static readonly string[] Fields = typeof(CustomerAddress).DapperFields();

        public async Task<CustomerAddress?> GetMainAsync(int userId)
        {
            return await QueryFirstOrDefaultAsync<CustomerAddress>($"{DapperHelper.Select(Table, Fields)} WHERE UserId = @userId AND Main = 1", new { userId });
        }


        public async Task<int> GetOrAddAsync(CustomerAddress model)
        {
            var exists = await FindAsync(model);

            if (exists is not null)
            {
                return exists.Id;
            }

            var result = await QueryAsync<int>(DapperHelper.Insert(Table, Fields), model);
            return result.Single();
        }

        public async Task<CustomerAddress?> FindAsync(CustomerAddress model)
        {
            return await QueryFirstOrDefaultAsync<CustomerAddress>($"{DapperHelper.Select(Table, Fields)} WHERE UserId = @userId AND Name = @name AND Line1 = @addressLine1 AND PostalCode = @postalCode",
                new
                {
                    userId = model.UserId,
                    name = model.Name,
                    addressLine1 = model.Line1,
                    postalCode = model.PostalCode
                });
        }
    }
}