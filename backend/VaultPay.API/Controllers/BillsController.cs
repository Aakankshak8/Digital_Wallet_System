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
    public class BillsController : ControllerBase
    {
        private readonly IBillPaymentService _billService;

        public BillsController(IBillPaymentService billService)
        {
            _billService = billService;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return Guid.Parse(userIdClaim?.Value ?? throw new UnauthorizedAccessException());
        }

        /// <summary>
        /// Pay a bill
        /// </summary>
        [HttpPost("pay")]
        [ProducesResponseType(typeof(BillPaymentDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> PayBill([FromBody] BillPaymentRequestDto request)
        {
            var userId = GetUserId();
            var billPayment = await _billService.PayBillAsync(userId, request);
            return Ok(billPayment);
        }

        /// <summary>
        /// Get bill payment history
        /// </summary>
        [HttpGet("history")]
        [ProducesResponseType(typeof(List<BillPaymentDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetHistory()
        {
            var userId = GetUserId();
            var history = await _billService.GetBillPaymentsAsync(userId);
            return Ok(history);
        }
    }
}
