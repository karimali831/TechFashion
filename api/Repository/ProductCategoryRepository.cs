using api.Data;
using api.Helper;
using api.Infrastructure;
using api.Models.Ebay;

namespace api.Repository
{
    public interface IProductCategoryRepository
    {
        Task<ProductCategory> GetAsync(int id);
        Task<ProductCategory?> GetByNameAsync(string name, bool isSecondCat);
        Task<int> GetOrCreateAsync(ProductActiveListing product);
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


        public async Task<int> GetOrCreateAsync(ProductActiveListing product)
        {
            // firstProduct.Category, firstProduct.SecondCategory, firstProduct.CatNo, firstProduct.Cat2No)
            var existing = !string.IsNullOrEmpty(product.SecondCategory) ?
                await GetByNameAsync(product.SecondCategory, isSecondCat: true) :
                await GetByNameAsync(product.Category, isSecondCat: false);

            if (existing is not null)
            {
                return existing.Id;
            }

            var model = new ProductCategory
            {
                Name = product.Category,
                EbayCatNo = product.CatNo
            };

            if (!string.IsNullOrEmpty(product.SecondCategory))
            {
                var firstCategory = await QueryAsync<int>(DapperHelper.Insert(Table, Fields), model);

                model.Cat2Id = firstCategory.Single();
                model.EbayCatNo = product.Cat2No;
                model.Name = product.SecondCategory;
            }

            var result = await QueryAsync<int>(DapperHelper.Insert(Table, Fields), model);
            return result.Single();
        }
    }
}