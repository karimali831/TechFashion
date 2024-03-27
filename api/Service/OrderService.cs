using api.Data;
using api.Models;
using api.Repository;

namespace api.Service
{
    public interface IOrderService
    {
        Task AddAsync(Order model);
        Task<IList<OrderHistory>> GetHistoryAsync(int userId);
        Task<IList<OrderItem>> GetOrderedItemsAsync(int cartId);
    }

    public class OrderService(IOrderRepository orderRepository) : IOrderService
    {
        private readonly IOrderRepository _orderRepository = orderRepository;

        public async Task AddAsync(Order model)
        {
            await _orderRepository.AddAsync(model);
        }

        public async Task<IList<OrderHistory>> GetHistoryAsync(int userId)
        {
            return await _orderRepository.GetHistoryAsync(userId);
        }

        public async Task<IList<OrderItem>> GetOrderedItemsAsync(int cartId)
        {
            return await _orderRepository.GetOrderedItemsAsync(cartId);
        }
    }
}