using api.Data.Stripe;
using api.Repository.Stripe;

namespace api.Service.Stripe
{
    public interface IStripeBillingCustomerService
    {

        Task<StripeCustomer> CreateAsync(int userId, string customerId);
        Task<StripeCustomer?> GetByUserIdAsync(int userId);
        Task<StripeCustomer> GetByCustomerIdAsync(string customerId);
        Task SetInactiveAsync(string customerId);
    }

    public class StripeBillingCustomerService(
        IStripeCustomerRepository stripeCustomerRepository) : IStripeBillingCustomerService
    {
        private readonly IStripeCustomerRepository _stripeCustomerRepository = stripeCustomerRepository;

        // Non-stripe
        public async Task<StripeCustomer> CreateAsync(int userId, string customerId)
        {
            // if already exists
            var exists = await _stripeCustomerRepository.GetByUserIdAsync(userId);

            if (exists is not null)
            {
                if (exists.CustomerId != customerId)
                    exists.CustomerId = customerId;

                if (!exists.Active)
                {
                    await _stripeCustomerRepository.SetActiveAsync(customerId, active: true);
                }

                return exists;
            }

            var model = new StripeCustomer
            {
                CustomerId = customerId,
                UserId = userId
            };

            await _stripeCustomerRepository.CreateAsync(model);
            return model;
        }

        public async Task<StripeCustomer?> GetByUserIdAsync(int userId)
        {
            return await _stripeCustomerRepository.GetByUserIdAsync(userId);
        }

        public async Task<StripeCustomer> GetByCustomerIdAsync(string customerId)
        {
            return await _stripeCustomerRepository.GetByCustomerIdAsync(customerId) ??
                throw new NullReferenceException($"Billing customer is null: customerId: {customerId}");
        }

        public async Task SetInactiveAsync(string customerId)
        {
            await _stripeCustomerRepository.SetActiveAsync(customerId, active: false);
        }
    }
}