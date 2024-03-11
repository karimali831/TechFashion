using api.Dto;
using api.Models;
using api.Repository;
using api.ViewModels;

namespace api.Service
{
    public interface IProductListingService
    {
        Task<IList<ProductViewModel>> GetAllAsync();
        Task<ApiResponse<ProductViewModel>> GetAsync(int id);
        Task<ApiResponse<ProductViewModel>> CreateAsync(CreateProductRequestDto dto);
        Task<ApiResponse<ProductViewModel>> UpdateAsync(UpdateProductRequestDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }

    public class ProductListingService(IProductRepository productRepository) : IProductListingService
    {
        private readonly IProductRepository _productRepository = productRepository;

        public async Task<IList<ProductViewModel>> GetAllAsync()
        {
            return await _productRepository.GetAllAsync();
        }

        public async Task<ApiResponse<ProductViewModel>> GetAsync(int id)
        {
            return await GetAsync(id);
        }

        public async Task<ApiResponse<ProductViewModel>> CreateAsync(CreateProductRequestDto dto)
        {
            var productModel = dto.ToEntity<Product, CreateProductRequestDto>();
            return await _productRepository.CreateAsync(productModel);
        }

        public async Task<ApiResponse<ProductViewModel>> UpdateAsync(UpdateProductRequestDto dto)
        {
            var model = dto.ToEntity<Product, UpdateProductRequestDto>();
            return await _productRepository.UpdateAsync(model);
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            return await _productRepository.DeleteAsync(id);
        }
    }
}