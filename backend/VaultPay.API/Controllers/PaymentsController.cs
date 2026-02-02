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
    public class PaymentsController : ControllerBase
    {
        private readonly IRazorpayService _razorpayService;

        public PaymentsController(IRazorpayService razorpayService)
        {
            _razorpayService = razorpayService;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return Guid.Parse(userIdClaim?.Value ?? throw new UnauthorizedAccessException());
        }

        /// <summary>
        /// Create Razorpay order
        /// </summary>
        [HttpPost("razorpay/create-order")]
        [ProducesResponseType(typeof(RazorpayOrderDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CreateRazorpayOrder([FromBody] RazorpayOrderRequestDto request)
        {
            var userId = GetUserId();
            var order = await _razorpayService.CreateOrderAsync(userId, request);
            return Ok(order);
        }

        /// <summary>
        /// Verify Razorpay payment and credit wallet
        /// </summary>
        [HttpPost("razorpay/verify")]
        [ProducesResponseType(typeof(RazorpayOrderDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> VerifyRazorpayPayment([FromBody] RazorpayVerifyRequestDto request)
        {
            var userId = GetUserId();
            var order = await _razorpayService.VerifyAndCreditWalletAsync(userId, request);
            return Ok(order);
        }
    }
}
