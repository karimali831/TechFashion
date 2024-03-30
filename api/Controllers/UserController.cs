using api.Dto;
using api.Service;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet("CheckVerificationEmail/{email}")]
        public async Task<IActionResult> CheckVerificationEmail(string email)
        {
            var result = await _emailVerificationService.GetAsync(email);

            return Ok(
                new VerificationEmailDto
                {
                    Sent = result is not null,
                    Verified = result?.VerifiedDate.HasValue ?? false
                });
        }

        [HttpPost("CheckVerificationEmail")]
        public async Task<IActionResult> CheckVerificationEmail([FromBody] VerificationEmailRequestDto request)
        {
            var response = new ApiResponse<VerificationEmailDto>
            {
                Data = new VerificationEmailDto
                {
                    Sent = false,
                    Verified = false
                }
            };

            try
            {
                var existing = await _emailVerificationService.GetAsync(request.Email);

                if (existing is null)
                {
                    if (request.Send)
                    {
                        var result = await _emailVerificationService.SendAsync(request.Email);

                        response.Data.Sent = result.Data is true;
                        response.Data.Verified = false;
                    }
                }
                else
                {
                    response.Data.Sent = true;
                    response.Data.Verified = existing.VerifiedDate.HasValue;
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