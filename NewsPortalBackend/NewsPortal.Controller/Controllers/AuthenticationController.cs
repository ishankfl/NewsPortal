using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity.Data;
using NewsPortal.Domain.Models;
using NewsPortal.Application.Users.Interfaces;

namespace NewsPortal.Controller.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authService;

        public AuthenticationController(IAuthenticationService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.LoginAsync(request.Email, request.Password);

            if (token == null)
                return Unauthorized(new { message = "Invalid username or password." });

            return Ok(new { Token = token });
        }

    }
}
