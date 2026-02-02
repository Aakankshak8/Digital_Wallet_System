using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VaultPay.API.Models.DTOs;
using VaultPay.API.Services;

namespace VaultPay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Requires JWT token
    public class WalletsController : ControllerBase
    {
        private readonly IWalletService _walletService;

        public WalletsController(IWalletService walletService)
        {
            _walletService = walletService;
        }

        // Get UserId from JWT claim
        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("UserId claim not found in token");

            return Guid.Parse(userIdClaim.Value);
        }

        /// <summary>
        /// Temporary test endpoint
        /// </summary>
        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok("API is running!");
        }

        /// <summary>
        /// Get wallet details for logged-in user
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(WalletDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetWallet()
        {
            var userId = GetUserId();
            var wallet = await _walletService.GetWalletAsync(userId);

            if (wallet == null)
                return NotFound("Wallet not found");

            return Ok(wallet);
        }

        /// <summary>
        /// Get wallet balance
        /// </summary>
        [HttpGet("balance")]
        [ProducesResponseType(typeof(WalletBalanceDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetBalance()
        {
            var userId = GetUserId();
            var balance = await _walletService.GetBalanceAsync(userId);

            return Ok(new WalletBalanceDto { Balance = balance });
        }
    }
}
