using VaultPay.API.Data;
using VaultPay.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace VaultPay.API.Repositories
{
    public interface IBillPaymentRepository
    {
        Task<BillPayment?> GetByIdAsync(Guid id);
        Task<List<BillPayment>> GetByUserIdAsync(Guid userId);
        Task<BillPayment> CreateAsync(BillPayment billPayment);
        Task<BillPayment> UpdateAsync(BillPayment billPayment);
    }

    public class BillPaymentRepository : IBillPaymentRepository
    {
        private readonly ApplicationDbContext _context;

        public BillPaymentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<BillPayment?> GetByIdAsync(Guid id)
        {
            return await _context.BillPayments
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<List<BillPayment>> GetByUserIdAsync(Guid userId)
        {
            return await _context.BillPayments
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<BillPayment> CreateAsync(BillPayment billPayment)
        {
            _context.BillPayments.Add(billPayment);
            await _context.SaveChangesAsync();
            return billPayment;
        }

        public async Task<BillPayment> UpdateAsync(BillPayment billPayment)
        {
            billPayment.PaidAt = DateTime.UtcNow;
            _context.BillPayments.Update(billPayment);
            await _context.SaveChangesAsync();
            return billPayment;
        }
    }
}
