using VaultPay.API.Data;
using VaultPay.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace VaultPay.API.Repositories
{
    public interface IRazorpayOrderRepository
    {
        Task<RazorpayOrder?> GetByIdAsync(Guid id);
        Task<RazorpayOrder?> GetByRazorpayOrderIdAsync(string razorpayOrderId);
        Task<RazorpayOrder> CreateAsync(RazorpayOrder order);
        Task<RazorpayOrder> UpdateAsync(RazorpayOrder order);
    }

    public class RazorpayOrderRepository : IRazorpayOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public RazorpayOrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RazorpayOrder?> GetByIdAsync(Guid id)
        {
            return await _context.RazorpayOrders
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<RazorpayOrder?> GetByRazorpayOrderIdAsync(string razorpayOrderId)
        {
            return await _context.RazorpayOrders
                .FirstOrDefaultAsync(r => r.RazorpayOrderId == razorpayOrderId);
        }

        public async Task<RazorpayOrder> CreateAsync(RazorpayOrder order)
        {
            _context.RazorpayOrders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<RazorpayOrder> UpdateAsync(RazorpayOrder order)
        {
            order.VerifiedAt = DateTime.UtcNow;
            _context.RazorpayOrders.Update(order);
            await _context.SaveChangesAsync();
            return order;
        }
    }
}
