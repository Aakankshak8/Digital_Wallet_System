using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VaultPay.API.Models.Entities
{
    public class BillPayment
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string BillType { get; set; } = string.Empty; // Mobile, Electricity, DTH

        [Required]
        [MaxLength(100)]
        public string BillNumber { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "DECIMAL(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Completed, Failed

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? PaidAt { get; set; }

        // Navigation
        [ForeignKey("UserId")]
        public User? User { get; set; }

        // Link to Transaction if payment is made through wallet
        public Guid? TransactionId { get; set; }
    }
}
