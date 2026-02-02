using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VaultPay.API.Models.DTOs;
using VaultPay.API.Services;

namespace VaultPay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return Guid.Parse(userIdClaim?.Value ?? throw new UnauthorizedAccessException());
        }

        /// <summary>
        /// Get user profile
        /// </summary>
        [HttpGet("profile")]
        [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            var profile = await _userService.GetProfileAsync(userId);
            return Ok(profile);
        }

        /// <summary>
        /// Update user profile
        /// </summary>
        [HttpPut("profile")]
        [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequestDto request)
        {
            var userId = GetUserId();
            var profile = await _userService.UpdateProfileAsync(userId, request);
            return Ok(profile);
        }
    }
}
