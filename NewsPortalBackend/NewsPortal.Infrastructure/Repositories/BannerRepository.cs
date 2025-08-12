using Dapper;
using NewsPortal.Domain.Dtos;
using NewsPortal.Domain.Interfaces;
using NewsPortal.Domain.Models;
using NewsPortal.Infrastructure.Persistence;
using System.Reflection;

namespace NewsPortal.Infrastructure.Repositories
{
    public class BannerRepository : IBannerRepository
    {
        private readonly DapperDbContext _context;

        public BannerRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int> CreateAsync(Banner banner)
        {
            const string sql = @"
                INSERT INTO Banners (
                    Title, Description, ImageUrl, TargetUrl, BannerTypeId, 
                    StartDate, EndDate, IsActive, Priority, CreatedBy
                )
                VALUES (
                    @Title, @Description, @ImageUrl, @TargetUrl, @BannerTypeId,
                    @StartDate, @EndDate, @IsActive, @Priority, @CreatedBy
                )
                RETURNING Id;";

            using var conn = _context.CreateConnection();
            return await conn.ExecuteScalarAsync<int>(sql, banner);
        }

        public async Task<bool> UpdateAsync(Banner banner)
        {
            const string sql = @"
                UPDATE Banners
                SET 
                    Title = @Title,
                    Description = @Description,
                    ImageUrl = @ImageUrl,
                    TargetUrl = @TargetUrl,
                    BannerTypeId = @BannerTypeId,
                    StartDate = @StartDate,
                    EndDate = @EndDate,
                    IsActive = @IsActive,
                    Priority = @Priority,
                    UpdatedAt = CURRENT_TIMESTAMP
                WHERE Id = @Id;";

            using var conn = _context.CreateConnection();
            var affectedRows = await conn.ExecuteAsync(sql, banner);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string sql = "DELETE FROM Banners WHERE Id = @Id;";
            using var conn = _context.CreateConnection();
            var affectedRows = await conn.ExecuteAsync(sql, new { Id = id });
            return affectedRows > 0;
        }

        public async Task<Banner?> GetByIdAsync(int id)
        {
            const string sql = @"
                SELECT 
                    b.*,
                    bt.Name AS BannerTypeName
                FROM Banners b
                LEFT JOIN BannerTypes bt ON b.BannerTypeId = bt.Id
                WHERE b.Id = @Id;";

            using var conn = _context.CreateConnection();
            return await conn.QueryFirstOrDefaultAsync<Banner>(sql, new { Id = id });
        }

        public async Task<PaginatedResult<Banner>> GetAllAsync(int page = 1, int pageSize = 10, string? searchTerm = null)
        {
            var offset = (page - 1) * pageSize;
            var parameters = new DynamicParameters();
            parameters.Add("Offset", offset);
            parameters.Add("PageSize", pageSize);

            var sqlBuilder = new SqlBuilder();
            var template = sqlBuilder.AddTemplate(@"
                SELECT 
                    b.*,
                    bt.Name AS BannerTypeName,
                    COUNT(*) OVER() AS TotalCount
                FROM Banners b
                LEFT JOIN BannerTypes bt ON b.BannerTypeId = bt.Id
                /**where**/
                ORDER BY b.Priority DESC, b.CreatedAt DESC
                OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;");

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                sqlBuilder.Where("b.Title ILIKE @SearchTerm OR b.Description ILIKE @SearchTerm");
                parameters.Add("SearchTerm", $"%{searchTerm}%");
            }

            using var conn = _context.CreateConnection();
            var results = await conn.QueryAsync<BannerWithCount>(template.RawSql, parameters);

            var firstResult = results.FirstOrDefault();
            var totalItems = firstResult?.TotalCount ?? 0;

            return new PaginatedResult<Banner>
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                Items = results.Select(r => (Banner)r)
            };
        }

        public async Task<bool> AssignToPositionAsync(int bannerId, int positionId, int priority)
        {
            const string sql = @"
                INSERT INTO BannerPositionMappings (BannerId, PositionId, Priority)
                VALUES (@BannerId, @PositionId, @Priority)
                ON CONFLICT (BannerId, PositionId) 
                DO UPDATE SET Priority = @Priority;";

            using var conn = _context.CreateConnection();
            var affectedRows = await conn.ExecuteAsync(sql, new { BannerId = bannerId, PositionId = positionId, Priority = priority });
            return affectedRows > 0;
        }

        public async Task<bool> RemoveFromPositionAsync(int bannerId, int positionId)
        {
            const string sql = "DELETE FROM BannerPositionMappings WHERE BannerId = @BannerId AND PositionId = @PositionId;";
            using var conn = _context.CreateConnection();
            var affectedRows = await conn.ExecuteAsync(sql, new { BannerId = bannerId, PositionId = positionId });
            return affectedRows > 0;
        }

        private class BannerWithCount : Banner
        {
            public int TotalCount { get; set; }
        }
    }
}