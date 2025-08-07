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

    /*    /// <summary>
        /// Updates an existing article
        /// </summary>
        /// <param name="request">Article update request</param>
        /// <returns>True if update was successful, false otherwise</returns>
        Task<bool> UpdateAsync(UpdateArticleRequest request);

        /// <summary>
        /// Gets an article by its ID
        /// </summary>
        /// <param name="id">Article ID</param>
        /// <returns>Article response if found, otherwise null</returns>
        Task<ArticleResponse> GetByIdAsync(int id);

        /// <summary>
        /// Gets an article by its slug
        /// </summary>
        /// <param name="slug">Article slug</param>
        /// <returns>Article response if found, otherwise null</returns>
        Task<ArticleResponse> GetBySlugAsync(string slug);

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
        /// Publishes an article
        /// </summary>
        /// <param name="id">Article ID to publish</param>
        /// <param name="publicationDateTime">Publication date and time (optional, defaults to now)</param>
        /// <returns>True if publishing was successful, false otherwise</returns>
        Task<bool> PublishAsync(int id, DateTime? publicationDateTime = null);

        /// <summary>
        /// Unpublishes an article (sets status to draft)
        /// </summary>
        /// <param name="id">Article ID to unpublish</param>
        /// <returns>True if unpublishing was successful, false otherwise</returns>
        Task<bool> UnpublishAsync(int id);

        /// <summary>
        /// Generates a unique slug from the title
        /// </summary>
        /// <param name="title">Article title</param>
        /// <param name="excludeId">Article ID to exclude from uniqueness check (for updates)</param>
        /// <returns>Unique slug</returns>
        Task<string> GenerateSlugAsync(string title, int? excludeId = null);

        /// <summary>
        /// Validates if an article can be published
        /// </summary>
        /// <param name="request">Article request to validate</param>
        /// <returns>Validation result with any errors</returns>
        Task<ValidationResult> ValidateForPublishingAsync(CreateArticleRequest request);

        /// <summary>
        /// Validates if an article can be updated
        /// </summary>
        /// <param name="request">Article update request to validate</param>
        /// <returns>Validation result with any errors</returns>
        Task<ValidationResult> ValidateForUpdateAsync(UpdateArticleRequest request);*/
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
}
