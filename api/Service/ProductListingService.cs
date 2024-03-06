using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Service
{
    public interface IProductListingService 
    {
        Task<Product?> GetByIdAsync(int id);
        Task<List<Product>> GetAllAsync();
    }
    
    public class ProductListingService : IProductListingService
    {
        private readonly AppDatabaseContext _context;

        public ProductListingService(AppDatabaseContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllAsync() 
        {
            var products = await _context.Products.ToListAsync();
            return products;
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }
    }
}