using Microsoft.AspNetCore.Mvc;
using NewsPortal.Application.Articles.DTOs;
using NewsPortal.Application.Articles.Interfaces;
using System;
using System.Threading.Tasks;

namespace NewsPortal.Controller.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly IArticleService _articleService;

        public ArticleController(IArticleService articleService)
        {
            _articleService = articleService ?? throw new ArgumentNullException(nameof(articleService));
        }

        // POST: api/article
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateArticleRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var articleId = await _articleService.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = articleId }, new { Id = articleId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/article/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateArticleRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != request.Id)
                return BadRequest("ID mismatch");

            try
            {
                var success = await _articleService.UpdateAsync(request);
                if (!success)
                    return NotFound($"Article with ID {id} not found");

                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/article/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var article = await _articleService.GetByIdAsync(id);
                if (article == null)
                    return NotFound($"Article with ID {id} not found");

                return Ok(article);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/article/slug/{slug}
        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            try
            {
                var article = await _articleService.GetBySlugAsync(slug);
                if (article == null)
                    return NotFound($"Article with slug '{slug}' not found");

                return Ok(article);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/article/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var success = await _articleService.DeleteAsync(id);
                if (!success)
                    return NotFound($"Article with ID {id} not found");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/article
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string languageCode = null,
            [FromQuery] string status = null,
            [FromQuery] string searchTerm = null,
            [FromQuery] int? authorId = null,
            [FromQuery] int? reporterId = null)
        {
            try
            {
                var articles = await _articleService.GetAllAsync(page, pageSize, languageCode, status, searchTerm, authorId, reporterId);
                return Ok(articles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/article/author/{authorId}
        [HttpGet("author/{authorId}")]
        public async Task<IActionResult> GetByAuthor(
            int authorId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var articles = await _articleService.GetByAuthorAsync(authorId, page, pageSize);
                return Ok(articles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/article/published
        [HttpGet("published")]
        public async Task<IActionResult> GetPublished(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string languageCode = null)
        {
            try
            {
                var articles = await _articleService.GetPublishedAsync(page, pageSize, languageCode);
                return Ok(articles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/article/{id}/publish
        [HttpPost("{id}/publish")]
        public async Task<IActionResult> Publish(int id, [FromBody] PublishRequest request = null)
        {
            try
            {
                var success = await _articleService.PublishAsync(id, request?.PublicationDateTime);
                if (!success)
                    return NotFound($"Article with ID {id} not found");

                return Ok(new { message = "Article published successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/article/{id}/unpublish
        [HttpPost("{id}/unpublish")]
        public async Task<IActionResult> Unpublish(int id)
        {
            try
            {
                var success = await _articleService.UnpublishAsync(id);
                if (!success)
                    return NotFound($"Article with ID {id} not found");

                return Ok(new { message = "Article unpublished successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/article/generate-slug
        [HttpGet("generate-slug")]
        public async Task<IActionResult> GenerateSlug([FromQuery] string title, [FromQuery] int? excludeId = null)
        {
            if (string.IsNullOrWhiteSpace(title))
                return BadRequest("Title is required");

            try
            {
                var slug = await _articleService.GenerateSlugAsync(title, excludeId);
                return Ok(new { slug });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    public class PublishRequest
    {
        public DateTime? PublicationDateTime { get; set; }
    }
}
