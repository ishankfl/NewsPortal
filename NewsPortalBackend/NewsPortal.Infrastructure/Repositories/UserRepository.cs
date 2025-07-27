using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsPortal.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DapperDbContext _context;

        public UserRepository(DapperDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreateAsync(User user)
        {
            const string sql = @"
            INSERT INTO Users (Username, Email, PasswordHash, Role, CreatedAt, IsSuspended, SuspendedAt)
            VALUES (@Username, @Email, @PasswordHash, @Role, NOW(), @IsSuspended, @SuspendedAt)
            RETURNING Id;";

            using var conn = _context.CreateConnection();
            return await conn.ExecuteScalarAsync<int>(sql, new
            {
                user.Username,
                user.Email,
                user.PasswordHash,
                Role = user.Role.ToString(),
                user.IsSuspended,
                user.SuspendedAt
            });
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            const string sql = @"
            SELECT Id, Username, Email, PasswordHash, Role, CreatedAt, IsSuspended, SuspendedAt
            FROM Users
            WHERE Id = @Id;";

            using var conn = _context.CreateConnection();
            var user = await conn.QueryFirstOrDefaultAsync<User>(sql, new { Id = id });
            if (user != null)
                user.Role = Enum.Parse<Domain.Enums.Role>(user.Role.ToString(), true);
            return user;
        }

        public async Task<User?> GetByUsernameOrEmailAsync(string usernameOrEmail)
        {
            const string sql = @"
            SELECT Id, Username, Email, PasswordHash, Role, CreatedAt, IsSuspended, SuspendedAt
            FROM Users
            WHERE Username = @U OR Email = @U
            LIMIT 1;";

            using var conn = _context.CreateConnection();
            var user = await conn.QueryFirstOrDefaultAsync<User>(sql, new { U = usernameOrEmail });
            if (user != null)
                user.Role = Enum.Parse<Domain.Enums.Role>(user.Role.ToString(), true);
            return user;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string sql = @"DELETE FROM Users WHERE Id = @Id;";
            using var conn = _context.CreateConnection();
            var rows = await conn.ExecuteAsync(sql, new { Id = id });
            return rows > 0;
        }

        public async Task<bool> SuspendAsync(int id)
        {
            const string sql = @"
            UPDATE Users
            SET IsSuspended = TRUE,
                SuspendedAt = NOW()
            WHERE Id = @Id;";

            using var conn = _context.CreateConnection();
            var rows = await conn.ExecuteAsync(sql, new { Id = id });
            return rows > 0;
        }

        public async Task<bool> UnsuspendAsync(int id)
        {
            const string sql = @"
            UPDATE Users
            SET IsSuspended = FALSE,
                SuspendedAt = NULL
            WHERE Id = @Id;";

            using var conn = _context.CreateConnection();
            var rows = await conn.ExecuteAsync(sql, new { Id = id });
            return rows > 0;
        }
    }
}
