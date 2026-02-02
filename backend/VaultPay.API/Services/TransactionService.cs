using VaultPay.API.Data;
using VaultPay.API.Models.DTOs;
using VaultPay.API.Models.Entities;
using VaultPay.API.Repositories;
using Microsoft.EntityFrameworkCore;

namespace VaultPay.API.Services
{
    public interface ITransactionService
    {
        Task<TransactionDto> TransferAsync(Guid senderId, TransferRequestDto request);
        Task<List<TransactionHistoryDto>> GetTransactionHistoryAsync(Guid userId);
    }

    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IWalletRepository _walletRepository;
        private readonly IUserRepository _userRepository;
        private readonly ApplicationDbContext _context;

        public TransactionService(
            ITransactionRepository transactionRepository,
            IWalletRepository walletRepository,
            IUserRepository userRepository,
            ApplicationDbContext context)
        {
            _transactionRepository = transactionRepository;
            _walletRepository = walletRepository;
            _userRepository = userRepository;
            _context = context;
        }

        public async Task<TransactionDto> TransferAsync(Guid senderId, TransferRequestDto request)
        {
            if (request.Amount <= 0)
                throw new ArgumentException("Amount must be greater than zero.");

            if (senderId == request.ReceiverUserId)
                throw new ArgumentException("Cannot transfer to yourself.");

            // Use transaction to ensure atomicity
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Get sender wallet
                    var senderWallet = await _walletRepository.GetByUserIdAsync(senderId);
                    if (senderWallet == null)
                        throw new KeyNotFoundException("Sender wallet not found.");

                    if (senderWallet.Balance < request.Amount)
                        throw new ArgumentException("Insufficient balance.");

                    // Get receiver
                    var receiver = await _userRepository.GetByIdAsync(request.ReceiverUserId);
                    if (receiver == null)
                        throw new KeyNotFoundException("Receiver not found.");

                    // Get receiver wallet
                    var receiverWallet = await _walletRepository.GetByUserIdAsync(request.ReceiverUserId);
                    if (receiverWallet == null)
                        throw new KeyNotFoundException("Receiver wallet not found.");

                    // Deduct from sender
                    senderWallet.Balance -= request.Amount;
                    await _walletRepository.UpdateAsync(senderWallet);

                    // Add to receiver
                    receiverWallet.Balance += request.Amount;
                    await _walletRepository.UpdateAsync(receiverWallet);

                    // Create transaction record
                    var txn = new Transaction
                    {
                        Id = Guid.NewGuid(),
                        SenderId = senderId,
                        ReceiverId = request.ReceiverUserId,
                        Amount = request.Amount,
                        Status = "Completed",
                        Description = request.Description
                    };

                    txn = await _transactionRepository.CreateAsync(txn);

                    await transaction.CommitAsync();

                    return MapToDto(txn);
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public async Task<List<TransactionHistoryDto>> GetTransactionHistoryAsync(Guid userId)
        {
            var transactions = await _transactionRepository.GetByUserIdAsync(userId);

            return transactions.Select(t => new TransactionHistoryDto
            {
                Id = t.Id,
                OtherUserId = t.SenderId == userId ? t.ReceiverId : t.SenderId,
                OtherUserName = t.SenderId == userId ? t.Receiver?.FullName ?? "Unknown" : t.Sender?.FullName ?? "Unknown",
                Amount = t.Amount,
                Type = t.SenderId == userId ? "Sent" : "Received",
                Status = t.Status,
                Description = t.Description,
                CreatedAt = t.CreatedAt
            }).ToList();
        }

        private static TransactionDto MapToDto(Transaction transaction)
        {
            return new TransactionDto
            {
                Id = transaction.Id,
                SenderId = transaction.SenderId,
                ReceiverId = transaction.ReceiverId,
                Amount = transaction.Amount,
                Status = transaction.Status,
                Description = transaction.Description,
                CreatedAt = transaction.CreatedAt
            };
        }
    }
}
