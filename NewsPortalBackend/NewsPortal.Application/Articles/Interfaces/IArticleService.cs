using NewsPortal.Application.Articles.DTOs;
using System.Threading.Tasks;

namespace NewsPortal.Application.Articles.Interfaces
{
    public interface IArticleService
    {
        /// <summary>
        /// Creates a new article
        /// </summary>
        /// <param name="request">Article creation request</param>
        /// <returns>The ID of the newly created article</returns>
        Task<int> CreateAsync(CreateArticleRequest request);
        Task<PagedArticleResponse> GetPagedAsync(int pageNumber, int pageSize, string? searchQuery);
 Task<ArticleDto?> GetByIdAsync(int id);
      
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
}
