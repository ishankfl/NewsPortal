using Dapper;
using NewsPortal.Domain.Models;
using NewsPortal.Application.Users.Interfaces;
using NewsPortal.Infrastructure.Persistence;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NewsPortal.Infrastructure.Repositories
{
    public class ImageRepository : IImageRepository
    {
        private readonly DapperDbContext _context;

        public ImageRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int> AddImageAsync(Image image)
        {
            const string sql = @"
                INSERT INTO images (Name, ImageUrl)
                VALUES (@Name, @ImageUrl)
                RETURNING Id;";

            using var conn = _context.CreateConnection();
            return await conn.ExecuteScalarAsync<int>(sql, new
            {
                image.Name,
                image.ImageUrl
            });
        }

        public async Task<IEnumerable<Image>> GetAllImagesAsync()
        {
            const string sql = @"
                SELECT Id, Name, ImageUrl
                FROM images
                ORDER BY Id DESC;";

            using var conn = _context.CreateConnection();
            return await conn.QueryAsync<Image>(sql);
        }

        public async Task<Image?> GetByIdAsync(int id)
        {
            const string sql = @"
                SELECT Id, Name, ImageUrl
                FROM images
                WHERE Id = @Id;";

            using var conn = _context.CreateConnection();
            return await conn.QueryFirstOrDefaultAsync<Image>(sql, new { Id = id });
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string sql = @"DELETE FROM images WHERE Id = @Id;";

            using var conn = _context.CreateConnection();
            var affectedRows = await conn.ExecuteAsync(sql, new { Id = id });

            return affectedRows > 0;
        }
    }
}
