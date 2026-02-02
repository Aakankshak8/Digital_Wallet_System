using Razorpay.Api;
using VaultPay.API.Models.DTOs;
using VaultPay.API.Models.Entities;
using VaultPay.API.Repositories;
using VaultPay.API.Utilities;

namespace VaultPay.API.Services
{
    public interface IRazorpayService
    {
        Task<RazorpayOrderDto> CreateOrderAsync(Guid userId, RazorpayOrderRequestDto request);
        Task<RazorpayOrderDto> VerifyAndCreditWalletAsync(Guid userId, RazorpayVerifyRequestDto request);
    }

    public class RazorpayService : IRazorpayService
    {
        private readonly IRazorpayOrderRepository _razorpayRepository;
        private readonly IWalletRepository _walletRepository;
        private readonly ISignatureVerificationService _signatureService;
        private readonly IConfiguration _configuration;

        public RazorpayService(
            IRazorpayOrderRepository razorpayRepository,
            IWalletRepository walletRepository,
            ISignatureVerificationService signatureService,
            IConfiguration configuration)
        {
            _razorpayRepository = razorpayRepository;
            _walletRepository = walletRepository;
            _signatureService = signatureService;
            _configuration = configuration;
        }

        public async Task<RazorpayOrderDto> CreateOrderAsync(
    Guid userId,
    RazorpayOrderRequestDto request)
        {
            if (request.Amount <= 0)
                throw new ArgumentException("Amount must be greater than zero.");

            var keyId = _configuration["Razorpay:KeyId"];
            var keySecret = _configuration["Razorpay:KeySecret"];

            var client = new RazorpayClient(keyId, keySecret);

            var options = new Dictionary<string, object>
    {
        { "amount", request.Amount * 100 }, // paise
        { "currency", "INR" },
        { "receipt", $"rcpt_{Guid.NewGuid():N}".Substring(0, 35)}
    };

            var razorpayOrder = client.Order.Create(options);

            var order = new RazorpayOrder
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                RazorpayOrderId = razorpayOrder["id"].ToString(),
                Amount = request.Amount, // STORE IN RUPEES
                Currency = "INR",
                Status = "Created"
            };

            await _razorpayRepository.CreateAsync(order);

            return MapToDto(order);
        }

        public async Task<RazorpayOrderDto> VerifyAndCreditWalletAsync(Guid userId, RazorpayVerifyRequestDto request)
        {
            var order = await _razorpayRepository.GetByRazorpayOrderIdAsync(request.RazorpayOrderId);
            if (order == null)
                throw new KeyNotFoundException("Order not found.");

            if (order.UserId != userId)
                throw new UnauthorizedAccessException("Unauthorized access to this order.");

            // Verify signature
            var keySecret = _configuration["Razorpay:KeySecret"];
            var isValid = _signatureService.VerifySignature(
                request.RazorpayOrderId,
                request.RazorpayPaymentId,
                request.RazorpaySignature,
                keySecret);

            if (!isValid)
                throw new ArgumentException("Invalid payment signature.");

            // Update order
            order.Status = "Paid";
            order.RazorpayPaymentId = request.RazorpayPaymentId;
            order.RazorpaySignature = request.RazorpaySignature;
            order = await _razorpayRepository.UpdateAsync(order);

            // Credit wallet
            var wallet = await _walletRepository.GetByUserIdAsync(userId);
            if (wallet == null)
                throw new KeyNotFoundException("Wallet not found.");

            wallet.Balance += order.Amount;
            await _walletRepository.UpdateAsync(wallet);

            return MapToDto(order);
        }

        private static RazorpayOrderDto MapToDto(RazorpayOrder order)
        {
            return new RazorpayOrderDto
            {
                Id = order.Id,
                RazorpayOrderId = order.RazorpayOrderId,
                Amount = order.Amount,
                Status = order.Status,
                CreatedAt = order.CreatedAt
            };
        }
    }
}
