using api.Data;
using api.Repository;

namespace api.Service
{
    public interface IOrderService
    {
        Task AddAsync(Order model);
    }

    public class OrderService(IOrderRepository orderRepository) : IOrderService
    {
        private readonly IOrderRepository _orderRepository = orderRepository;

        public async Task AddAsync(Order model)
        {
            await _orderRepository.AddAsync(model);
        }
    }
}