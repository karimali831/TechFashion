using api.Data;
using api.Helper;
using api.Infrastructure;
using api.Models;

namespace api.Repository
{
    public interface IProductRepository
    {
        Task<bool> SlugExists(string slug);
        Task<IList<ProductDetail>> GetAllAsync();
        Task<IList<ProductCatalogue>> GetCatalogueAsync();
        Task UpdateStockAsync(int id, int stock);
        Task<int> InsertOrUpdateEbayItemAsync(Product model);
        Task<bool> SkuExists(string sku);
    }

    public class ProductRepository(DapperContext context) : DapperBaseRepository(context),
        IProductRepository
    {
        private const string Table = "Products";
        private static readonly string[] Fields = typeof(Product).DapperFields();


        public async Task<IList<ProductCatalogue>> GetCatalogueAsync()
        {
            const string sqlTxt = $@"
                ;SELECT 
                    p.Id, 
                    p.Title, 
                    p.Slug,
                    pi.ImageSrc,
                    P.Price,
                    0 AS Variant
                FROM [Products] AS P
                LEFT JOIN [ProductImages] AS PI
                ON pi.ProductId = p.Id and pi.Main = 1
                LEFT JOIN [ProductVariants] AS PV 
                ON PV.ProductId = P.Id
                WHERE p.Active = 1 AND PV.Id IS NULL
                UNION
                SELECT 
                    p.Id, 
                    p.Title, 
                    p.Slug,
                    pi.ImageSrc,
                    pv.Price,
                    1
                FROM [Products] AS P
                CROSS APPLY
                (
                    SELECT TOP 1 PV.Id, Price
                    FROM [ProductVariants] AS PV
                  
                    WHERE PV.ProductId = p.Id 
                    ORDER BY PV.Price ASC
                ) AS PV
                LEFT JOIN [ProductImages] AS PI
                ON pi.ProductId = p.Id and PI.Main = 1
                WHERE p.Active = 1 
            ";

            return (await QueryAsync<ProductCatalogue>(sqlTxt)).ToList();
            ;
        }

        public async Task<IList<ProductDetail>> GetAllAsync()
        {
            const string sqlTxt = $@"
                ;SELECT 
                    p.Id, 
                    pv.Id AS VariantId,
                    p.Title, 
                    p.Description, 
                    p.Slug, 
                    CASE WHEN pv.Price IS NULL THEN p.Price ELSE pv.Price END AS Price,
                    CASE WHEN pv.Stock IS NULL THEN p.Stock ELSE pv.Stock END AS Stock,
                    CASE WHEN pv.Sku IS NULL THEN p.Sku ELSE pv.Sku END AS Sku,
                    p.Active, 
                    pv.Variant,
                    pv.Variant2,
                    pi.ImageSrc
                FROM [Products] AS P
                LEFT JOIN [ProductVariants] AS PV
                ON PV.ProductId = p.Id 
                LEFT JOIN [ProductImages] AS pi
                ON pi.ProductId = p.Id AND pi.Main = 1
                WHERE p.Active = 1 
            ";

            return (await QueryAsync<ProductDetail>(sqlTxt)).ToList();
            ;
        }

        public async Task UpdateStockAsync(int id, int stock)
        {
            await ExecuteAsync($"UPDATE {Table} SET Stock = @stock WHERE Id = @id AND Stock IS NOT NULL", new { id, stock });
        }

        public async Task<int> InsertOrUpdateEbayItemAsync(Product model)
        {
            if (!model.EbayItemNo.HasValue)
                throw new ApplicationException("Not an ebay item");

            var existing = await GetByEbayItemNoAsync(model.EbayItemNo.Value);

            if (existing is not null)
            {
                await UpdateAsync(model);
                return existing.Id;
            }

            var result = await QueryAsync<int>(DapperHelper.Insert(Table, Fields), model);
            return result.Single();
        }

        private async Task<bool> UpdateAsync(Product model)
        {
            return await ExecuteAsync(DapperHelper.Update(Table, Fields), model);
        }

        private async Task<Product?> GetByEbayItemNoAsync(long itemNo)
        {
            return await QueryFirstOrDefaultAsync<Product>($"{DapperHelper.Select(Table, Fields)} WHERE EbayItemNo = @itemNo", new { itemNo });
        }

        public async Task<bool> SlugExists(string slug)
        {
            return await ItemExistsAsync(Table, "Slug = @slug", new { slug });
        }

        public async Task<bool> SkuExists(string sku)
        {
            return await ItemExistsAsync(Table, "Sku = @sku", new { sku });
        }
    }
}