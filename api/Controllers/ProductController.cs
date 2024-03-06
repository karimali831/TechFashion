using api.Dto;
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

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductRequestDto dto)
        {
            var viewModel = await _productListingService.CreateAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id = viewModel.Id }, viewModel);
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateProductRequestDto dto)
        {
            try
            {
                var productModel = await _productListingService.UpdateAsync(id, dto);
                
                return Ok(productModel);
            }
            catch (Exception)
            {
                return NotFound();
            }
        }
    }
}