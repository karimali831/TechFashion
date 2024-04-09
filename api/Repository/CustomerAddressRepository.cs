using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface ICustomerAddressRepository
    {
        Task<bool> AddOrUpdateAddress(CustomerAddress model);
        Task<CustomerAddress?> GetByIdAsync(int id);
        Task<CustomerAddress?> GetMainAsync(int userId);
        Task<IList<CustomerAddress>> GetAllAsync(int userId);
        Task<int> GetOrAddAsync(CustomerAddress model);
        Task<CustomerAddress?> FindAsync(CustomerAddress model);
        Task<CustomerAddress?> DeepFindAsync(CustomerAddress model);
        Task<bool> DeleteAsync(int id);
    }

    public class CustomerAddressRepository(DapperContext context) : DapperBaseRepository(context), ICustomerAddressRepository
    {
        private const string Table = "CustomerAddress";
        private static readonly string[] Fields = typeof(CustomerAddress).DapperFields();

        public async Task<CustomerAddress?> GetMainAsync(int userId)
        {
            return await QueryFirstOrDefaultAsync<CustomerAddress>($"{DapperHelper.Select(Table, Fields)} WHERE UserId = @userId AND Main = 1 AND RemovedDate IS NULL", new { userId });
        }


        public async Task<int> GetOrAddAsync(CustomerAddress model)
        {
            var exists = await FindAsync(model);

            if (exists is not null)
            {
                return exists.Id;
            }

            if (await GetMainAsync(model.UserId) is null)
            {
                model.Main = true;
            }

            var result = await QueryAsync<int>(DapperHelper.Insert(Table, Fields), model);
            return result.Single();
        }

        public async Task<CustomerAddress?> FindAsync(CustomerAddress model)
        {
            return await QueryFirstOrDefaultAsync<CustomerAddress>($"{DapperHelper.Select(Table, Fields)} WHERE UserId = @userId AND Name = @name AND Line1 = @addressLine1 AND PostalCode = @postalCode AND RemovedDate IS NULL",
                new
                {
                    userId = model.UserId,
                    name = model.Name,
                    addressLine1 = model.Line1,
                    postalCode = model.PostalCode
                });
        }

        public async Task<CustomerAddress?> DeepFindAsync(CustomerAddress model)
        {
            var sqlTxt = @$"
                {DapperHelper.Select(Table, Fields)} 
                WHERE UserId = @userId 
                AND Name = @name 
                AND Line1 = @addressLine1 
                AND Line2 = @addressLine2
                AND Main = @main
                AND PostalCode = @postalCode 
                AND RemovedDate IS NULL
            ";

            return await QueryFirstOrDefaultAsync<CustomerAddress>(sqlTxt,
                new
                {
                    userId = model.UserId,
                    name = model.Name,
                    addressLine1 = model.Line1,
                    addressLine2 = model.Line2,
                    main = model.Main,
                    postalCode = model.PostalCode
                });
        }


        public async Task<IList<CustomerAddress>> GetAllAsync(int userId)
        {
            var sqlTxt = $"{DapperHelper.Select(Table, Fields)} WHERE UserId = @userId AND RemovedDate IS NULL";

            return (await QueryAsync<CustomerAddress>(sqlTxt, new { userId }))
                .ToList();
        }

        public async Task<bool> AddOrUpdateAddress(CustomerAddress model)
        {
            if (model.Main is true)
            {
                await ExecuteAsync($"UPDATE {Table} SET Main = 0 WHERE UserId = @userId AND RemovedDate IS NULL",
                    new { userId = model.UserId }
                );
            }

            if (await GetMainAsync(model.UserId) is null)
            {
                model.Main = true;
            }

            if (model.Id == 0)
            {
                return await ExecuteAsync(DapperHelper.Insert(Table, Fields), model);
            }

            return await ExecuteAsync(DapperHelper.Update(Table, Fields), model);
        }

        public async Task<CustomerAddress?> GetByIdAsync(int id)
        {
            return await QueryFirstOrDefaultAsync<CustomerAddress>($"{DapperHelper.Select(Table, Fields)} WHERE Id = @id AND RemovedDate IS NULL", new { id });
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await ExecuteAsync($"UPDATE {Table} SET RemovedDate = GETDATE() WHERE Id = @id", new { id });
        }
    }
}