using NewsPortal.Application.Users.DTOs;
using NewsPortal.Domain.Enums;
using System.Threading.Tasks;

namespace NewsPortal.Application.Users.Interfaces
{
    public interface IUserService
    {
        Task<int> CreateAsync(CreateUserRequest request, bool autoGeneratePassword = true);
        Task<bool> DeleteAsync(int id);
        Task<bool> SuspendAsync(int id);
        Task<bool> UnsuspendAsync(int id);
        Task<UserResponse?> GetByIdAsync(int id);

        // Optional convenience op that your repo can already support through UpdateAsync(User)
        Task<bool> UpdateRoleAsync(int id, Role newRole);
    }
}
