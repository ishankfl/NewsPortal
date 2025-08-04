using NewsPortal.Application.Users.Interfaces;
using NewsPortal.Domain.Models;

namespace NewsPortal.Application.Users.Services
{
    public class ImageService : IImageService
    {
        private readonly IImageRepository _imageRepository;

        public ImageService(IImageRepository imageRepository)
        {
            _imageRepository = imageRepository ?? throw new ArgumentNullException(nameof(imageRepository));
        }

        public async Task<int> AddImageAsync(Image image)
        {
            if (string.IsNullOrWhiteSpace(image.Name))
                throw new ArgumentException("Image name is required.");

            if (string.IsNullOrWhiteSpace(image.ImageUrl))
                throw new ArgumentException("Image URL is required.");

            return await _imageRepository.AddImageAsync(image);
        }

        public async Task<IEnumerable<Image>> GetAllImagesAsync()
        {
            return await _imageRepository.GetAllImagesAsync();
        }

        public async Task<Image?> GetByIdAsync(int id)
        {
            return await _imageRepository.GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _imageRepository.DeleteAsync(id);
        }
    }
}
