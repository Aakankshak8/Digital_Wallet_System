using VaultPay.API.Data;
using VaultPay.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace VaultPay.API.Repositories
{
    public interface ITransactionRepository
    {
        Task<Transaction?> GetByIdAsync(Guid id);
        Task<List<Transaction>> GetByUserIdAsync(Guid userId);
        Task<Transaction> CreateAsync(Transaction transaction);
        Task<List<Transaction>> GetUserTransactionsAsync(Guid userId, int page = 1, int pageSize = 10);
    }

    public class TransactionRepository : ITransactionRepository
    {
        private readonly ApplicationDbContext _context;

        public TransactionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Transaction?> GetByIdAsync(Guid id)
        {
            return await _context.Transactions
                .Include(t => t.Sender)
                .Include(t => t.Receiver)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<List<Transaction>> GetByUserIdAsync(Guid userId)
        {
            return await _context.Transactions
                .Where(t => t.SenderId == userId || t.ReceiverId == userId)
                .Include(t => t.Sender)
                .Include(t => t.Receiver)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<Transaction> CreateAsync(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<List<Transaction>> GetUserTransactionsAsync(Guid userId, int page = 1, int pageSize = 10)
        {
            return await _context.Transactions
                .Where(t => t.SenderId == userId || t.ReceiverId == userId)
                .Include(t => t.Sender)
                .Include(t => t.Receiver)
                .OrderByDescending(t => t.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
    }
}
