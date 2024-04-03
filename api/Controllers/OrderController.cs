using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController(IOrderService orderService) : ControllerBase
    {
        private readonly IOrderService _orderService = orderService;


        [HttpGet("Get/{paymentIntentId}")]
        public async Task<IActionResult> Get(string paymentIntentId)
        {
            var order = await _orderService.GetByPaymentIdAsync(paymentIntentId);
            return Ok(order);
        }

        [HttpGet("GetOrderedItems/{orderRef}")]
        public async Task<IActionResult> GetOrderedItems(int orderRef)
        {
            var orderHistory = await _orderService.GetOrderedItemsAsync(orderRef);
            return Ok(orderHistory);
        }
    }
}