using Microsoft.AspNetCore.Http;
using NewsPortal.Domain.Models;

namespace NewsPortal.Application.Users.Interfaces
{
    public interface IImageService
    {
        Task<int> UploadImageAsync(IFormFile file, string name);
        Task<IEnumerable<Image>> GetAllImagesAsync();
        Task<Image?> GetByIdAsync(int id);
        Task<bool> DeleteAsync(int id);
    }
}
