using api.Dto.Stripe;
using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController(
        IpApiClient ipApiClient,
        IOrderService orderService,
        IAccountService accountService,
        IStripeOrderService stripeOrderService) : ControllerBase
    {
        private readonly IpApiClient _ipApiClient = ipApiClient;
        private readonly IAccountService _accountService = accountService;
        private readonly IOrderService _orderService = orderService;
        private readonly IStripeOrderService _stripeOrderService = stripeOrderService;


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

        [HttpGet("GetAccount/{userId}")]
        public async Task<IActionResult> GetAccount(int userId)
        {
            var account = await _accountService.GetAsync(userId);
            return Ok(account);
        }

        [HttpGet("GetOrderedItems/{orderRef}")]
        public async Task<IActionResult> GetOrderedItems(int orderRef)
        {
            var orderHistory = await _orderService.GetOrderedItemsAsync(orderRef);
            return Ok(orderHistory);
        }
    }
}