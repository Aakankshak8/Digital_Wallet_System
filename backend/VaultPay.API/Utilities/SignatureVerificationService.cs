using System.Security.Cryptography;
using System.Text;

namespace VaultPay.API.Utilities
{
    public interface ISignatureVerificationService
    {
        bool VerifySignature(string orderId, string paymentId, string signature, string keySecret);
    }

    public class SignatureVerificationService : ISignatureVerificationService
    {
        public bool VerifySignature(string orderId, string paymentId, string signature, string keySecret)
        {
            var payload = $"{orderId}|{paymentId}";
            var hash = ComputeHash(payload, keySecret);
            return hash == signature;
        }

        private static string ComputeHash(string payload, string keySecret)
        {
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(keySecret)))
            {
                var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }
    }
}
