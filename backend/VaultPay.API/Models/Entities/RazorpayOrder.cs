using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VaultPay.API.Models.Entities
{
    public class RazorpayOrder
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string RazorpayOrderId { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "DECIMAL(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(10)]
        public string Currency { get; set; } = "INR";

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Created"; // Created, Paid, Failed

        [MaxLength(200)]
        public string? RazorpayPaymentId { get; set; }

        [MaxLength(500)]
        public string? RazorpaySignature { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? VerifiedAt { get; set; }

        // Navigation
        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}
