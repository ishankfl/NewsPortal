using Microsoft.AspNetCore.Mvc;
using NewsPortal.Application.Common.Utils;
using NewsPortal.Application.Users.Interfaces;
using NewsPortal.Domain.Interfaces;
using NewsPortal.Domain.Models;

namespace NewsPortal.Application.Users.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IAuthenticationRepository _repository;

        public AuthenticationService(IAuthenticationRepository repository)
        {
            _repository = repository;
        }

       

            public async Task<string?> LoginAsync(string email, string password)
            {
                var user = await _repository.GetUserByUsernameAsync(email);

                if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                {
                    throw new UnauthorizedAccessException("Invalid username or password.");
                }

                return JwtHelper.GenerateJwtToken(user);
            }

        

    }
}
