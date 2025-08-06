using NewsPortal.Domain.Models;

namespace NewsPortal.Domain.Interfaces
{
    public interface ICategoryRepository
    {
        Task<int> AddAsync(Categories category);
        Task<IEnumerable<Categories>> GetAllAsync();
        Task<Categories?> GetByIdAsync(int id);
        Task<bool> UpdateAsync(Categories category);
        Task<bool> DeleteAsync(int id);
    }
}
