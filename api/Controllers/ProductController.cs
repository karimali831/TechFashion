using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductListingService _productListingService;

        public ProductController(IProductListingService productListingService)
        {
            _productListingService = productListingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() 
        {
            var products = await _productListingService.GetAllAsync();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id) 
        {
            var product = await _productListingService.GetByIdAsync(id);

            if (product is null) 
            {
                return NotFound();
            }

            return Ok(product); 
        }
    }
}