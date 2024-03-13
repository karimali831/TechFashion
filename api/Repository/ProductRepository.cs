using api.Infrastructure;
using api.Models;

namespace api.Repository
{
    public interface IProductRepository
    {
        Task<IList<ProductDetail>> GetAllAsync();
        Task<IList<ProductCatalogue>> GetCatalogueAsync();
    }

    public class ProductRepository(IConfiguration configuration) : DapperBaseRepository(configuration), IProductRepository
    {

        public async Task<IList<ProductCatalogue>> GetCatalogueAsync()
        {
            const string sqlTxt = $@"
                ;SELECT 
                    p.Id, 
                    p.Title, 
                    p.Slug,
                    PI.Url AS ImageSrc,
                    P.Price,
                    0 AS Variant
                FROM [Products] AS P
                JOIN [ProductImages] AS PI
                ON PI.ProductId = P.Id and PI.Main = 1
                LEFT JOIN [ProductVariants] AS PV 
                ON PV.ProductId = P.Id
                WHERE p.Active = 1 AND PV.Id IS NULL
                UNION
                SELECT 
                    p.Id, 
                    p.Title, 
                    p.Slug,
                    PI.Url,
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
                LEFT JOIN  [ProductImages] AS PI
                ON PI.ProductVariantId = PV.Id and PI.Main = 1
                WHERE p.Active = 1 
            ";

            return (await QueryAsync<ProductCatalogue>(sqlTxt)).ToList(); ;
        }

        public async Task<IList<ProductDetail>> GetAllAsync()
        {
            const string sqlTxt = $@"
                ;SELECT 
                    p.Id, 
                    pv.Id AS ProductVariantId,
                    p.Title, 
                    p.Description, 
                    p.Slug, 
                    CASE WHEN pv.Price IS NULL THEN p.Price ELSE pv.Price END AS Price,
                    CASE WHEN pv.Stock IS NULL THEN p.Stock ELSE pv.Stock END AS Stock,
                    CASE WHEN pv.Sku IS NULL THEN p.Sku ELSE pv.Sku END AS Sku,
                    p.Active, 
                    pv.Variations,
                    CASE WHEN PV.Id IS NULL THEN PI1.Url ELSE PI2.Url END AS ImageSrc,
                    CASE WHEN PV.Id IS NULL THEN PI1.Main ELSE PI2.Main END AS ImageMain
                FROM [Products] AS P
                LEFT JOIN [ProductVariants] AS PV
                ON PV.ProductId = P.Id 
                LEFT JOIN [ProductImages] AS PI1
                ON PI1.ProductId = P.Id
                LEFT JOIN [ProductImages] AS PI2
                ON PI2.ProductVariantId = pv.Id
                WHERE p.Active = 1 
            ";

            return (await QueryAsync<ProductDetail>(sqlTxt)).ToList(); ;
        }
    }
}