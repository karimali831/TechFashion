using api.Data;
using api.Dto;
using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController(ICartProductService cartProductService) : ControllerBase
    {
        private readonly ICartProductService _cartProductService = cartProductService;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var basket = await _cartProductService.GetBasketAsync();

            if (basket is null)
            {
                return NoContent();
            }

            return Ok(basket);
        }


        [HttpPost("AddProduct")]
        public async Task<IActionResult> AddProduct([FromBody] CartProduct model)
        {
            var request = await _cartProductService.AddProductAsync(model);

            return NoContent();
        }

        [HttpGet("RemoveProduct/{id}")]
        public async Task<IActionResult> RemoveProduct([FromRoute] int id)
        {
            var request = await _cartProductService.RemoveProductAsync(id);

            return NoContent();
        }

        [HttpGet("UpdateProductQuantity/{id}/{quantity}")]
        public async Task<IActionResult> UpdateProductQuantity([FromRoute] int id, int quantity)
        {
            var request = await _cartProductService.UpdateProductQuantityAsync(id, quantity);

            return NoContent();
        }
    }
}