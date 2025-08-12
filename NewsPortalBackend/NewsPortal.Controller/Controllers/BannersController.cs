using Microsoft.AspNetCore.Mvc;
using NewsPortal.Application.Banner.Interfaces;
using NewsPortal.Domain.Dtos;
using NewsPortal.Domain.Interfaces;
using NewsPortal.Domain.Models;

namespace NewsPortal.Controller.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly IBannerService _bannerService;
        private readonly ILogger<BannersController> _logger;

        public BannersController(IBannerService bannerService, ILogger<BannersController> logger)
        {
            _bannerService = bannerService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<Banner>> CreateBanner([FromBody] BannerCreateDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state for banner creation");
                    return BadRequest(ModelState);
                }

                var banner = await _bannerService.CreateBannerAsync(createDto);
                return CreatedAtAction(nameof(GetBanner), new { id = banner.Id }, banner);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating banner");
                return StatusCode(500, "An error occurred while creating the banner");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBanner(int id, [FromBody] BannerUpdateDto updateDto)
        {
            try
            {
                if (id != updateDto.Id)
                {
                    _logger.LogWarning("ID mismatch in banner update (Route: {RouteId}, DTO: {DtoId})", id, updateDto.Id);
                    return BadRequest("ID mismatch");
                }

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state for banner update");
                    return BadRequest(ModelState);
                }

                var result = await _bannerService.UpdateBannerAsync(updateDto);
                return result ? NoContent() : NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating banner with ID {BannerId}", id);
                return StatusCode(500, "An error occurred while updating the banner");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBanner(int id)
        {
            try
            {
                var result = await _bannerService.DeleteBannerAsync(id);
                return result ? NoContent() : NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting banner with ID {BannerId}", id);
                return StatusCode(500, "An error occurred while deleting the banner");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Banner>> GetBanner(int id)
        {
            try
            {
                var banner = await _bannerService.GetBannerByIdAsync(id);
                return banner != null ? Ok(banner) : NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting banner with ID {BannerId}", id);
                return StatusCode(500, "An error occurred while retrieving the banner");
            }
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<Banner>>> GetBanners(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null)
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1 || pageSize > 100) pageSize = 10;

                var result = await _bannerService.GetBannersAsync(page, pageSize, searchTerm);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting banners (Page: {Page}, PageSize: {PageSize})", page, pageSize);
                return StatusCode(500, "An error occurred while retrieving banners");
            }
        }

        [HttpPost("{bannerId}/positions/{positionId}")]
        public async Task<IActionResult> AssignToPosition(
            int bannerId,
            int positionId,
            [FromQuery] int priority = 0)
        {
            try
            {
                var result = await _bannerService.AssignBannerToPositionAsync(bannerId, positionId, priority);
                return result ? NoContent() : NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning banner {BannerId} to position {PositionId}", bannerId, positionId);
                return StatusCode(500, "An error occurred while assigning the banner to position");
            }
        }

        [HttpDelete("{bannerId}/positions/{positionId}")]
        public async Task<IActionResult> RemoveFromPosition(int bannerId, int positionId)
        {
            try
            {
                var result = await _bannerService.RemoveBannerFromPositionAsync(bannerId, positionId);
                return result ? NoContent() : NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing banner {BannerId} from position {PositionId}", bannerId, positionId);
                return StatusCode(500, "An error occurred while removing the banner from position");
            }
        }
    }
}
