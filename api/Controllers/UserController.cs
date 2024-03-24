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

        [HttpGet("Get/{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var response = await _userService.GetByFirebaseUIdAsync(id);
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