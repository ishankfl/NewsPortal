using Dapper;

using NewsPortal.Domain.Interfaces;
using NewsPortal.Domain.Models;
using NewsPortal.Infrastructure.Persistence;
using System.Data;

namespace NewsPortal.Infrastructure.Repositories
{
    public class AuthenticationRepository : IAuthenticationRepository
    {
        private readonly DapperDbContext _context;

        public AuthenticationRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<User?> GetUserByUsernameAsync(string email)
        {
            const string sql = @"SELECT * FROM Users WHERE Email = @Email;";

            using (var conn = _context.CreateConnection())
            {
                return await conn.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });
            }
        }
    }
}
