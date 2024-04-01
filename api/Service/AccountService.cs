using api.ViewModels;

namespace api.Service
{
    public interface IAccountService
    {
        Task<AccountViewModel> GetAsync(int userId);
    }

    public class AccountService(
        IOrderService orderService,
        ICustomerAddressService customerAddressService) : IAccountService
    {
        private readonly IOrderService _orderService = orderService;
        private readonly ICustomerAddressService _customerAddressService = customerAddressService;

        public async Task<AccountViewModel> GetAsync(int userId)
        {
            var orders = await _orderService.GetHistoryAsync(userId);
            var addresses = await _customerAddressService.GetAllAsync(userId);

            return new AccountViewModel
            {
                Orders = orders,
                Addresses = addresses
            };
        }
    }
}