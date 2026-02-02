namespace VaultPay.API.Models.DTOs
{
    public class RazorpayOrderRequestDto
    {
        public decimal Amount { get; set; }
    }

    public class RazorpayVerifyRequestDto
    {
        public string RazorpayOrderId { get; set; } = string.Empty;
        public string RazorpayPaymentId { get; set; } = string.Empty;
        public string RazorpaySignature { get; set; } = string.Empty;
    }

    public class RazorpayOrderDto
    {
        public Guid Id { get; set; }
        public string RazorpayOrderId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
