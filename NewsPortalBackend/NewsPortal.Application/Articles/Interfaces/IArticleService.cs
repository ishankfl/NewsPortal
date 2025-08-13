using NewsPortal.Application.Articles.DTOs;
using System.Threading.Tasks;

namespace NewsPortal.Application.Articles.Interfaces
{
    public interface IArticleService
    {
      Task<int> CreateAsync(CreateArticleRequest request);
        Task<ValidationResult> ValidateForPublishingAsync(CreateArticleRequest request);
        Task<string> GenerateSlugAsync(string title, int? excludeId = null);
        Task<PagedArticleResponse> GetPagedAsync(int pageNumber, int pageSize, string? searchQuery);
        Task<ArticleDto> GetByIdAsync(int id);
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
}
