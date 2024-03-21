using api.Helper;
using api.Repository;
using api.ViewModels;

namespace api.Service
{
    public interface IProductListingService
    {
        Task<ProductViewModel> GetAllAsync();
    }

    public class ProductListingService(IProductRepository productRepository) : IProductListingService
    {
        private readonly IProductRepository _productRepository = productRepository;


        public async Task<ProductViewModel> GetAllAsync()
        {
            var productCatalogue = (await _productRepository.GetCatalogueAsync())
                .Select(x =>
                {
                    x.PriceStr = $"{(x.Variant ? "From " : "")}{x.Price.ToCurrencyGbp()}";
                    return x;
                })
                .ToList();

            var productDetails = (await _productRepository.GetAllAsync())
                .Select(x =>
                {
                    x.PriceStr = x.Price.ToCurrencyGbp();
                    return x;
                })
                .ToList();

            var productIds = productDetails
                .DistinctBy(x => x.Id)
                .Select(x => x.Id);

            var productVariants = (from productId in productIds
                                   let variations = productDetails.Where(x => x.Id == productId)
                                       .SelectMany(x => x.VariantList)
                                   let attributes = variations.DistinctBy(x => x.Attribute)
                                       .Select(x => x.Attribute)
                                   from attribute in attributes
                                   let options = variations.Where(x => x.Attribute == attribute)
                                       .DistinctBy(x => x.Value)
                                       .Select(x => x.Value)
                                   select new ProductAttribute { ProductId = productId, Attribute = attribute, Options = options })
                .ToList();

            return new ProductViewModel
            {
                Catalogue = productCatalogue,
                Details = productDetails,
                Variants = productVariants
            };
        }


    }
}