using api.Infrastructure;
using api.ViewModels;

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
                    pvo.Price,
                    1
                FROM [Products] AS P
                CROSS APPLY
                (
                    SELECT TOP 1 PVO.Id, Price
                    FROM [ProductVariants] AS PV
                    JOIN [ProductVariantOptions] AS PVO
                    ON PVO.ProductVariantId = PV.Id
                    WHERE PV.ProductId = p.Id AND PV.Active = 1
                    ORDER BY PVO.Price ASC
                ) AS PVO
                LEFT JOIN  [ProductImages] AS PI
                ON PI.ProductVariantOptionId = PVO.Id and PI.Main = 1
                WHERE p.Active = 1 
            ";

            return (await QueryAsync<ProductCatalogue>(sqlTxt)).ToList(); ;
        }

        public async Task<IList<ProductDetail>> GetAllAsync()
        {
            const string sqlTxt = $@"
                ;SELECT 
                    p.Id, 
                    p.Title, 
                    p.Description, 
                    p.Slug, 
                    CASE WHEN PVO.Price IS NULL THEN p.Price ELSE PVO.Price END AS Price,
                    CASE WHEN PVO.Stock IS NULL THEN p.Stock ELSE PVO.Stock END AS Stock,
                    CASE WHEN PVO.Sku IS NULL THEN p.Sku ELSE PVO.Sku END AS Sku,
                    p.Active,
                    pa.Name AS Variant, 
                    PVO.Name as VariantValue,
                    CASE WHEN PVO.Id IS NULL THEN PI1.Url ELSE PI2.Url END AS ImageSrc,
                    CASE WHEN PVO.Id IS NULL THEN PI1.Main ELSE PI2.Main END AS ImageMain
                FROM [Products] AS P
                LEFT JOIN [ProductVariants] AS PA
                ON PA.ProductId = P.Id AND PA.Active = 1
                LEFT JOIN [ProductVariantOptions] AS PVO
                ON PVO.ProductVariantId = PA.Id
                LEFT JOIN [ProductImages] AS PI1
                ON PI1.ProductId = P.Id
                LEFT JOIN [ProductImages] AS PI2
                ON PI2.ProductVariantOptionId = PVO.Id
                WHERE p.Active = 1  
            ";

            return (await QueryAsync<ProductDetail>(sqlTxt)).ToList(); ;
        }
    }
}