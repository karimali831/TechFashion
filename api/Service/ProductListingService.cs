using api.Data;
using api.Dto;
using api.Infrastructure;
using api.Models;
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

    public class ProductListingService(AppDatabaseContext context) : EFRepositoryBase<Product>(context), IProductListingService
    {
        public async Task<IList<ProductViewModel>> GetAllAsync()
        {
            return await GetViewModelAsync<ProductViewModel>();
        }

        public async Task<ApiResponse<ProductViewModel>> GetAsync(int id)
        {
            return await GetViewModelAsync<ProductViewModel>(id);
        }

        public async Task<ApiResponse<ProductViewModel>> CreateAsync(CreateProductRequestDto dto)
        {
            var productModel = dto.ToEntity<Product, CreateProductRequestDto>();
            return await InsertAndReturnViewModelAsync<ProductViewModel>(productModel);
        }

        public async Task<ApiResponse<ProductViewModel>> UpdateAsync(UpdateProductRequestDto dto)
        {
            var model = dto.ToEntity<Product, UpdateProductRequestDto>();
            return await UpdateAndReturnViewModelAsync<ProductViewModel>(model);
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            return await RemoveAsync(id);
        }
    }
}