using NewsPortal.Domain.Dtos;
using NewsPortal.Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NewsPortal.Domain.Interfaces
{
    public interface IArticleRepository
    {
       Task<int> CreateAsync(Article article);
        Task<bool> SlugExistsAsync(string slug, int? excludeId = null);
        Task<(IEnumerable<ArticleWithImageDto> Articles, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, string? searchQuery);
        Task<ArticleWithImageDto> GetByIdAsync(int id);
        Task<IEnumerable<ArticleWithImageDto>> GetRelatedArticlesAsync(int articleId, int pageSize);
    }
}
