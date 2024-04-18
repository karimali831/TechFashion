using api.Data;
using api.Models;
using api.Repository;
using CloudChef.Library.Services;

namespace api.Service
{
    public interface IOrderService
    {
        Task<Order> GetAsync(int id);
        Task<Order?> GetPendingByCartIdAsync(int cartId);
        Task UpdateShippingAddressIdAsync(int id, int? shippingAddressId);
        Task<int> AddAsync(Order model);
        Task UpdateAsync(Order model);
        Task<OrderDetail> GetDetailsAsync(int? id, int? orderRef);
        Task<IList<OrderDetail>> GetHistoryAsync(int userId);
        Task<IList<OrderItem>> GetOrderedItemsAsync(int orderRef);
        Task SendOrderSuccessEmailAsync(string email, int orderRef);
    }

    public class OrderService(
        IConfiguration configuration,
        IMailService mailService,
        IOrderRepository orderRepository) : IOrderService
    {
        private static Random _random = new();
        private readonly IMailService _mailService = mailService;
        private readonly IConfiguration _configuration = configuration;
        private readonly IOrderRepository _orderRepository = orderRepository;


        public async Task<int> AddAsync(Order model)
        {
            var orderRef = _random.Next(100000000, 999999999);
            // var exists = await _orderRepository.GetByRefAsync(orderRef);
            model.Ref = orderRef;

            return await _orderRepository.AddAsync(model);
        }

        public async Task SendOrderSuccessEmailAsync(string email, int orderRef)
        {
            var url = $"{_configuration.GetValue<string>("WebUrl")}/order/{orderRef}";

            string mailBody = @$"
                <hr /><br /> 
                Thanks for your order. We’ll let you know once your item(s) have <br />
                dispatched. Your estimated delivery date is indicated below. You can view <br />
                the status of your order or make changes to it by visiting Your orders or <br />
                <a href='{url}'>visit this link</a> directly.
            ";

            await _mailService.SendAsync("Elegance Craft Order Confirmation", email, mailBody);
        }

        public async Task<Order?> GetPendingByCartIdAsync(int cartId)
        {
            return await _orderRepository.GetPendingByCartIdAsync(cartId);
        }

        public async Task<Order> GetAsync(int id)
        {
            return await _orderRepository.GetAsync(id);
        }

        public async Task UpdateAsync(Order model)
        {
            await _orderRepository.UpdateAsync(model);
        }

        public async Task<OrderDetail> GetDetailsAsync(int? id, int? orderRef)
        {
            return await _orderRepository.GetDetailsAsync(id, orderRef);
        }

        public async Task<IList<OrderDetail>> GetHistoryAsync(int userId)
        {
            return await _orderRepository.GetHistoryAsync(userId);
        }

        public async Task<IList<OrderItem>> GetOrderedItemsAsync(int orderRef)
        {
            return await _orderRepository.GetOrderedItemsAsync(orderRef);
        }

        public async Task UpdateShippingAddressIdAsync(int id, int? shippingAddressId)
        {
            await _orderRepository.UpdateShippingAddressIdAsync(id, shippingAddressId);
        }
    }
}