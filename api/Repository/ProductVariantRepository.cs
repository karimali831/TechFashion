using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface IProductVariantRepository
    {
        Task<IList<ProductVariant>> GetAllByProductIdsAsync(IList<int> productIds);
    }

    public class ProductVariantRepository(IConfiguration configuration) : DapperBaseRepository(configuration), IProductVariantRepository
    {
        private static readonly string TABLE = "ProductVariants";
        private static readonly string[] FIELDS = typeof(ProductVariant).DapperFields();


        public async Task<IList<ProductVariant>> GetAllByProductIdsAsync(IList<int> productIds)
        {
            return (
                await QueryAsync<ProductVariant>($"{DapperHelper.Select(TABLE, FIELDS)} WHERE ProductId IN @productIds", new { productIds })
            ).ToList();
        }
    }
}