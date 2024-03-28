using api.Dto;
using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpPost("Get")]
        public async Task<IActionResult> Get([FromBody] CartUserDto user)
        {
            var response = await _userService.GetByFirebaseUIdAsync(user.FirebaseUid!, user.GuestCheckoutId);
            return Ok(response);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] CreateUsertDto dto)
        {
            var response = await _userService.CreateAsync(dto);
            return Ok(response);
        }
    }
}