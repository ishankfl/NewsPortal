using Dapper;
using NewsPortal.Domain.Models;
using NewsPortal.Infrastructure.Persistence;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using NewsPortal.Domain.Interfaces;

namespace NewsPortal.Infrastructure.Repositories
{
   

    public class CategoriesRepository : ICategoryRepository
    {
        private readonly DapperDbContext _context;

        public CategoriesRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int> AddAsync(Categories Categories)
        {
            const string sql = @"
                INSERT INTO categories (Name_En, Name_Np, Slug)
                VALUES (@Name_En, @Name_Np, @Slug)
                RETURNING Id;
            ";

            using var conn = _context.CreateConnection();
            return await conn.ExecuteScalarAsync<int>(sql, Categories);
        }

        public async Task<IEnumerable<Categories>> GetAllAsync()
        {
            const string sql = @"SELECT Id, Name_En, Name_Np, Slug FROM categories ORDER BY Id DESC;";

            using var conn = _context.CreateConnection();
            return await conn.QueryAsync<Categories>(sql);
        }

        public async Task<Categories?> GetByIdAsync(int id)
        {
            const string sql = @"SELECT Id, Name_En, Name_Np, Slug FROM categories WHERE Id = @Id;";

            using var conn = _context.CreateConnection();
            return await conn.QueryFirstOrDefaultAsync<Categories>(sql, new { Id = id });
        }

        public async Task<bool> UpdateAsync(Categories Categories)
        {
            const string sql = @"
                UPDATE categories 
                SET Name_En = @Name_En, Name_Np = @Name_Np, Slug = @Slug
                WHERE Id = @Id;
            ";

            using var conn = _context.CreateConnection();
            var rows = await conn.ExecuteAsync(sql, Categories);
            return rows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string sql = @"DELETE FROM categories WHERE Id = @Id;";

            using var conn = _context.CreateConnection();
            var rows = await conn.ExecuteAsync(sql, new { Id = id });
            return rows > 0;
        }
    }
}
