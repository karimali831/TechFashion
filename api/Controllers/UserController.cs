using api.Data;
using api.Dto;
using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController(
        IHub sentryHub,
        IUserService userService,
        IAccountService accountService,
        ICustomerAddressService customerAddressService,
        IEmailVerificationService emailVerificationService) : ControllerBase
    {
        private readonly IHub _sentryHub = sentryHub;
        private readonly IUserService _userService = userService;
        private readonly IAccountService _accountService = accountService;
        private readonly ICustomerAddressService _customerAddressService = customerAddressService;
        private readonly IEmailVerificationService _emailVerificationService = emailVerificationService;


        [HttpGet("AccountDetails/{userId}")]
        public async Task<IActionResult> AccountDetails(int userId)
        {
            var account = await _accountService.GetAsync(userId);
            return Ok(account);
        }


        [HttpPost("Get")]
        public async Task<IActionResult> Get([FromBody] CartUserDto user)
        {
            var response = await _userService.GetByFirebaseUIdAsync(user.FirebaseUid!, user.GuestCheckoutId);
            return response is null ? NoContent() : Ok(response);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] CreateUsertDto dto)
        {
            var response = await _userService.CreateAsync(dto);
            return Ok(response);
        }

        [HttpPost("AddOrUpdateAddress")]
        public async Task<IActionResult> AddOrUpdateAddress([FromBody] CustomerAddress dto)
        {
            var response = await _customerAddressService.AddOrUpdateAddress(dto);
            return Ok(response);
        }

        [HttpGet("DeleteAddress/{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            var response = await _customerAddressService.DeleteAsync(id);
            return Ok(response);
        }

        [HttpPost("CheckVerificationEmail")]
        public async Task<IActionResult> CheckVerificationEmail([FromBody] VerificationEmailRequestDto request)
        {
            var response = new ApiResponse<VerificationEmailDto>
            {
                Data = new VerificationEmailDto
                {
                    Sent = false,
                    Verified = false,
                    FullAccountExists = false
                }
            };

            try
            {
                if (request.FirebaseUid is null && await _userService.GetFullAccByEmailAsync(request.Email) is not null)
                {
                    response.Data.FullAccountExists = true;
                }
                else
                {

                    var user = await _userService.GetAsync(request.FirebaseUid, request.GuestCheckoutId);

                    if (user is not null)
                    {
                        var verifiedExisting = await _emailVerificationService.IsVerifiedAsync(user.Id);

                        if (verifiedExisting.HasValue)
                        {
                            response.Data.Sent = true;
                            response.Data.Verified = true;
                        }
                    }

                    var unverifiedExisting = await _emailVerificationService.GetUnverifiedAsync(request.Email);

                    if (unverifiedExisting is null)
                    {
                        if (request.Send && response.Data.Verified is false)
                        {
                            var result = await _emailVerificationService.SendAsync(request.Email);

                            response.Data.Sent = result.Data is true;
                            response.Data.Verified = false;
                            response.ErrorMsg = result.ErrorMsg;
                        }
                    }
                    else
                    {
                        response.Data.Sent = true;
                        response.Data.Verified = unverifiedExisting.VerifiedDate.HasValue;
                    }
                }

            }
            catch (Exception exp)
            {
                response.ErrorMsg = exp.Message;
            }

            return Ok(response);
        }

        [HttpPost("VerifyEmail")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto dto)
        {
            var result = await _emailVerificationService.VerifyAsync(dto.Email, dto.Code);
            return Ok(result);
        }

        [HttpGet("/person/{id}")]
        public IActionResult Person(string id)
        {
            var childSpan = _sentryHub.GetSpan()?.StartChild("additional-work");
            try
            {
                // Do the work that gets measured.

                childSpan?.Finish(SpanStatus.Ok);
            }
            catch (Exception e)
            {
                childSpan?.Finish(e);
                throw;
            }

            return Ok();
        }
    }
}