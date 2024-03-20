using Stripe;

namespace api.Service.Stripe
{
    public interface IStripeCustomerService
    {
        Task<Customer> GetAsync(string customerId);
        Task<Customer> CreateAsync(int userId);
        Task<Customer?> GetByEmailAsync(string email);
        Task<PaymentMethod?> GetLatestPaymentMethodAsync(string customerId);

    }

    public class StripeCustomerService(
        IHostEnvironment hostEnvironment,
        IUserService userService) : IStripeCustomerService
    {
        private readonly CustomerService _customerService = new();
        private readonly IHostEnvironment _hostEnvironment = hostEnvironment;
        private readonly IUserService _userService = userService;


        public async Task<Customer> GetAsync(string customerId)
        {
            return await _customerService.GetAsync(customerId);
        }

        public async Task<PaymentMethod?> GetLatestPaymentMethodAsync(string customerId)
        {
            return (await _customerService.ListPaymentMethodsAsync(customerId))
                .MaxBy(x => x.Created);
        }

        public async Task<Customer> CreateAsync(int userId)
        {
            var user = await _userService.GetByIdAsync(userId);

            if (user is null)
                throw new NullReferenceException("Could not find user with userId: #" + userId);

            var options = new CustomerCreateOptions
            {
                Name = user.FullName,
                Email = user.Email,
                Metadata = new Dictionary<string, string>
                {
                    { "UserId", user.Id.ToString() },
                    { "Environment", _hostEnvironment.EnvironmentName }
                }
            };

            return await _customerService.CreateAsync(options);
        }

        public async Task<Customer?> GetByEmailAsync(string email)
        {
            return (await _customerService.SearchAsync(new CustomerSearchOptions
            {
                Query = $"email:'{email}'",
            }))
                .FirstOrDefault();
        }
    }
}