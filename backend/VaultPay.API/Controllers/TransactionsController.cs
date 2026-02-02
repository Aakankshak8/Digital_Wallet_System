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
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return Guid.Parse(userIdClaim?.Value ?? throw new UnauthorizedAccessException());
        }

        /// <summary>
        /// Transfer money to another user
        /// </summary>
        [HttpPost("transfer")]
        [ProducesResponseType(typeof(TransactionDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Transfer([FromBody] TransferRequestDto request)
        {
            var userId = GetUserId();
            var transaction = await _transactionService.TransferAsync(userId, request);
            return Ok(transaction);
        }

        /// <summary>
        /// Get transaction history
        /// </summary>
        [HttpGet("history")]
        [ProducesResponseType(typeof(List<TransactionHistoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetHistory()
        {
            var userId = GetUserId();
            var history = await _transactionService.GetTransactionHistoryAsync(userId);
            return Ok(history);
        }
    }
}
