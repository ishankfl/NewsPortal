using NewsPortal.Domain.Models;

namespace NewsPortal.Application.Users.Interfaces
{
    public interface IAuthenticationService
    {
        Task<string?> LoginAsync(string username, string password);
    }
}
