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
        Task<(IEnumerable<Article> Articles, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, string? searchQuery);

    }
}
