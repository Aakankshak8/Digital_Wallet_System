namespace VaultPay.API.Models.DTOs
{
    public class TransferRequestDto
    {
        public Guid ReceiverUserId { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
    }

    public class TransactionDto
    {
        public Guid Id { get; set; }
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class TransactionHistoryDto
    {
        public Guid Id { get; set; }
        public Guid OtherUserId { get; set; }
        public string OtherUserName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Type { get; set; } = string.Empty; // Sent or Received
        public string Status { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
