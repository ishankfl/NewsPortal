using NewsPortal.Application.Users.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
        Task<IEnumerable<UserResponse>> GetAllAsync();
        Task<bool> UpdateRoleAsync(int id, Role newRole);
    }
}
