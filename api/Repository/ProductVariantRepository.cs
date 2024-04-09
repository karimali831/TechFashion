using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface IProductVariantRepository
    {
        Task<IEnumerable<Variant>> GetAllAttributesAsync();
        Task<IList<ProductVariant>> GetAllByProductIdsAsync(IList<int> productIds);
        Task UpdateStockAsync(int id, int stock);
        Task<bool> InsertOrUpdateAsync(ProductVariant model);
    }

    public class ProductVariantRepository(IConfiguration configuration) : DapperBaseRepository(configuration),
        IProductVariantRepository
    {
        private const string Table = "ProductVariants";
        private static readonly string[] Fields = typeof(ProductVariant).DapperFields();


        public async Task<IEnumerable<Variant>> GetAllAttributesAsync()
        {
            return await QueryAsync<Variant>(DapperHelper.Select("Variants", typeof(Variant).DapperFields()));
        }

        public async Task<IList<ProductVariant>> GetAllByProductIdsAsync(IList<int> productIds)
        {
            return (
                await QueryAsync<ProductVariant>($"{DapperHelper.Select(Table, Fields)} WHERE ProductId IN @productIds",
                    new { productIds })
            ).ToList();
        }

        public async Task UpdateStockAsync(int id, int stock)
        {
            await ExecuteAsync($"UPDATE {Table} SET Stock = @stock WHERE Id = @id AND Stock IS NOT NULL", new { id, stock });
        }

        public async Task<bool> InsertOrUpdateAsync(ProductVariant model)
        {
            var existing = await GetByIdAsync(model.Id);

            if (existing is not null)
            {
                return await UpdateAsync(model);
            }

            return await ExecuteAsync(DapperHelper.Insert(Table, Fields), model);
        }

        private async Task<bool> UpdateAsync(ProductVariant model)
        {
            return await ExecuteAsync(DapperHelper.Update(Table, Fields), model);
        }

        private async Task<ProductVariant?> GetByIdAsync(int id)
        {
            return await QueryFirstOrDefaultAsync<ProductVariant>($"{DapperHelper.Select(Table, Fields)} WHERE Id = @id", new { id });
        }
    }
}