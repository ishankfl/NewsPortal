using Dapper;
using NewsPortal.Domain.Enums;
using NewsPortal.Domain.Interfaces;
using NewsPortal.Domain.Models;
using NewsPortal.Infrastructure.Persistence;

namespace NewsPortal.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DapperDbContext _context;

        public UserRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int> CreateAsync(User user)
        {
            const string sql = @"
                INSERT INTO Users (Username, Email, PasswordHash, Role, CreatedAt, IsSuspended, SuspendedAt)
                VALUES (@Username, @Email, @PasswordHash, @Role, NOW(), @IsSuspended, @SuspendedAt)
                RETURNING Id;";

            using (var conn = _context.CreateConnection())
            {
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
        }

        public async Task<User> GetByIdAsync(int id)
        {
            const string sql = @"
                SELECT Id, Username, Email, PasswordHash, Role, CreatedAt, IsSuspended, SuspendedAt
                FROM Users
                WHERE Id = @Id;";

            using (var conn = _context.CreateConnection())
            {
                var result = await conn.QueryFirstOrDefaultAsync<User>(sql, new { Id = id });

                if (result != null)
                {
                    result.Role = (result.Role);
                }

                return result;
            }
        }

        public async Task<User> GetByUsernameOrEmailAsync(string usernameOrEmail)
        {
            const string sql = @"
                SELECT Id, Username, Email, PasswordHash, Role, CreatedAt, IsSuspended, SuspendedAt
                FROM Users
                WHERE Username = @UsernameOrEmail OR Email = @UsernameOrEmail
                LIMIT 1;";

            using (var conn = _context.CreateConnection())
            {
                var result = await conn.QueryFirstOrDefaultAsync<User>(sql, new { UsernameOrEmail = usernameOrEmail });

                if (result != null)
                {
                    result.Role = (result.Role);
                }

                return result;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string sql = @"DELETE FROM Users WHERE Id = @Id;";

            using (var conn = _context.CreateConnection())
            {
                var affectedRows = await conn.ExecuteAsync(sql, new { Id = id });
                return affectedRows > 0;
            }
        }

        public async Task<bool> SuspendAsync(int id)
        {
            const string sql = @"
                UPDATE Users
                SET IsSuspended = TRUE,
                    SuspendedAt = NOW()
                WHERE Id = @Id;";

            using (var conn = _context.CreateConnection())
            {
                var affectedRows = await conn.ExecuteAsync(sql, new { Id = id });
                return affectedRows > 0;
            }
        }

        public async Task<bool> UnsuspendAsync(int id)
        {
            const string sql = @"
                UPDATE Users
                SET IsSuspended = FALSE,
                    SuspendedAt = NULL
                WHERE Id = @Id;";

            using (var conn = _context.CreateConnection())
            {
                var affectedRows = await conn.ExecuteAsync(sql, new { Id = id });
                return affectedRows > 0;
            }
        }

        public async Task<bool> UpdateAsync(User user)
        {
            const string sql = @"
                UPDATE Users
                SET Username = @Username,
                    Email = @Email,
                    PasswordHash = @PasswordHash,
                    Role = @Role,
                    IsSuspended = @IsSuspended,
                    SuspendedAt = @SuspendedAt
                WHERE Id = @Id;";

            using (var conn = _context.CreateConnection())
            {
                var affectedRows = await conn.ExecuteAsync(sql, new
                {
                    user.Id,
                    user.Username,
                    user.Email,
                    user.PasswordHash,
                    Role = user.Role.ToString(),
                    user.IsSuspended,
                    user.SuspendedAt
                });

                return affectedRows > 0;
            }
        }
        public async Task<IEnumerable<User>> GetAllAsync()
        {
            const string sql = @"
        SELECT Id, Username, Email, PasswordHash, Role, CreatedAt, IsSuspended, SuspendedAt
        FROM Users;";

            using (var conn = _context.CreateConnection())
            {
                var users = await conn.QueryAsync<User>(sql);

                // Optional: Convert string Role to enum if needed
                foreach (var user in users)
                {
                    if (Enum.TryParse<Role>(user.Role.ToString(), out var parsedRole))
                    {
                        user.Role = parsedRole;
                    }
                }

                return users;
            }
        }

    }
}