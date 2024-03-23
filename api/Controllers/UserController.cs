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

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string firebaseUid)
        {
            var response = await _userService.GetByFirebaseUIdAsync(firebaseUid);
            return Ok(response);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] CreateUsertDto dto)
        {
            await _userService.CreateAsync(dto);
            return NoContent();
        }
    }
}