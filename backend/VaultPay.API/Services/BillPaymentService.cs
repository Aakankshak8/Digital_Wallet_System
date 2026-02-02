using VaultPay.API.Data;
using VaultPay.API.Models.DTOs;
using VaultPay.API.Models.Entities;
using VaultPay.API.Repositories;

namespace VaultPay.API.Services
{
    public interface IBillPaymentService
    {
        Task<BillPaymentDto> PayBillAsync(Guid userId, BillPaymentRequestDto request);
        Task<List<BillPaymentDto>> GetBillPaymentsAsync(Guid userId);
    }

    public class BillPaymentService : IBillPaymentService
    {
        private readonly IBillPaymentRepository _billRepository;
        private readonly IWalletRepository _walletRepository;
        private readonly ITransactionRepository _transactionRepository;
        private readonly ApplicationDbContext _context;

        public BillPaymentService(
            IBillPaymentRepository billRepository,
            IWalletRepository walletRepository,
            ITransactionRepository transactionRepository,
            ApplicationDbContext context)
        {
            _billRepository = billRepository;
            _walletRepository = walletRepository;
            _transactionRepository = transactionRepository;
            _context = context;
        }

        public async Task<BillPaymentDto> PayBillAsync(Guid userId, BillPaymentRequestDto request)
        {
            if (request.Amount <= 0)
                throw new ArgumentException("Amount must be greater than zero.");

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Get wallet
                    var wallet = await _walletRepository.GetByUserIdAsync(userId);
                    if (wallet == null)
                        throw new KeyNotFoundException("Wallet not found.");

                    if (wallet.Balance < request.Amount)
                        throw new ArgumentException("Insufficient balance.");

                    // Deduct from wallet
                    wallet.Balance -= request.Amount;
                    await _walletRepository.UpdateAsync(wallet);

                    // Create bill payment
                    var billPayment = new BillPayment
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId,
                        BillType = request.BillType,
                        BillNumber = request.BillNumber,
                        Amount = request.Amount,
                        Status = "Completed"
                    };

                    billPayment = await _billRepository.CreateAsync(billPayment);

                    await transaction.CommitAsync();

                    return MapToDto(billPayment);
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public async Task<List<BillPaymentDto>> GetBillPaymentsAsync(Guid userId)
        {
            var bills = await _billRepository.GetByUserIdAsync(userId);
            return bills.Select(MapToDto).ToList();
        }

        private static BillPaymentDto MapToDto(BillPayment bill)
        {
            return new BillPaymentDto
            {
                Id = bill.Id,
                BillType = bill.BillType,
                BillNumber = bill.BillNumber,
                Amount = bill.Amount,
                Status = bill.Status,
                CreatedAt = bill.CreatedAt
            };
        }
    }
}
