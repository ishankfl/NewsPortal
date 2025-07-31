using NewsPortal.Application.Articles.DTOs;
using NewsPortal.Application.Articles.Interfaces;
using NewsPortal.Application.Users.Interfaces;
using NewsPortal.Domain.Interfaces;
using NewsPortal.Domain.Models;
using System;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace NewsPortal.Application.Articles.Services
{
    public class ArticleService : IArticleService
    {
        private readonly IArticleRepository _articleRepository;
        private readonly IUserRepository _userRepository;
        private readonly IImageRepository _imageRepository;

        public ArticleService(
            IArticleRepository articleRepository,
            IUserRepository userRepository,
            IImageRepository imageRepository)
        {
            _articleRepository = articleRepository ?? throw new ArgumentNullException(nameof(articleRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _imageRepository = imageRepository ?? throw new ArgumentNullException(nameof(imageRepository));
        }

        public async Task<int> CreateAsync(CreateArticleRequest request)
        {
            // Validate the request
            var validationResult = await ValidateForPublishingAsync(request);
            if (!validationResult.IsValid)
            {
                throw new ArgumentException($"Validation failed: {string.Join(", ", validationResult.Errors)}");
            }

            // Generate unique slug if not provided or if it already exists
            var slug = string.IsNullOrWhiteSpace(request.Slug)
                ? await GenerateSlugAsync(request.Title)
                : request.Slug;

            if (await _articleRepository.SlugExistsAsync(slug))
            {
                slug = await GenerateSlugAsync(request.Title);
            }

            var article = new Article
            {
                LanguageCode = request.LanguageCode,
                Title = request.Title,
                Slug = slug,
                Content = request.Content,
                Summary = request.Summary,
                Status = request.Status,
                PublicationDatetime = request.PublicationDatetime,
                AllowComments = request.AllowComments,
                CoverImageId = request.CoverImage,
                AuthorId = request.AuthorId,
                ReporterId = request.ReporterId,
                SeoTitle = request.SeoTitle,
                SeoDescription = request.SeoDescription,
                SeoKeywords = request.SeoKeywords,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            return await _articleRepository.CreateAsync(article);
        }

        public async Task<ValidationResult> ValidateForPublishingAsync(CreateArticleRequest request)
        {
            var result = new ValidationResult { IsValid = true };

            // Validate required fields
            if (string.IsNullOrWhiteSpace(request.Title))
                result.Errors.Add("Title is required");

            if (string.IsNullOrWhiteSpace(request.LanguageCode))
                result.Errors.Add("Language code is required");
            else if (request.LanguageCode != "en" && request.LanguageCode != "np")
                result.Errors.Add("Language code must be 'en' or 'np'");

            if (string.IsNullOrWhiteSpace(request.Status))
                result.Errors.Add("Status is required");
            else if (request.Status != "draft" && request.Status != "published")
                result.Errors.Add("Status must be 'draft' or 'published'");

            // Validate author exists
            if (request.AuthorId <= 0)
            {
                result.Errors.Add("Author ID is required");
            }
            else
            {
                var author = await _userRepository.GetByIdAsync(request.AuthorId);
                if (author == null)
                    result.Errors.Add("Author not found");
            }

            // Validate reporter if provided
            if (request.ReporterId.HasValue && request.ReporterId.Value > 0)
            {
                var reporter = await _userRepository.GetByIdAsync(request.ReporterId.Value);
                if (reporter == null)
                    result.Errors.Add("Reporter not found");
            }

            // Validate cover image if provided
            if (request.CoverImage.HasValue && request.CoverImage.Value > 0)
            {
                var image = await _imageRepository.GetByIdAsync(request.CoverImage.Value);
                if (image == null)
                    result.Errors.Add("Cover image not found");
            }

            // Validate SEO fields length
            if (!string.IsNullOrWhiteSpace(request.SeoTitle) && request.SeoTitle.Length > 70)
                result.Errors.Add("SEO title must be 70 characters or less");

            if (!string.IsNullOrWhiteSpace(request.SeoDescription) && request.SeoDescription.Length > 160)
                result.Errors.Add("SEO description must be 160 characters or less");

            result.IsValid = result.Errors.Count == 0;
            return result;
        }
        public async Task<string> GenerateSlugAsync(string title, int? excludeId = null)
        {
            var baseSlug = GenerateSlugFromTitle(title);
            var slug = baseSlug;
            var counter = 1;

            while (await _articleRepository.SlugExistsAsync(slug, excludeId))
            {
                slug = $"{baseSlug}-{counter}";
                counter++;
            }

            return slug;
        }

        private static string GenerateSlugFromTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return "article";

            // Convert to lowercase
            var slug = title.ToLowerInvariant();

            // Remove diacritics (accents)
            slug = RemoveDiacritics(slug);

            // Replace spaces and special characters with hyphens
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = Regex.Replace(slug, @"\s+", "-");
            slug = Regex.Replace(slug, @"-+", "-");

            // Trim hyphens from start and end
            slug = slug.Trim('-');

            // Limit length
            if (slug.Length > 100)
                slug = slug.Substring(0, 100).TrimEnd('-');

            return string.IsNullOrWhiteSpace(slug) ? "article" : slug;
        }

        private static string RemoveDiacritics(string text)
        {
            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }
        public async Task<PagedArticleResponse> GetPagedAsync(int pageNumber, int pageSize, string? searchQuery)
        {
            var (articles, totalCount) = await _articleRepository.GetPagedAsync(pageNumber, pageSize, searchQuery);

            return new PagedArticleResponse
            {
                Articles = articles.Select(a => new ArticleDto
                {
                    Id = a.Id,
                    LanguageCode = a.LanguageCode,
                    Title = a.Title,
                    Slug = a.Slug,
                    Summary = a.Summary,
                    Status = a.Status,
                    PublicationDatetime = a.PublicationDatetime,
                    AllowComments = a.AllowComments,
                    CoverImageId = a.CoverImageId,
                    AuthorId = a.AuthorId,
                    ReporterId = a.ReporterId,
                    SeoTitle = a.SeoTitle,
                    SeoDescription = a.SeoDescription,
                    SeoKeywords = a.SeoKeywords,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt,
                    ImageUrl = a.ImageUrl
                }),
                TotalCount = totalCount
            };
        }


        /*  public async Task<bool> UpdateAsync(UpdateArticleRequest request)
          {
              // Validate the request
              var validationResult = await ValidateForUpdateAsync(request);
              if (!validationResult.IsValid)
              {
                  throw new ArgumentException($"Validation failed: {string.Join(", ", validationResult.Errors)}");
              }

              // Check if article exists
              var existingArticle = await _articleRepository.GetByIdAsync(request.Id);
              if (existingArticle == null)
              {
                  return false;
              }

              // Generate unique slug if changed
              var slug = request.Slug;
              if (existingArticle.Slug != request.Slug && await _articleRepository.SlugExistsAsync(request.Slug, request.Id))
              {
                  slug = await GenerateSlugAsync(request.Title, request.Id);
              }

              var article = new Article
              {
                  Id = request.Id,
                  LanguageCode = request.LanguageCode,
                  Title = request.Title,
                  Slug = slug,
                  Content = request.Content,
                  Summary = request.Summary,
                  Status = request.Status,
                  PublicationDatetime = request.PublicationDatetime,
                  AllowComments = request.AllowComments,
                  CoverImageId = request.CoverImageId,
                  AuthorId = request.AuthorId,
                  ReporterId = request.ReporterId,
                  SeoTitle = request.SeoTitle,
                  SeoDescription = request.SeoDescription,
                  SeoKeywords = request.SeoKeywords,
                  CreatedAt = existingArticle.CreatedAt, // Preserve original creation time
                  UpdatedAt = DateTime.UtcNow
              };

              return await _articleRepository.UpdateAsync(article);
          }

          public async Task<ArticleResponse> GetByIdAsync(int id)
          {
              var article = await _articleRepository.GetByIdAsync(id);
              return article == null ? null : MapToResponse(article);
          }

          public async Task<ArticleResponse> GetBySlugAsync(string slug)
          {
              var article = await _articleRepository.GetBySlugAsync(slug);
              return article == null ? null : MapToResponse(article);
          }

          public async Task<bool> DeleteAsync(int id)
          {
              return await _articleRepository.DeleteAsync(id);
          }

          public async Task<ArticleListResponse> GetAllAsync(
              int page = 1, 
              int pageSize = 10, 
              string languageCode = null, 
              string status = null, 
              string searchTerm = null, 
              int? authorId = null, 
              int? reporterId = null)
          {
              return await _articleRepository.GetAllAsync(page, pageSize, languageCode, status, searchTerm, authorId, reporterId);
          }

          public async Task<ArticleListResponse> GetByAuthorAsync(int authorId, int page = 1, int pageSize = 10)
          {
              return await _articleRepository.GetByAuthorAsync(authorId, page, pageSize);
          }

          public async Task<ArticleListResponse> GetPublishedAsync(int page = 1, int pageSize = 10, string languageCode = null)
          {
              return await _articleRepository.GetPublishedAsync(page, pageSize, languageCode);
          }

          public async Task<bool> PublishAsync(int id, DateTime? publicationDateTime = null)
          {
              var article = await _articleRepository.GetByIdAsync(id);
              if (article == null)
              {
                  return false;
              }

              article.Status = "published";
              article.PublicationDatetime = publicationDateTime ?? DateTime.UtcNow;
              article.UpdatedAt = DateTime.UtcNow;

              return await _articleRepository.UpdateAsync(article);
          }

          public async Task<bool> UnpublishAsync(int id)
          {
              var article = await _articleRepository.GetByIdAsync(id);
              if (article == null)
              {
                  return false;
              }

              article.Status = "draft";
              article.PublicationDatetime = null;
              article.UpdatedAt = DateTime.UtcNow;

              return await _articleRepository.UpdateAsync(article);
          }

         

      

        

          public async Task<ValidationResult> ValidateForUpdateAsync(UpdateArticleRequest request)
          {
              var result = new ValidationResult { IsValid = true };

              // Validate ID
              if (request.Id <= 0)
                  result.Errors.Add("Article ID is required");

              // Validate required fields
              if (string.IsNullOrWhiteSpace(request.Title))
                  result.Errors.Add("Title is required");

              if (string.IsNullOrWhiteSpace(request.LanguageCode))
                  result.Errors.Add("Language code is required");
              else if (request.LanguageCode != "en" && request.LanguageCode != "np")
                  result.Errors.Add("Language code must be 'en' or 'np'");

              if (string.IsNullOrWhiteSpace(request.Status))
                  result.Errors.Add("Status is required");
              else if (request.Status != "draft" && request.Status != "published")
                  result.Errors.Add("Status must be 'draft' or 'published'");

              // Validate author exists
              if (request.AuthorId <= 0)
              {
                  result.Errors.Add("Author ID is required");
              }
              else
              {
                  var author = await _userRepository.GetByIdAsync(request.AuthorId);
                  if (author == null)
                      result.Errors.Add("Author not found");
              }

              // Validate reporter if provided
              if (request.ReporterId.HasValue && request.ReporterId.Value > 0)
              {
                  var reporter = await _userRepository.GetByIdAsync(request.ReporterId.Value);
                  if (reporter == null)
                      result.Errors.Add("Reporter not found");
              }

              // Validate cover image if provided
              if (request.CoverImageId.HasValue && request.CoverImageId.Value > 0)
              {
                  var image = await _imageRepository.GetByIdAsync(request.CoverImageId.Value);
                  if (image == null)
                      result.Errors.Add("Cover image not found");
              }

              // Validate SEO fields length
              if (!string.IsNullOrWhiteSpace(request.SeoTitle) && request.SeoTitle.Length > 70)
                  result.Errors.Add("SEO title must be 70 characters or less");

              if (!string.IsNullOrWhiteSpace(request.SeoDescription) && request.SeoDescription.Length > 160)
                  result.Errors.Add("SEO description must be 160 characters or less");

              result.IsValid = result.Errors.Count == 0;
              return result;
          }

          private static ArticleResponse MapToResponse(Article article)
          {
              return new ArticleResponse
              {
                  Id = article.Id,
                  LanguageCode = article.LanguageCode,
                  Title = article.Title,
                  Slug = article.Slug,
                  Content = article.Content,
                  Summary = article.Summary,
                  Status = article.Status,
                  PublicationDatetime = article.PublicationDatetime,
                  AllowComments = article.AllowComments,
                  CoverImageId = article.CoverImageId,
                  CoverImageUrl = article.CoverImage?.ImageUrl,
                  AuthorId = article.AuthorId,
                  AuthorName = article.Author?.Username,
                  ReporterId = article.ReporterId,
                  ReporterName = article.Reporter?.Username,
                  SeoTitle = article.SeoTitle,
                  SeoDescription = article.SeoDescription,
                  SeoKeywords = article.SeoKeywords,
                  CreatedAt = article.CreatedAt,
                  UpdatedAt = article.UpdatedAt
              };
          }*/

    }
}
