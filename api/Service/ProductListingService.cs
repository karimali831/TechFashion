using api.Data;
using api.Dto;
using api.Helper;
using api.Repository;
using api.Repository.EF;
using api.ViewModels;

namespace api.Service
{
    public interface IProductListingService
    {
        Task<ProductViewModel> GetAllAsync();
        Task<ApiResponse<ProductViewModel>> GetAsync(int id);
        Task<ApiResponse<ProductViewModel>> CreateAsync(CreateProductRequestDto dto);
        Task<ApiResponse<ProductViewModel>> UpdateAsync(UpdateProductRequestDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }

    public class ProductListingService(
        IProductEFRepository productEFRepository,
        IProductRepository productRepository) : IProductListingService
    {
        private readonly IProductEFRepository _productEFRepository = productEFRepository;
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

            var productDetails = await _productRepository.GetAllAsync();

            var productIds = productDetails
                .DistinctBy(x => x.Id)
                .Select(x => x.Id);

            var productVariants = new List<ProductAttribute>();

            foreach (var productId in productIds)
            {
                var variations = productDetails
                .Where(x => x.Id == productId)
                .SelectMany(x => x.VariationsList);

                var attributes = variations
                    .DistinctBy(x => x.Attribute)
                    .Select(x => x.Attribute);

                foreach (var attribute in attributes)
                {
                    var options = variations
                        .Where(x => x.Attribute == attribute)
                        .DistinctBy(x => x.Value)
                        .Select(x => x.Value);

                    productVariants.Add(
                            new ProductAttribute
                            {
                                ProductId = productId,
                                Attribute = attribute,
                                Options = options
                            }
                        );
                }
            }

            return new ProductViewModel
            {
                Catalogue = productCatalogue,
                Details = productDetails,
                Variants = productVariants
            };
        }

        public async Task<ApiResponse<ProductViewModel>> GetAsync(int id)
        {
            return await GetAsync(id);
        }

        public async Task<ApiResponse<ProductViewModel>> CreateAsync(CreateProductRequestDto dto)
        {
            var productModel = dto.ToEntity<Product, CreateProductRequestDto>();
            return await _productEFRepository.CreateAsync(productModel);
        }

        public async Task<ApiResponse<ProductViewModel>> UpdateAsync(UpdateProductRequestDto dto)
        {
            var model = dto.ToEntity<Product, UpdateProductRequestDto>();
            return await _productEFRepository.UpdateAsync(model);
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            return await _productEFRepository.DeleteAsync(id);
        }
    }
}