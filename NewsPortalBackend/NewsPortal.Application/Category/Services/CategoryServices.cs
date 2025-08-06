using NewsPortal.Application.Category.Interfaces;
using NewsPortal.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NewsPortal.Application.Categories.Services
{
    public class CategoriesService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoriesService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository ?? throw new ArgumentNullException(nameof(categoryRepository));
        }

        public async Task<int> AddCategoryAsync(NewsPortal.Domain.Models.Categories category)
        {
            return await _categoryRepository.AddAsync(category);
        }

        public async Task<IEnumerable<NewsPortal.Domain.Models.Categories>> GetAllCategoriesAsync()
        {
            return await _categoryRepository.GetAllAsync();
        }

        public async Task<NewsPortal.Domain.Models.Categories?> GetCategoryByIdAsync(int id)
        {
            return await _categoryRepository.GetByIdAsync(id);
        }

        public async Task<bool> UpdateCategoryAsync(NewsPortal.Domain.Models.Categories category)
        {
            return await _categoryRepository.UpdateAsync(category);
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            return await _categoryRepository.DeleteAsync(id);
        }
    }
}
