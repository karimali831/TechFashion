using System.Net.Http.Headers;
using api.Data;
using api.Dto;
using api.Mapper;
using api.Models;
using api.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace api.Service
{
    public interface IProductListingService
    {
        Task<Product?> GetByIdAsync(int id);
        Task<List<ProductViewModel>> GetAllAsync();
        Task<ProductViewModel> CreateAsync(CreateProductRequestDto dto);
        Task<ProductViewModel> UpdateAsync(int id, UpdateProductRequestDto dto);
        Task DeleteAsync(int id);
    }

    public class ProductListingService : IProductListingService
    {
        private readonly AppDatabaseContext _context;

        public ProductListingService(AppDatabaseContext context)
        {
            _context = context;
        }

        public async Task<List<ProductViewModel>> GetAllAsync()
        {
            return (await _context.Products.ToListAsync())
                .Select(p => p.ToViewModel())
                .ToList();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<ApiResponse<ProductViewModel>> CreateAsync(CreateProductRequestDto dto)
        {
            var productModel = dto.ToEntity();
            await _context.Products.AddAsync(productModel);
            await _context.SaveChangesAsync();

            return productModel.ToViewModel();
        }

        public async Task<ApiResponse<ProductViewModel>> UpdateAsync(int id, UpdateProductRequestDto dto)
        {
            var productModel = await _context.Products.SingleOrDefaultAsync(x => x.Id == id);

            if (productModel is null)
            {
                return new ApiResponse<ProductViewModel>
                {
                    ErrorMsg = "Product not found"
                };
            }

            productModel.Sku = dto.Sku;
            productModel.Price = dto.Price;

            await _context.SaveChangesAsync();

            return new ApiResponse<ProductViewModel>
            {
                Data = productModel.ToViewModel()
            };
        }

        public async Task<ApiResponse<ProductViewModel>> DeleteAsync(int id)
        {
            var productModel = await _context.Products.SingleOrDefaultAsync(x => x.Id == id);

            if (productModel is null)
            {
                return new ApiResponse<ProductViewModel>
                {
                    ErrorMsg = "Product not found"
                };
            }

            await _context.Products.Remove(productModel);
        }
    }
}