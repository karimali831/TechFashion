using api.Dto;
using api.Service;
using api.Service.Ebay;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController(
        IProductListingService productListingService,
        IEbayFeedService ebayFeedService) : ControllerBase
    {
        private readonly IProductListingService _productListingService = productListingService;
        private readonly IEbayFeedService _ebayFeedService = ebayFeedService;

        [HttpGet("test")]
        public async Task<IActionResult> Test()
        {
            var items = await _ebayFeedService.GetItemsAsync();

            return Ok(items);
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
            var response = await _productListingService.GetAsync(id);

            if (response.ErrorMsg is null)
            {
                return Ok(response);
            }

            return NotFound(response.ErrorMsg);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductRequestDto dto)
        {
            var response = await _productListingService.CreateAsync(dto);

            if (response.ErrorMsg is null)
            {
                return Ok(response);
            }

            throw new ApplicationException(response.ErrorMsg);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateProductRequestDto dto)
        {
            var response = await _productListingService.UpdateAsync(dto);

            if (response.ErrorMsg is not null)
            {
                return NotFound(response.ErrorMsg);
            }

            return Ok(response);
        }


        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var response = await _productListingService.DeleteAsync(id);

            if (response.ErrorMsg is not null)
            {
                return NotFound(response.ErrorMsg);
            }

            return Ok();
        }
    }
}