using NewsPortal.Application.Banner.Interfaces;
using NewsPortal.Domain.Dtos;
using NewsPortal.Domain.Interfaces;
using NewsPortal.Domain.Models;

namespace NewsPortal.Application.Services
{
    public class BannerService : IBannerService
    {
        private readonly IBannerRepository _bannerRepository;
        private readonly ILogger<BannerService> _logger;

        public BannerService(IBannerRepository bannerRepository, ILogger<BannerService> logger)
        {
            _bannerRepository = bannerRepository;
            _logger = logger;
        }

        public async Task<NewsPortal.Domain.Models.Banner> CreateBannerAsync(BannerCreateDto createDto)
        {
            try
            {
                var banner = new NewsPortal.Domain.Models.Banner
                {
                    Title = createDto.Title,
                    Description = createDto.Description,
                    ImageUrl = createDto.ImageUrl,
                    TargetUrl = createDto.TargetUrl,
                    BannerTypeId = createDto.BannerTypeId,
                    StartDate = createDto.StartDate,
                    EndDate = createDto.EndDate,
                    IsActive = createDto.IsActive,
                    Priority = createDto.Priority,
                    CreatedBy = createDto.CreatedBy
                };

                banner.Id = await _bannerRepository.CreateAsync(banner);
                _logger.LogInformation("Created new banner with ID {BannerId}", banner.Id);
                return banner;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating banner");
                throw;
            }
        }

        public async Task<bool> UpdateBannerAsync(BannerUpdateDto updateDto)
        {
            try
            {
                var existingBanner = await _bannerRepository.GetByIdAsync(updateDto.Id);
                if (existingBanner == null)
                {
                    _logger.LogWarning("Banner with ID {BannerId} not found for update", updateDto.Id);
                    return false;
                }

                existingBanner.Title = updateDto.Title;
                existingBanner.Description = updateDto.Description;
                existingBanner.ImageUrl = updateDto.ImageUrl;
                existingBanner.TargetUrl = updateDto.TargetUrl;
                existingBanner.BannerTypeId = updateDto.BannerTypeId;
                existingBanner.StartDate = updateDto.StartDate;
                existingBanner.EndDate = updateDto.EndDate;
                existingBanner.IsActive = updateDto.IsActive;
                existingBanner.Priority = updateDto.Priority;

                var result = await _bannerRepository.UpdateAsync(existingBanner);
                if (result)
                {
                    _logger.LogInformation("Updated banner with ID {BannerId}", updateDto.Id);
                }
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating banner with ID {BannerId}", updateDto.Id);
                throw;
            }
        }

        public async Task<bool> DeleteBannerAsync(int id)
        {
            try
            {
                var result = await _bannerRepository.DeleteAsync(id);
                if (result)
                {
                    _logger.LogInformation("Deleted banner with ID {BannerId}", id);
                }
                else
                {
                    _logger.LogWarning("Banner with ID {BannerId} not found for deletion", id);
                }
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting banner with ID {BannerId}", id);
                throw;
            }
        }

        public async Task<NewsPortal.Domain.Models.Banner?> GetBannerByIdAsync(int id)
        {
            try
            {
                var banner = await _bannerRepository.GetByIdAsync(id);
                if (banner == null)
                {
                    _logger.LogDebug("Banner with ID {BannerId} not found", id);
                }
                return banner;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting banner with ID {BannerId}", id);
                throw;
            }
        }

        public async Task<PaginatedResult<NewsPortal.Domain.Models.Banner>> GetBannersAsync(int page = 1, int pageSize = 10, string? searchTerm = null)
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1 || pageSize > 100) pageSize = 10;

                var result = await _bannerRepository.GetAllAsync(page, pageSize, searchTerm);
                _logger.LogDebug("Retrieved {BannerCount} banners on page {Page}", result.Items.Count(), page);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting banners (Page: {Page}, PageSize: {PageSize})", page, pageSize);
                throw;
            }
        }

        public async Task<bool> AssignBannerToPositionAsync(int bannerId, int positionId, int priority = 0)
        {
            try
            {
                var result = await _bannerRepository.AssignToPositionAsync(bannerId, positionId, priority);
                if (result)
                {
                    _logger.LogInformation("Assigned banner {BannerId} to position {PositionId} with priority {Priority}",
                        bannerId, positionId, priority);
                }
                else
                {
                    _logger.LogWarning("Failed to assign banner {BannerId} to position {PositionId}", bannerId, positionId);
                }
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning banner {BannerId} to position {PositionId}", bannerId, positionId);
                throw;
            }
        }

        public async Task<bool> RemoveBannerFromPositionAsync(int bannerId, int positionId)
        {
            try
            {
                var result = await _bannerRepository.RemoveFromPositionAsync(bannerId, positionId);
                if (result)
                {
                    _logger.LogInformation("Removed banner {BannerId} from position {PositionId}", bannerId, positionId);
                }
                else
                {
                    _logger.LogWarning("Failed to remove banner {BannerId} from position {PositionId}", bannerId, positionId);
                }
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing banner {BannerId} from position {PositionId}", bannerId, positionId);
                throw;
            }
        }
    }
}