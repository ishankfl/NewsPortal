using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewsPortal.Application.Users.DTOs;
using NewsPortal.Application.Users.Interfaces;
using NewsPortal.Domain.Enums;

namespace NewsPortal.Controller.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // POST: api/user
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserRequest request, [FromQuery] bool autoGeneratePassword = true)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newUserId = await _userService.CreateAsync(request, autoGeneratePassword);
            return CreatedAtAction(nameof(GetById), new { id = newUserId }, new { Id = newUserId });
        }

        // GET: api/user/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<UserResponse>> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // GET: api/user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetAll()
        {
            // Only works if you have GetAllAsync implemented
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        // DELETE: api/user/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _userService.DeleteAsync(id);
            return result ? NoContent() : NotFound();
        }

        // PUT: api/user/{id}/suspend
        [HttpPut("{id:int}/suspend")]
        public async Task<IActionResult> Suspend(int id)
        {
            var result = await _userService.SuspendAsync(id);
            return result ? NoContent() : NotFound();
        }

        // PUT: api/user/{id}/unsuspend
        [HttpPut("{id:int}/unsuspend")]
        public async Task<IActionResult> Unsuspend(int id)
        {
            var result = await _userService.UnsuspendAsync(id);
            return result ? NoContent() : NotFound();
        }

        // PUT: api/user/{id}/role
        [HttpPut("{id:int}/role")]
        public async Task<IActionResult> UpdateRole(int id, [FromQuery] Role newRole)
        {
            var result = await _userService.UpdateRoleAsync(id, newRole);
            return result ? NoContent() : NotFound();
        }
    }
}
