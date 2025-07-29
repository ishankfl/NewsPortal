using Dapper;
using NewsPortal.Domain.Enums;
using NewsPortal.Domain.Interfaces;
using NewsPortal.Domain.Models;
using NewsPortal.Infrastructure.Persistence;

namespace NewsPortal.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        public class PaginatedResult<T>
        {
            public int CurrentPage { get; set; }
            public int PageSize { get; set; }
            public int TotalItems { get; set; }
            public int TotalPages => (int)Math.Ceiling((double)TotalItems / PageSize);
            public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
        }
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

            var result = await conn.QueryFirstOrDefaultAsync<User>(sql, new { Id = id });

            if (result != null && Enum.TryParse<Role>(result.Role.ToString(), out var parsedRole))
            {
                result.Role = parsedRole;
            }

            return result;
        }

        public async Task<User?> GetByUsernameOrEmailAsync(string usernameOrEmail)
        {
            const string sql = @"
                SELECT Id, Username, Email, PasswordHash, Role, CreatedAt, IsSuspended, SuspendedAt
                FROM Users
                WHERE Username = @UsernameOrEmail OR Email = @UsernameOrEmail
                LIMIT 1;";

            using var conn = _context.CreateConnection();

            var result = await conn.QueryFirstOrDefaultAsync<User>(sql, new { UsernameOrEmail = usernameOrEmail });

            if (result != null && Enum.TryParse<Role>(result.Role.ToString(), out var parsedRole))
            {
                result.Role = parsedRole;
            }

            return result;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string sql = @"DELETE FROM Users WHERE Id = @Id;";

            using var conn = _context.CreateConnection();
            var affectedRows = await conn.ExecuteAsync(sql, new { Id = id });

            return affectedRows > 0;
        }

        public async Task<bool> SuspendAsync(int id)
        {
            const string sql = @"
                UPDATE Users
                SET IsSuspended = TRUE,
                    SuspendedAt = NOW()
                WHERE Id = @Id;";

            using var conn = _context.CreateConnection();
            var affectedRows = await conn.ExecuteAsync(sql, new { Id = id });

            return affectedRows > 0;
        }

        public async Task<bool> UnsuspendAsync(int id)
        {
            const string sql = @"
                UPDATE Users
                SET IsSuspended = FALSE,
                    SuspendedAt = NULL
                WHERE Id = @Id;";

            using var conn = _context.CreateConnection();
            var affectedRows = await conn.ExecuteAsync(sql, new { Id = id });

            return affectedRows > 0;
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

            using var conn = _context.CreateConnection();

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

        public async Task<GetUsersResult> GetAllAsync(int page = 1, int pageSize = 10, string? searchTerm = null)
        {
            var offset = (page - 1) * pageSize;

            var sqlBuilder = new SqlBuilder();

            var baseSql = @"
        SELECT Id, Username, Email, PasswordHash, Role, CreatedAt, IsSuspended, SuspendedAt
        FROM Users
        /**where**/
        ORDER BY Id
        OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;";

            var countSql = @"
        SELECT COUNT(*) FROM Users
        /**where**/;";

            var parameters = new DynamicParameters();
            parameters.Add("Offset", offset);
            parameters.Add("PageSize", pageSize);

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                sqlBuilder.Where("Username ILIKE @Search OR Email ILIKE @Search");
                parameters.Add("Search", $"%{searchTerm}%");
            }

            var paginatedTemplate = sqlBuilder.AddTemplate(baseSql, parameters);
            var countTemplate = sqlBuilder.AddTemplate(countSql, parameters);

            using var conn = _context.CreateConnection();

            var users = (await conn.QueryAsync<User>(paginatedTemplate.RawSql, paginatedTemplate.Parameters)).ToList();
            var totalItems = await conn.ExecuteScalarAsync<int>(countTemplate.RawSql, countTemplate.Parameters);

            // Parse Role from string to enum if necessary
            foreach (var user in users)
            {
                if (Enum.TryParse<Role>(user.Role.ToString(), out var parsedRole))
                {
                    user.Role = parsedRole;
                }
            }

            return new GetUsersResult
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                Items = users
            };
        }


    }
}
