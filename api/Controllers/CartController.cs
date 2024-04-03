using api.Dto;
using api.Dto.Stripe;
using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController(
        ICartService cartService,
        ICartProductService cartProductService,
        IStripeOrderService stripeOrderService) : ControllerBase
    {
        private readonly ICartService _cartService = cartService;
        private readonly ICartProductService _cartProductService = cartProductService;
        private readonly IStripeOrderService _stripeOrderService = stripeOrderService;


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

        [HttpPost("CreatePaymentIntent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentIntentRequest request, CancellationToken ct)
        {
            try
            {

                // var ipAddress = HttpContext.GetServerVariable("HTTP_X_FORWARDED_FOR") ?? HttpContext.Connection.RemoteIpAddress?.ToString();
                // var ipAddressWithoutPort = ipAddress?.Split(':')[0];

                // var ipApiResponse = await _ipApiClient.Get(ipAddressWithoutPort, ct);

                // var test = new
                // {
                //     IpAddress = ipAddressWithoutPort,
                //     Country = ipApiResponse?.country,
                //     Region = ipApiResponse?.regionName,
                //     City = ipApiResponse?.city,
                //     District = ipApiResponse?.district,
                //     PostCode = ipApiResponse?.zip,
                //     Longitude = ipApiResponse?.lon.GetValueOrDefault(),
                //     Latitude = ipApiResponse?.lat.GetValueOrDefault(),
                // };

                var response = await _stripeOrderService.InitiateAsync(request);
                return Ok(response);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}