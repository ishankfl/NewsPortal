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
                return Ok(articleId);
               // return CreatedAtAction(nameof(GetById), new { id = articleId }, new { Id = articleId });
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

        

        //// GET: api/article/{id}
        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetById(int id)
        //{
        //    try
        //    {
        //        var article = await _articleService.GetByIdAsync(id);
        //        if (article == null)
        //            return NotFound($"Article with ID {id} not found");

        //        return Ok(article);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal server error: {ex.Message}");
        //    }
        //}

      
    }

    public class PublishRequest
    {
        public DateTime? PublicationDateTime { get; set; }
    }
}
