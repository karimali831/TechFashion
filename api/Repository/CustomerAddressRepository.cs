using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface ICustomerAddressRepository
    {
        Task<int> AddAsync(CustomerAddress model);
        Task<CustomerAddress?> FindAsync(int userId, string addressLine1, string postalCode);
    }

    public class CustomerAddressRepository(IConfiguration configuration) : DapperBaseRepository(configuration), ICustomerAddressRepository
    {
        private const string Table = "CustomerAddress";
        private static readonly string[] Fields = typeof(CustomerAddress).DapperFields();


        public async Task<int> AddAsync(CustomerAddress model)
        {
            var exists = await FindAsync(model.UserId, model.Line1, model.PostalCode);

            if (exists is not null)
            {
                return exists.Id;
            }

            var result = await QueryAsync<int>(DapperHelper.Insert(Table, Fields), model);
            return result.Single();
        }

        public async Task<CustomerAddress?> FindAsync(int userId, string addressLine1, string postalCode)
        {
            return await QueryFirstOrDefaultAsync<CustomerAddress>($"{DapperHelper.Select(Table, Fields)} WHERE UserId = @userId AND Line1 = @addressLine1 AND PostalCode = @postalCode",
                new
                {
                    userId,
                    addressLine1,
                    postalCode
                });
        }
    }
}