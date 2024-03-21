using api.Data;
using api.Dto;
using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController(
        IUserService userService,
        ICartService cartService,
        ICartProductService cartProductService) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly ICartService _cartService = cartService;
        private readonly ICartProductService _cartProductService = cartProductService;


        [HttpPost("GetBasket")]
        public async Task<IActionResult> GetBasket([FromBody] CartUserDto dto)
        {
            if (!dto.GuestCheckoutId.HasValue && dto.FirebaseUid is null)
            {
                return NoContent();
            }

            var basket = await _cartService.GetAsync(dto);

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