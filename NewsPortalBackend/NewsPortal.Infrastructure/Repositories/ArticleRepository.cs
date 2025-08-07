using Dapper;
using NewsPortal.Domain.Interfaces;
using NewsPortal.Domain.Models;
using NewsPortal.Infrastructure.Persistence;
using System.Data;

namespace NewsPortal.Infrastructure.Repositories
{
    public class ArticleRepository : IArticleRepository
    {
        private readonly DapperDbContext _context;

        public ArticleRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int> CreateAsync(Article article)
        {
            const string sql = @"
                INSERT INTO articles (
                    language_code, title, slug, content, summary, status, 
                    publication_datetime, allow_comments, cover_image_id, 
                    author_id, reporter_id, seo_title, seo_description, 
                    seo_keywords, created_at, updated_at
                )
                VALUES (
                    @LanguageCode, @Title, @Slug, @Content, @Summary, @Status,
                    @PublicationDatetime, @AllowComments, @CoverImageId,
                    @AuthorId, @ReporterId, @SeoTitle, @SeoDescription,
                    @SeoKeywords, NOW(), NOW()
                )
                RETURNING id;";

            using var conn = _context.CreateConnection();
            return await conn.ExecuteScalarAsync<int>(sql, new
            {
                article.LanguageCode,
                article.Title,
                article.Slug,
                article.Content,
                article.Summary,
                article.Status,
                article.PublicationDatetime,
                article.AllowComments,
                article.CoverImageId,
                article.AuthorId,
                article.ReporterId,
                article.SeoTitle,
                article.SeoDescription,
                article.SeoKeywords
            });
        }


        public async Task<bool> SlugExistsAsync(string slug, int? excludeId = null)
        {
            var sql = "SELECT COUNT(*) FROM articles WHERE slug = @Slug";

            var parameters = new DynamicParameters();
            parameters.Add("Slug", slug);

            if (excludeId.HasValue)
            {
                sql += " AND id != @ExcludeId";
                parameters.Add("ExcludeId", excludeId.Value);
            }

            using var conn = _context.CreateConnection();
            var count = await conn.ExecuteScalarAsync<int>(sql, parameters);
            return count > 0;
        }

    }
}