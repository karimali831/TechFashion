using api.Data;
using api.Dto;
using api.Infrastructure;
using api.Models;
using api.ViewModels;

namespace api.Repository.EF
{
    public interface IProductEFRepository
    {
        Task<IList<ProductViewModel>> GetAllAsync();
        Task<ApiResponse<ProductViewModel>> GetAsync(int id);
        Task<ApiResponse<ProductViewModel>> CreateAsync(Product model);
        Task<ApiResponse<ProductViewModel>> UpdateAsync(Product model);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }

    public class ProductEFRepository(AppDatabaseContext context) : EFRepositoryBase<Product>(context), IProductEFRepository
    {
        public async Task<IList<ProductViewModel>> GetAllAsync()
        {
            return await GetViewModelAsync<ProductViewModel>();
        }

        public async Task<ApiResponse<ProductViewModel>> GetAsync(int id)
        {
            return await GetViewModelAsync<ProductViewModel>(id);
        }

        public async Task<ApiResponse<ProductViewModel>> CreateAsync(Product model)
        {
            return await InsertAndReturnViewModelAsync<ProductViewModel>(model);
        }

        public async Task<ApiResponse<ProductViewModel>> UpdateAsync(Product model)
        {
            return await UpdateAndReturnViewModelAsync<ProductViewModel>(model);
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            return await RemoveAsync(id);
        }
    }
}