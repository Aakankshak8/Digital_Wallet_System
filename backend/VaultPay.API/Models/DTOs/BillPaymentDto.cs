namespace VaultPay.API.Models.DTOs
{
    public class BillPaymentRequestDto
    {
        public string BillType { get; set; } = string.Empty; // Mobile, Electricity, DTH
        public string BillNumber { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class BillPaymentDto
    {
        public Guid Id { get; set; }
        public string BillType { get; set; } = string.Empty;
        public string BillNumber { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
