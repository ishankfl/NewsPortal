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

        // ✅ Create Article
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateArticleRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var articleId = await _articleService.CreateAsync(request);
                return Ok(articleId);
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

        // ✅ Get paged articles
        [HttpGet]
        public async Task<IActionResult> GetPaged([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
        {
            try
            {
                var result = await _articleService.GetPagedAsync(pageNumber, pageSize, search);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // ✅ Get article by ID
        [HttpGet("{id:int}")]
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

        // ✅ Get article by slug
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
    }

    public class PublishRequest
    {
        public DateTime? PublicationDateTime { get; set; }
    }
}
