using BCrypt.Net;
using VaultPay.API.Models.DTOs;
using VaultPay.API.Models.Entities;
using VaultPay.API.Repositories;
using VaultPay.API.Utilities;

namespace VaultPay.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
        Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    }

    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IWalletRepository _walletRepository;
        private readonly ITokenService _tokenService;

        public AuthService(IUserRepository userRepository, IWalletRepository walletRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _walletRepository = walletRepository;
            _tokenService = tokenService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                throw new ArgumentException("Email and password are required.");

            // Check if user already exists
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
                throw new ArgumentException("Email already registered.");

            var phoneUser = await _userRepository.GetByPhoneAsync(request.PhoneNumber);
            if (phoneUser != null)
                throw new ArgumentException("Phone number already registered.");

            // Hash password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // Create user
            var user = new User
            {
                Id = Guid.NewGuid(),
                FullName = request.FullName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                PasswordHash = passwordHash,
                Role = "User"
            };

            user = await _userRepository.CreateAsync(user);

            // Create wallet
            var wallet = new Wallet
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Balance = 0
            };

            await _walletRepository.CreateAsync(wallet);

            // Generate token
            var token = _tokenService.GenerateToken(user);

            return new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Token = token,
                Role = user.Role
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                throw new ArgumentException("Email and password are required.");

            // Get user
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid email or password.");

            // Verify password
            var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!isPasswordValid)
                throw new UnauthorizedAccessException("Invalid email or password.");

            // Generate token
            var token = _tokenService.GenerateToken(user);

            return new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Token = token,
                Role = user.Role
            };
        }
    }
}
