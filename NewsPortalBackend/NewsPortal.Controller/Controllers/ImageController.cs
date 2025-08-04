using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewsPortal.Application.Users.Interfaces;

namespace NewsPortal.Controller.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly IImageService _imageService;

        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromForm] string name)
        {
            if (file == null || string.IsNullOrWhiteSpace(name))
                return BadRequest("Image file and name are required.");

            try
            {
                var id = await _imageService.UploadImageAsync(file, name);
                return Ok(new { message = "Image uploaded successfully", imageId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllImages()
        {
            var images = await _imageService.GetAllImagesAsync();
            return Ok(images);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var image = await _imageService.GetByIdAsync(id);
            if (image == null) return NotFound();
            return Ok(image);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _imageService.DeleteAsync(id);
            if (!result)
                return NotFound("Image not found or already deleted.");

            return NoContent();
        }
    }
}
