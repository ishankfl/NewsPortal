using NewsPortal.Domain.Models;
using System.Reflection;

namespace NewsPortal.Domain.Interfaces
{
    public interface IBannerRepository
    {
        Task<int> CreateAsync(Banner banner);
        Task<bool> UpdateAsync(Banner banner);
        Task<bool> DeleteAsync(int id);
        Task<Banner?> GetByIdAsync(int id);
        Task<PaginatedResult<Banner>> GetAllAsync(int page = 1, int pageSize = 10, string? searchTerm = null);
        Task<bool> AssignToPositionAsync(int bannerId, int positionId, int priority);
        Task<bool> RemoveFromPositionAsync(int bannerId, int positionId);
    }

    public class PaginatedResult<T>
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalItems / PageSize);
        public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
    }
}
