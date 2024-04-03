using api.Data;
using api.Models;
using api.Repository;

namespace api.Service
{
    public interface IOrderService
    {
        Task AddAsync(Order model);
        Task<OrderHistory> GetByPaymentIdAsync(string paymentIntentId);
        Task<IList<OrderHistory>> GetHistoryAsync(int userId);
        Task<IList<OrderItem>> GetOrderedItemsAsync(int orderRef);
    }

    public class OrderService(IOrderRepository orderRepository) : IOrderService
    {
        private static Random _random = new();
        private readonly IOrderRepository _orderRepository = orderRepository;

        public async Task AddAsync(Order model)
        {
            var orderRef = _random.Next(100000000, 999999999);
            // var exists = await _orderRepository.GetByRefAsync(orderRef);
            model.Ref = orderRef;

            await _orderRepository.AddAsync(model);
        }

        public async Task<OrderHistory> GetByPaymentIdAsync(string paymentIntentId)
        {
            return await _orderRepository.GetByPaymentIdAsync(paymentIntentId);
        }

        public async Task<IList<OrderHistory>> GetHistoryAsync(int userId)
        {
            return await _orderRepository.GetHistoryAsync(userId);
        }

        public async Task<IList<OrderItem>> GetOrderedItemsAsync(int orderRef)
        {
            return await _orderRepository.GetOrderedItemsAsync(orderRef);
        }
    }
}