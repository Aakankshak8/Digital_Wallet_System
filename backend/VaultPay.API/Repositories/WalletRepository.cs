using VaultPay.API.Data;
using VaultPay.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace VaultPay.API.Repositories
{
    public interface IWalletRepository
    {
        Task<Wallet?> GetByUserIdAsync(Guid userId);
        Task<Wallet?> GetByIdAsync(Guid id);
        Task<Wallet> CreateAsync(Wallet wallet);
        Task<Wallet> UpdateAsync(Wallet wallet);
    }

    public class WalletRepository : IWalletRepository
    {
        private readonly ApplicationDbContext _context;

        public WalletRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Wallet?> GetByUserIdAsync(Guid userId)
        {
            return await _context.Wallets
                .FirstOrDefaultAsync(w => w.UserId == userId);
        }

        public async Task<Wallet?> GetByIdAsync(Guid id)
        {
            return await _context.Wallets
                .FirstOrDefaultAsync(w => w.Id == id);
        }

        public async Task<Wallet> CreateAsync(Wallet wallet)
        {
            _context.Wallets.Add(wallet);
            await _context.SaveChangesAsync();
            return wallet;
        }

        public async Task<Wallet> UpdateAsync(Wallet wallet)
        {
            wallet.UpdatedAt = DateTime.UtcNow;
            _context.Wallets.Update(wallet);
            await _context.SaveChangesAsync();
            return wallet;
        }
    }
}
