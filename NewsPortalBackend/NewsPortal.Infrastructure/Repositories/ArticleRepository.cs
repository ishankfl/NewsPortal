using Dapper;
using NewsPortal.Domain.Dtos;
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
            await conn.OpenAsync();

            using var transaction = conn.BeginTransaction();
            try
            {
                var newId = await conn.ExecuteScalarAsync<int>(sql, new
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
                }, transaction);

                transaction.Commit();
                return newId;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
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

        public async Task<(IEnumerable<ArticleWithImageDto> Articles, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, string? searchQuery)
        {
            var offset = (pageNumber - 1) * pageSize;

            var sql = @"
                SELECT 
                    a.id AS Id,
                    a.language_code AS LanguageCode,
                    a.title AS Title,
                    a.slug AS Slug,
                    a.content AS Content,
                    a.summary AS Summary,
                    a.status AS Status,
                    a.publication_datetime AS PublicationDatetime,
                    a.allow_comments AS AllowComments,
                    a.cover_image_id AS CoverImageId,
                    a.author_id AS AuthorId,
                    a.reporter_id AS ReporterId,
                    a.seo_title AS SeoTitle,
                    a.seo_description AS SeoDescription,
                    a.seo_keywords AS SeoKeywords,
                    a.created_at AS CreatedAt,
                    a.updated_at AS UpdatedAt,
                    i.imageurl AS ImageUrl
                FROM articles a
                LEFT JOIN images i ON a.cover_image_id = i.id
                WHERE (@SearchQuery IS NULL 
                       OR a.title ILIKE '%' || @SearchQuery || '%' 
                       OR a.content ILIKE '%' || @SearchQuery || '%')
                ORDER BY a.publication_datetime DESC
                LIMIT @PageSize OFFSET @Offset;

                SELECT COUNT(*) 
                FROM articles a
                WHERE (@SearchQuery IS NULL 
                       OR a.title ILIKE '%' || @SearchQuery || '%' 
                       OR a.content ILIKE '%' || @SearchQuery || '%');
            ";

            using var conn = _context.CreateConnection();
            using var multi = await conn.QueryMultipleAsync(sql, new
            {
                SearchQuery = string.IsNullOrWhiteSpace(searchQuery) ? null : searchQuery,
                PageSize = pageSize,
                Offset = offset
            });

            var articles = await multi.ReadAsync<ArticleWithImageDto>();
            var totalCount = await multi.ReadSingleAsync<int>();

            return (articles, totalCount);
        }

        public async Task<ArticleWithImageDto?> GetByIdAsync(int id)
        {
            const string sql = @"
                SELECT 
                    a.id AS Id,
                    a.language_code AS LanguageCode,
                    a.title AS Title,
                    a.slug AS Slug,
                    a.content AS Content,
                    a.summary AS Summary,
                    a.status AS Status,
                    a.publication_datetime AS PublicationDatetime,
                    a.allow_comments AS AllowComments,
                    a.cover_image_id AS CoverImageId,
                    a.author_id AS AuthorId,
                    a.reporter_id AS ReporterId,
                    a.seo_title AS SeoTitle,
                    a.seo_description AS SeoDescription,
                    a.seo_keywords AS SeoKeywords,
                    a.created_at AS CreatedAt,
                    a.updated_at AS UpdatedAt,
                    i.imageurl AS ImageUrl
                FROM articles a
                LEFT JOIN images i ON a.cover_image_id = i.id
                WHERE a.id = @Id;
            ";

            using var conn = _context.CreateConnection();
            return await conn.QueryFirstOrDefaultAsync<ArticleWithImageDto>(sql, new { Id = id });
        }
    }
}
