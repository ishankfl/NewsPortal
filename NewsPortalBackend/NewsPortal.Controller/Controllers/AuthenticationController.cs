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
            try
            {
                var token = await _authService.LoginAsync(request.Email, request.Password);

                return Ok(new { Token = token });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // For unhandled exceptions, return 500
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }


    }
}
