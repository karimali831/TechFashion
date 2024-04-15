using api.Config;
using api.Data;
using api.Data.Stripe;
using api.Enum;
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
        ICustomerAddressService customerAddressService,
        IOrderService orderService,
        ICartService cartService) : Controller
    {
        private readonly IOptions<StripeConfig> _stripeConfig = stripeConfig;
        private readonly IUserService _userService = userService;
        private readonly IStripePaymentService _stripePaymentService = stripePaymentService;
        private readonly IExceptionHandlerService _exceptionHandlerService = exceptionHandlerService;
        private readonly IStripePaymentMethodService _stripePaymentMethodService = stripePaymentMethodService;
        private readonly ICustomerAddressService _customerAddressService = customerAddressService;
        private readonly IOrderService _orderService = orderService;
        private readonly ICartService _cartService = cartService;


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

                            var paymentMethod = await _stripePaymentMethodService.GetAsync(paymentIntent.PaymentMethodId);

                            var paymentId = await _stripePaymentService.AddAsync(
                                new StripePayment
                                {
                                    UserId = user.Id,
                                    PaymentIntentId = paymentIntent.Id,
                                    Amount = paymentIntent.Amount,
                                    Status = paymentIntent.Status,
                                    CardBrand = paymentMethod.Card.Brand,
                                    CardLast4 = paymentMethod.Card.Last4

                                });

                            var orderId = int.Parse(paymentIntent.Metadata.First(x => x.Key == "OrderId").Value);
                            var order = await _orderService.GetAsync(orderId);

                            order.PaymentId = paymentId;
                            order.Status = OrderStatus.Open;

                            if (order.ShippingAddressId is null && paymentIntent.Shipping is not null)
                            {
                                var shippingName = paymentIntent.Shipping.Name;
                                var shippingAddress = paymentIntent.Shipping.Address;

                                order.ShippingAddressId = await _customerAddressService.GetOrAddAsync(
                                    new CustomerAddress
                                    {
                                        UserId = user.Id,
                                        Name = shippingName,
                                        Line1 = shippingAddress.Line1,
                                        Line2 = shippingAddress.Line2,
                                        City = shippingAddress.City,
                                        PostalCode = shippingAddress.PostalCode,
                                        Country = shippingAddress.Country
                                    });
                            }

                            // Update order
                            await _orderService.UpdateAsync(order);

                            // Empty basket
                            await _cartService.ArchiveAsync(order.CartId);

                            // Send email
                            await _orderService.SendOrderSuccessEmailAsync(user.Email, order.Ref);
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