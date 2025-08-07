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

    /*    public async Task<Article> GetByIdAsync(int id)
        {
            const string sql = @"
                SELECT 
                    a.id, a.language_code as LanguageCode, a.title, a.slug, 
                    a.content, a.summary, a.status, a.publication_datetime as PublicationDatetime,
                    a.allow_comments as AllowComments, a.cover_image_id as CoverImageId,
                    a.author_id as AuthorId, a.reporter_id as ReporterId,
                    a.seo_title as SeoTitle, a.seo_description as SeoDescription,
                    a.seo_keywords as SeoKeywords, a.created_at as CreatedAt, 
                    a.updated_at as UpdatedAt,
                    i.id, i.name, i.imageurl as ImageUrl,
                    u1.id, u1.username, u1.email,
                    u2.id, u2.username, u2.email
                FROM articles a
                LEFT JOIN images i ON a.cover_image_id = i.id
                LEFT JOIN users u1 ON a.author_id = u1.id
                LEFT JOIN users u2 ON a.reporter_id = u2.id
                WHERE a.id = @Id;";

            using var conn = _context.CreateConnection();

            var articleDict = new Dictionary<int, Article>();

            var result = await conn.QueryAsync<Article, Image, User, User, Article>(
                sql,
                (article, coverImage, author, reporter) =>
                {
                    if (!articleDict.TryGetValue(article.Id, out var articleEntry))
                    {
                        articleEntry = article;
                        articleDict.Add(article.Id, articleEntry);
                    }

                    if (coverImage != null)
                        articleEntry.CoverImage = coverImage;
                    if (author != null)
                        articleEntry.Author = author;
                    if (reporter != null)
                        articleEntry.Reporter = reporter;

                    return articleEntry;
                },
                new { Id = id },
                splitOn: "id,id,id"
            );

            return result.FirstOrDefault();
        }

        public async Task<Article> GetBySlugAsync(string slug)
        {
            const string sql = @"
                SELECT 
                    a.id, a.language_code as LanguageCode, a.title, a.slug, 
                    a.content, a.summary, a.status, a.publication_datetime as PublicationDatetime,
                    a.allow_comments as AllowComments, a.cover_image_id as CoverImageId,
                    a.author_id as AuthorId, a.reporter_id as ReporterId,
                    a.seo_title as SeoTitle, a.seo_description as SeoDescription,
                    a.seo_keywords as SeoKeywords, a.created_at as CreatedAt, 
                    a.updated_at as UpdatedAt,
                    i.id, i.name, i.imageurl as ImageUrl,
                    u1.id, u1.username, u1.email,
                    u2.id, u2.username, u2.email
                FROM articles a
                LEFT JOIN images i ON a.cover_image_id = i.id
                LEFT JOIN users u1 ON a.author_id = u1.id
                LEFT JOIN users u2 ON a.reporter_id = u2.id
                WHERE a.slug = @Slug;";

            using var conn = _context.CreateConnection();

            var articleDict = new Dictionary<int, Article>();

            var result = await conn.QueryAsync<Article, Image, User, User, Article>(
                sql,
                (article, coverImage, author, reporter) =>
                {
                    if (!articleDict.TryGetValue(article.Id, out var articleEntry))
                    {
                        articleEntry = article;
                        articleDict.Add(article.Id, articleEntry);
                    }

                    if (coverImage != null)
                        articleEntry.CoverImage = coverImage;
                    if (author != null)
                        articleEntry.Author = author;
                    if (reporter != null)
                        articleEntry.Reporter = reporter;

                    return articleEntry;
                },
                new { Slug = slug },
                splitOn: "id,id,id"
            );

            return result.FirstOrDefault();
        }

        public async Task<bool> UpdateAsync(Article article)
        {
            const string sql = @"
                UPDATE articles SET
                    language_code = @LanguageCode,
                    title = @Title,
                    slug = @Slug,
                    content = @Content,
                    summary = @Summary,
                    status = @Status,
                    publication_datetime = @PublicationDatetime,
                    allow_comments = @AllowComments,
                    cover_image_id = @CoverImageId,
                    author_id = @AuthorId,
                    reporter_id = @ReporterId,
                    seo_title = @SeoTitle,
                    seo_description = @SeoDescription,
                    seo_keywords = @SeoKeywords,
                    updated_at = NOW()
                WHERE id = @Id;";

            using var conn = _context.CreateConnection();
            var affectedRows = await conn.ExecuteAsync(sql, new
            {
                article.Id,
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

            return affectedRows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string sql = @"DELETE FROM articles WHERE id = @Id;";

            using var conn = _context.CreateConnection();
            var affectedRows = await conn.ExecuteAsync(sql, new { Id = id });

            return affectedRows > 0;
        }

        public async Task<ArticleList> GetAllAsync(
            int page = 1,
            int pageSize = 10,
            string languageCode = null,
            string status = null,
            string searchTerm = null,
            int? authorId = null,
            int? reporterId = null)
        {
            var offset = (page - 1) * pageSize;
            var sqlBuilder = new SqlBuilder();

            var baseSql = @"
                SELECT
                    a.id, a.language_code as LanguageCode, a.title, a.slug,
                    a.content, a.summary, a.status, a.publication_datetime as PublicationDatetime,
                    a.allow_comments as AllowComments, a.cover_image_id as CoverImageId,
                    a.author_id as AuthorId, a.reporter_id as ReporterId,
                    a.seo_title as SeoTitle, a.seo_description as SeoDescription,
                    a.seo_keywords as SeoKeywords, a.created_at as CreatedAt,
                    a.updated_at as UpdatedAt,
                    i.imageurl as CoverImageUrl,
                    u1.username as AuthorName,
                    u2.username as ReporterName
                FROM articles a
                LEFT JOIN images i ON a.cover_image_id = i.id
                LEFT JOIN users u1 ON a.author_id = u1.id
                LEFT JOIN users u2 ON a.reporter_id = u2.id
                /**where**/
                ORDER BY a.created_at DESC
                OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;";

            var countSql = @"
                SELECT COUNT(*) FROM articles a
                /**where**/;";

            var parameters = new DynamicParameters();
            parameters.Add("Offset", offset);
            parameters.Add("PageSize", pageSize);

            if (!string.IsNullOrWhiteSpace(languageCode))
            {
                sqlBuilder.Where("a.language_code = @LanguageCode");
                parameters.Add("LanguageCode", languageCode);
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                sqlBuilder.Where("a.status = @Status");
                parameters.Add("Status", status);
            }

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                sqlBuilder.Where("(a.title ILIKE @Search OR a.content ILIKE @Search OR a.summary ILIKE @Search)");
                parameters.Add("Search", $"%{searchTerm}%");
            }

            if (authorId.HasValue)
            {
                sqlBuilder.Where("a.author_id = @AuthorId");
                parameters.Add("AuthorId", authorId.Value);
            }

            if (reporterId.HasValue)
            {
                sqlBuilder.Where("a.reporter_id = @ReporterId");
                parameters.Add("ReporterId", reporterId.Value);
            }

            using var conn = _context.CreateConnection();

            var template = sqlBuilder.AddTemplate(baseSql);
            var countTemplate = sqlBuilder.AddTemplate(countSql);

            var articles = await conn.QueryAsync<ArticleResponse>(template.RawSql, parameters);
            var totalCount = await conn.ExecuteScalarAsync<int>(countTemplate.RawSql, parameters);

            return new ArticleListResponse
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalItems = totalCount,
                Items = articles
            };
        }

        public async Task<ArticleListResponse> GetByAuthorAsync(int authorId, int page = 1, int pageSize = 10)
        {
            return await GetAllAsync(page, pageSize, null, null, null, authorId, null);
        }

        public async Task<ArticleListResponse> GetPublishedAsync(int page = 1, int pageSize = 10, string languageCode = null)
        {
            return await GetAllAsync(page, pageSize, languageCode, "published", null, null, null);
        }

        public async Task<bool> SlugExistsAsync(string slug, int? excludeId = null)
        {
            var sql = "SELECT COUNT(*) FROM articles WHERE slug = @Slug";
            var parameters = new { Slug = slug };

            if (excludeId.HasValue)
            {
                sql += " AND id != @ExcludeId";
                parameters = new { Slug = slug, ExcludeId = excludeId.Value };
            }

            using var conn = _context.CreateConnection();
            var count = await conn.ExecuteScalarAsync<int>(sql, parameters);
            return count > 0;
        }*/
    }
}