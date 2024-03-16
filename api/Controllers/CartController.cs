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

        [HttpGet("GetBasket")]
        public async Task<IActionResult> GetBasket()
        {
            var basket = await _cartProductService.GetBasketAsync();

            if (basket is null)
            {
                return NoContent();
            }

            return Ok(basket);
        }


        [HttpPost("AddProduct")]
        public async Task<IActionResult> AddProduct([FromBody] AddProductToCartDto dto)
        {
            var request = await _cartProductService.AddProductAsync(dto);

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