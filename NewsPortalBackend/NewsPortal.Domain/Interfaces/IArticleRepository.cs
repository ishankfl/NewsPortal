using NewsPortal.Domain.Dtos;
using NewsPortal.Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NewsPortal.Domain.Interfaces
{
    public interface IArticleRepository
    {
        /// <summary>
        /// Creates a new article in the database
        /// </summary>
        /// <param name="article">Article entity to create</param>
        /// <returns>The ID of the newly created article</returns>
        Task<int> CreateAsync(Article article);

        Task<bool> SlugExistsAsync(string slug, int? excludeId = null);

        /// <summary>
        /// Get paginated articles including ImageUrl from joined images table
        /// </summary>
        /// <param name="pageNumber">Page number (1-based)</param>
        /// <param name="pageSize">Page size</param>
        /// <param name="searchQuery">Optional search query</param>
        /// <returns>Tuple with collection of ArticleWithImageDto and total count</returns>
        Task<(IEnumerable<ArticleWithImageDto> Articles, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, string? searchQuery);

         Task<ArticleWithImageDto?> GetByIdAsync(int id);
    }
}
