using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController(IOrderService orderService) : ControllerBase
    {
        private readonly IOrderService _orderService = orderService;


        [HttpGet("Get/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var order = await _orderService.GetDetailsAsync(id, orderRef: null);
            return Ok(order);
        }


        [HttpGet("GetByRef/{orderRef}")]
        public async Task<IActionResult> GetByRef(int orderRef)
        {
            var order = await _orderService.GetDetailsAsync(id: null, orderRef);
            return Ok(order);
        }


        [HttpGet("GetOrderedItems/{orderRef}")]
        public async Task<IActionResult> GetOrderedItems(int orderRef)
        {
            var OrderDetail = await _orderService.GetOrderedItemsAsync(orderRef);
            return Ok(OrderDetail);
        }
    }
}