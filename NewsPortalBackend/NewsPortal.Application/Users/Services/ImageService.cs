using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using NewsPortal.Application.Users.Interfaces;
using NewsPortal.Domain.Models;

namespace NewsPortal.Application.Users.Services
{
    public class ImageService : IImageService
    {
        private readonly IImageRepository _imageRepository;
        private readonly IWebHostEnvironment _env;

        public ImageService(IImageRepository imageRepository, IWebHostEnvironment env)
        {
            _imageRepository = imageRepository;
            _env = env;
        }

        public async Task<int> UploadImageAsync(IFormFile file, string name)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file uploaded.");

            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Image name is required.");

            // Use fallback for webRoot if null or empty
            var webRoot = _env.WebRootPath;
            if (string.IsNullOrEmpty(webRoot))
            {
                webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }

            var uploadFolder = Path.Combine(webRoot, "uploads");
            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath = Path.Combine("uploads", fileName).Replace("\\", "/");

            var image = new Image
            {
                Name = name,
                ImageUrl = "/" + relativePath
            };

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
            var image = await _imageRepository.GetByIdAsync(id);
            if (image == null) return false;

            // Delete physical file
            var fullPath = Path.Combine(_env.WebRootPath, image.ImageUrl.TrimStart('/'));
            if (File.Exists(fullPath))
                File.Delete(fullPath);

            return await _imageRepository.DeleteAsync(id);
        }
    }
}
