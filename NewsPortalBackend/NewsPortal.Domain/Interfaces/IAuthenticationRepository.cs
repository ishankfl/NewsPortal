using NewsPortal.Domain.Models;

namespace NewsPortal.Domain.Interfaces
{
    public interface IAuthenticationRepository
    {
        Task<User?> GetUserByUsernameAsync(string email);
    }
}
