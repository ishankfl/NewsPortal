using NewsPortal.Application.Articles.DTOs;
using NewsPortal.Application.Articles.Interfaces;
using NewsPortal.Application.Users.Interfaces;
using NewsPortal.Domain.Interfaces;
using NewsPortal.Domain.Models;
using System;
using System.Globalization;
using System.Linq;
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

        // ✅ Create new article
        public async Task<int> CreateAsync(CreateArticleRequest request)
        {
            var validationResult = await ValidateForPublishingAsync(request);
            if (!validationResult.IsValid)
                throw new ArgumentException($"Validation failed: {string.Join(", ", validationResult.Errors)}");

            var slug = string.IsNullOrWhiteSpace(request.Slug)
                ? await GenerateSlugAsync(request.Title)
                : request.Slug;

            if (await _articleRepository.SlugExistsAsync(slug))
                slug = await GenerateSlugAsync(request.Title);

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

        // ✅ Validation for creating
        public async Task<ValidationResult> ValidateForPublishingAsync(CreateArticleRequest request)
        {
            var result = new ValidationResult { IsValid = true };

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

            if (request.AuthorId <= 0)
            {
                result.Errors.Add("Author ID is required");
            }
            else if (await _userRepository.GetByIdAsync(request.AuthorId) == null)
            {
                result.Errors.Add("Author not found");
            }

            if (request.ReporterId.HasValue && request.ReporterId.Value > 0 &&
                await _userRepository.GetByIdAsync(request.ReporterId.Value) == null)
            {
                result.Errors.Add("Reporter not found");
            }

            if (request.CoverImage.HasValue && request.CoverImage.Value > 0 &&
                await _imageRepository.GetByIdAsync(request.CoverImage.Value) == null)
            {
                result.Errors.Add("Cover image not found");
            }

            if (!string.IsNullOrWhiteSpace(request.SeoTitle) && request.SeoTitle.Length > 70)
                result.Errors.Add("SEO title must be 70 characters or less");

            if (!string.IsNullOrWhiteSpace(request.SeoDescription) && request.SeoDescription.Length > 160)
                result.Errors.Add("SEO description must be 160 characters or less");

            result.IsValid = result.Errors.Count == 0;
            return result;
        }

        // ✅ Slug generation
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

            var slug = RemoveDiacritics(title.ToLowerInvariant());
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = Regex.Replace(slug, @"\s+", "-");
            slug = Regex.Replace(slug, @"-+", "-");
            slug = slug.Trim('-');

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
                if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }

        // ✅ Get paged articles
        public async Task<PagedArticleResponse> GetPagedAsync(int pageNumber, int pageSize, string? searchQuery)
        {
            var (articles, totalCount) = await _articleRepository.GetPagedAsync(pageNumber, pageSize, searchQuery);

            return new PagedArticleResponse
            {
                Articles = articles.Select(MapToDto),
                TotalCount = totalCount
            };
        }

        // ✅ NEW — Get single article by ID
        public async Task<ArticleDto?> GetByIdAsync(int id)
        {
            var article = await _articleRepository.GetByIdAsync(id);
            return article == null ? null : MapToDto(article);
        }

        // ✅ NEW — Get single article by Slug
        public async Task<ArticleDto?> GetBySlugAsync(string slug)
        {
            var article = await _articleRepository.GetBySlugAsync(slug);
            return article == null ? null : MapToDto(article);
        }

        // ✅ Helper — Map Article to DTO
        private static ArticleDto MapToDto(Article a)
        {
            return new ArticleDto
            {
                Id = a.Id,
                LanguageCode = a.LanguageCode,
                Title = a.Title,
                Slug = a.Slug,
                Summary = a.Summary,
                Content = a.Content,
                Status = a.Status,
                PublicationDatetime = a.PublicationDatetime,
                AllowComments = a.AllowComments,
                CoverImageId = a.CoverImageId,
                ImageUrl = a.ImageUrl ?? a.CoverImage?.ImageUrl,
                AuthorId = a.AuthorId,
                ReporterId = a.ReporterId,
                SeoTitle = a.SeoTitle,
                SeoDescription = a.SeoDescription,
                SeoKeywords = a.SeoKeywords,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            };
        }
    }
}
