using NewsPortal.Domain.Models;

namespace NewsPortal.Application.Users.Interfaces
{
    public interface IImageRepository
    {
        Task<int> AddImageAsync(Image image);
        Task<IEnumerable<Image>> GetAllImagesAsync();
        Task<Image?> GetByIdAsync(int id);
        Task<bool> DeleteAsync(int id);
    }
}
