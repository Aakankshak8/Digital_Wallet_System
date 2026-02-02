using VaultPay.API.Models.DTOs;
using VaultPay.API.Models.Entities;
using VaultPay.API.Repositories;

namespace VaultPay.API.Services
{
    public interface IWalletService
    {
        Task<WalletDto> GetWalletAsync(Guid userId);
        Task<decimal> GetBalanceAsync(Guid userId);
    }

    public class WalletService : IWalletService
    {
        private readonly IWalletRepository _walletRepository;

        public WalletService(IWalletRepository walletRepository)
        {
            _walletRepository = walletRepository;
        }

        public async Task<WalletDto> GetWalletAsync(Guid userId)
        {
            var wallet = await _walletRepository.GetByUserIdAsync(userId);
            if (wallet == null)
                throw new KeyNotFoundException("Wallet not found.");

            return MapToDto(wallet);
        }

        public async Task<decimal> GetBalanceAsync(Guid userId)
        {
            var wallet = await _walletRepository.GetByUserIdAsync(userId);
            if (wallet == null)
                throw new KeyNotFoundException("Wallet not found.");

            return wallet.Balance;
        }

        private static WalletDto MapToDto(Wallet wallet)
        {
            return new WalletDto
            {
                Id = wallet.Id,
                UserId = wallet.UserId,
                Balance = wallet.Balance,
                CreatedAt = wallet.CreatedAt
            };
        }
    }
}
