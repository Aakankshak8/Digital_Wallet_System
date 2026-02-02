using VaultPay.API.Models.DTOs;
using VaultPay.API.Models.Entities;
using VaultPay.API.Repositories;

namespace VaultPay.API.Services
{
    public interface IUserService
    {
        Task<UserProfileDto> GetProfileAsync(Guid userId);
        Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileRequestDto request);
    }

    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserProfileDto> GetProfileAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found.");

            return MapToDto(user);
        }

        public async Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileRequestDto request)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found.");

            user.FullName = request.FullName;
            user.PhoneNumber = request.PhoneNumber;

            user = await _userRepository.UpdateAsync(user);
            return MapToDto(user);
        }

        private static UserProfileDto MapToDto(User user)
        {
            return new UserProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
