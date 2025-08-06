using System.Collections.Generic;
using System.Threading.Tasks;

namespace NewsPortal.Application.Category.Interfaces
{
    public interface ICategoryService
    {
        Task<int> AddCategoryAsync(NewsPortal.Domain.Models.Categories category);
        Task<IEnumerable<NewsPortal.Domain.Models.Categories>> GetAllCategoriesAsync();
        Task<NewsPortal.Domain.Models.Categories?> GetCategoryByIdAsync(int id);
        Task<bool> UpdateCategoryAsync(NewsPortal.Domain.Models.Categories category);
        Task<bool> DeleteCategoryAsync(int id);
    }
}
