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

            return (await QueryAsync<ProductCatalogue>(sqlTxt)).ToList(); ;
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
                    pi.ImageSrc
                FROM [Products] AS P
                LEFT JOIN [ProductVariants] AS PV
                ON PV.ProductId = p.Id 
                LEFT JOIN [ProductImages] AS pi
                ON pi.ProductId = p.Id AND pi.Main = 1
                WHERE p.Active = 1 
            ";

            return (await QueryAsync<ProductDetail>(sqlTxt)).ToList(); ;
        }
    }
}