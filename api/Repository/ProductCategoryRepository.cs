using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface IProductCategoryRepository
    {
        Task<ProductCategory> GetAsync(int id);
        Task<ProductCategory?> GetByNameAsync(string name, bool isSecondCat);
        Task<int> GetOrCreateAsync(string catName, string? secondCatName = null);
    }

    public class ProductCategoryRepository(DapperContext context) : DapperBaseRepository(context), IProductCategoryRepository
    {
        private const string Table = "ProductCategories";
        private static readonly string[] Fields = typeof(ProductCategory).DapperFields();

        public async Task<ProductCategory> GetAsync(int id)
        {
            return await QueryFirstAsync<ProductCategory>($"{DapperHelper.Select(Table, Fields)} WHERE Id = @id", new { id });
        }

        public async Task<ProductCategory?> GetByNameAsync(string name, bool isSecondCat)
        {
            var sqlTxt = $"{DapperHelper.Select(Table, Fields)} WHERE Name = @name AND Cat2Id IS {(isSecondCat ? "NOT NULL" : "NULL")}";

            return await QueryFirstOrDefaultAsync<ProductCategory>(sqlTxt, new { name });
        }


        public async Task<int> GetOrCreateAsync(string catName, string? secondCatName = null)
        {
            var existing = !string.IsNullOrEmpty(secondCatName) ?
                await GetByNameAsync(secondCatName, isSecondCat: true) :
                await GetByNameAsync(catName, isSecondCat: false);

            if (existing is not null)
            {
                return existing.Id;
            }

            var model = new ProductCategory
            {
                Name = catName
            };

            if (!string.IsNullOrEmpty(secondCatName))
            {
                var firstCategory = await QueryAsync<int>(DapperHelper.Insert(Table, Fields), model);

                model.Cat2Id = firstCategory.Single();
                model.Name = secondCatName;
            }

            var result = await QueryAsync<int>(DapperHelper.Insert(Table, Fields), model);
            return result.Single();
        }
    }
}