using Microsoft.AspNetCore.Mvc;
using NewsPortal.Application.Category.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NewsPortal.Controller.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET: api/categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewsPortal.Domain.Models.Categories>>> GetAll()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        // GET: api/categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NewsPortal.Domain.Models.Categories>> GetById(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            if (category == null)
                return NotFound();

            return Ok(category);
        }

        // POST: api/categories
        [HttpPost]
        public async Task<ActionResult<int>> Create([FromBody] NewsPortal.Domain.Models.Categories category)
        {
            var id = await _categoryService.AddCategoryAsync(category);
            return CreatedAtAction(nameof(GetById), new { id = id }, category);
        }

        // PUT: api/categories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] NewsPortal.Domain.Models.Categories category)
        {
            if (id != category.Id)
                return BadRequest("ID mismatch");

            var success = await _categoryService.UpdateCategoryAsync(category);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _categoryService.DeleteCategoryAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
