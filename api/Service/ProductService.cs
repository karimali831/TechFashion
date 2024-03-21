using api.Data;
using api.Dto;
using api.Repository.EF;
using api.ViewModels;

namespace api.Service
{
    public interface IProductService
    {
        Task<ApiResponse<ProductViewModel>> GetAsync(int id);
        Task<ApiResponse<ProductViewModel>> CreateAsync(CreateProductRequestDto dto);
        Task<ApiResponse<ProductViewModel>> UpdateAsync(UpdateProductRequestDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }

    public class ProductService(IProductEFRepository productEFRepository) : IProductService
    {
        private readonly IProductEFRepository _productEFRepository = productEFRepository;


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