using api.Data;
using api.Dto;
using api.Service;
using Microsoft.AspNetCore.Mvc;
using RestSharp.Extensions;

namespace api.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController(
        IUserService userService,
        IEmailVerificationService emailVerificationService) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IEmailVerificationService _emailVerificationService = emailVerificationService;


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
    }
}