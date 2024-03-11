using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Infrastructure;
using api.ViewModels;

namespace api.Repository
{
    public interface IProductRepository
    {

    }

    public class ProductRepository : DapperBaseRepository, IProductRepository
    {
        public ProductRepository(IConfiguration configuration) : base(configuration)
        {

        }

        public async Task<IEnumerable<ProductViewModel>> GetAllAsync()
        {
            const string sqlTxt = $@"
                
            ";

            return await QueryAsync<ProductViewModel>(sqlTxt);
        }
    }
}