using NewsPortal.Domain.Models;
using NewsPortal.Application.Articles.DTOs;
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

        /// <summary>
        /// Gets an article by its ID
        /// </summary>
        /// <param name="id">Article ID to search for</param>
        /// <returns>The article if found, otherwise null</returns>
        Task<Article> GetByIdAsync(int id);

        /// <summary>
        /// Gets an article by its slug
        /// </summary>
        /// <param name="slug">Article slug to search for</param>
        /// <returns>The article if found, otherwise null</returns>
        Task<Article> GetBySlugAsync(string slug);

        /// <summary>
        /// Updates an existing article
        /// </summary>
        /// <param name="article">Article entity with updated information</param>
        /// <returns>True if update was successful, false otherwise</returns>
        Task<bool> UpdateAsync(Article article);

        /// <summary>
        /// Deletes an article by its ID
        /// </summary>
        /// <param name="id">Article ID to delete</param>
        /// <returns>True if deletion was successful, false otherwise</returns>
        Task<bool> DeleteAsync(int id);

        /// <summary>
        /// Gets all articles with pagination and filtering
        /// </summary>
        /// <param name="page">Page number (1-based)</param>
        /// <param name="pageSize">Number of items per page</param>
        /// <param name="languageCode">Filter by language code ('en' or 'np')</param>
        /// <param name="status">Filter by status ('draft' or 'published')</param>
        /// <param name="searchTerm">Search term for title and content</param>
        /// <param name="authorId">Filter by author ID</param>
        /// <param name="reporterId">Filter by reporter ID</param>
        /// <returns>Paginated list of articles</returns>
        Task<ArticleListResponse> GetAllAsync(
            int page = 1, 
            int pageSize = 10, 
            string languageCode = null, 
            string status = null, 
            string searchTerm = null, 
            int? authorId = null, 
            int? reporterId = null);

        /// <summary>
        /// Gets articles by author ID with pagination
        /// </summary>
        /// <param name="authorId">Author ID to filter by</param>
        /// <param name="page">Page number (1-based)</param>
        /// <param name="pageSize">Number of items per page</param>
        /// <returns>Paginated list of articles by author</returns>
        Task<ArticleListResponse> GetByAuthorAsync(int authorId, int page = 1, int pageSize = 10);

        /// <summary>
        /// Gets published articles with pagination
        /// </summary>
        /// <param name="page">Page number (1-based)</param>
        /// <param name="pageSize">Number of items per page</param>
        /// <param name="languageCode">Filter by language code ('en' or 'np')</param>
        /// <returns>Paginated list of published articles</returns>
        Task<ArticleListResponse> GetPublishedAsync(int page = 1, int pageSize = 10, string languageCode = null);

        /// <summary>
        /// Checks if a slug already exists
        /// </summary>
        /// <param name="slug">Slug to check</param>
        /// <param name="excludeId">Article ID to exclude from check (for updates)</param>
        /// <returns>True if slug exists, false otherwise</returns>
        Task<bool> SlugExistsAsync(string slug, int? excludeId = null);
    }
}
