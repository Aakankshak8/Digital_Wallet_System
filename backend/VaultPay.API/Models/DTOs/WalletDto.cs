namespace VaultPay.API.Models.DTOs
{
    public class WalletDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public decimal Balance { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class WalletBalanceDto
    {
        public decimal Balance { get; set; }
    }
}
