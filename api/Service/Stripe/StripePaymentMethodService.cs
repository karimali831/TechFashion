using api.ExceptionHandler;
using Stripe;

namespace api.Service.Stripe
{
    public interface IStripePaymentMethodService
    {
        Task<PaymentMethod> GetAsync(string paymentMethodId);
        Task<PaymentMethod> GetDefaultAsync(string customerId, string defaultPaymentMethodId);
    }

    public class StripePaymentMethodService(
        IExceptionHandlerService exceptionHandlerService,
        IStripeCustomerService stripeCustomerService) : IStripePaymentMethodService
    {
        private readonly PaymentMethodService _paymentMethodService = new();
        private readonly IStripeCustomerService _stripeCustomerService = stripeCustomerService;
        private readonly IExceptionHandlerService _exceptionHandlerService = exceptionHandlerService;

        public async Task<PaymentMethod> GetAsync(string paymentMethodId)
        {
            return await _paymentMethodService.GetAsync(paymentMethodId);
        }

        public async Task<PaymentMethod> GetDefaultAsync(string customerId, string defaultPaymentMethodId)
        {
            if (customerId == null)
            {
                var exp = new NullReferenceException("Customer Id supplied is null");
                _exceptionHandlerService.ReportException(exp).Send();
                throw exp;
            }

            if (defaultPaymentMethodId is null)
            {
                return await _stripeCustomerService.GetLatestPaymentMethodAsync(customerId) ??
                throw new ApplicationException("An error occurred");
            }

            return await _paymentMethodService.GetAsync(defaultPaymentMethodId);
        }
    }
}