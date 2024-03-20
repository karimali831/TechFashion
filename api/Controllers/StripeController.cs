using api.Config;
using api.Data.Stripe;
using api.ExceptionHandler;
using api.Service;
using api.Service.Stripe;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe;

namespace api.Controllers
{
    [Route("[controller]")]
    [ApiController]

    public class StripeController(
        IOptions<StripeConfig> stripeConfig,
        IUserService userService,
        IStripePaymentService stripePaymentService,
        IExceptionHandlerService exceptionHandlerService,
        IStripePaymentMethodService stripePaymentMethodService,
        ICartProductService cartProductService) : Controller
    {
        private readonly IOptions<StripeConfig> _stripeConfig = stripeConfig;
        private readonly IUserService _userService = userService;
        private readonly IStripePaymentService _stripePaymentService = stripePaymentService;
        private readonly IExceptionHandlerService _exceptionHandlerService = exceptionHandlerService;
        private readonly IStripePaymentMethodService _stripePaymentMethodService = stripePaymentMethodService;
        private readonly ICartProductService _cartProductService = cartProductService;


        [HttpPost("Webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> Webhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json,
                    Request.Headers["Stripe-Signature"],
                    _stripeConfig.Value.WebhookSecret
                );

                if (stripeEvent.Data.Object is Customer customer)
                {
                    if (stripeEvent.Type == Events.CustomerDeleted)
                    {
                        await _userService.SetStripeCustomerDeletedAsync(customer.Id, DateTime.UtcNow);
                    }

                    if (stripeEvent.Type == Events.CustomerCreated)
                    {
                        // var user = await _userService.GetByCustomerIdAsync(customer.Id);

                        // if (user is not null && (user.StripeCustomerId is null || user.StripeCustomerId != customer.Id))
                        // {
                        //     await _userService.SetCustomerIdAsync(customer.Id, user.Id);
                        // }
                    }
                }

                if (stripeEvent.Data.Object is PaymentIntent paymentIntent)
                {
                    if (stripeEvent.Type == Events.PaymentIntentSucceeded)
                    {
                        try
                        {
                            var user = await _userService.GetByCustomerIdAsync(paymentIntent.CustomerId);

                            if (user is null)
                            {
                                var exp = new NullReferenceException("User not found");
                                _exceptionHandlerService.ReportException(exp);
                                throw exp;
                            }

                            // if (paymentIntent.CustomerId is not null && user.StripeCustomerId != paymentIntent.CustomerId)
                            // {
                            //     await _userService.SetCustomerIdAsync(paymentIntent.CustomerId, user.Id);
                            // }

                            var paymentMethod = await _stripePaymentMethodService.GetAsync(paymentIntent.PaymentMethodId);

                            await _stripePaymentService.AddAsync(
                                new StripePayment
                                {
                                    UserId = user.Id,
                                    PaymentIntentId = paymentIntent.Id,
                                    Amount = paymentIntent.Amount,
                                    Status = paymentIntent.Status,
                                    CardBrand = paymentMethod.Card.Brand,
                                    CardLast4 = paymentMethod.Card.Last4

                                });

                            // Empty card
                            // await _cartProductService.RemoveProductAsync()
                        }
                        catch (Exception exp)
                        {
                            _exceptionHandlerService.ReportException(exp).Send();
                        }
                    }
                }

                return Ok();
            }
            catch (StripeException exp)
            {
                _exceptionHandlerService.ReportException(exp.InnerException ?? exp)
                    .AddTags(new Dictionary<string, string?> {
                        { "Stripe", "Webhook"  }
                    })
                    .Send();
                return BadRequest();
            }
            catch (Exception exp)
            {
                _exceptionHandlerService.ReportException(exp.InnerException ?? exp)
                    .AddTags(new Dictionary<string, string?> {
                        { "Stripe", "Webhook"  }
                    })
                    .Send();

                return StatusCode(500);
            }
        }
    }
}