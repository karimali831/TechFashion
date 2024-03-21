using api.Dto.Stripe;
using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController(IStripeOrderService stripeOrderService) : ControllerBase
    {
        private readonly IStripeOrderService _stripeOrderService = stripeOrderService;

        [HttpPost("CreatePaymentIntent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentIntentRequest request)
        {
            var response = await _stripeOrderService.InitiateAsync(request);
            return Ok(response);
        }
    }
}