using NewsPortal.Domain.Dtos;
using NewsPortal.Domain.Interfaces;
using NewsPortal.Domain.Models;

namespace NewsPortal.Application.Banner.Interfaces
{
    public interface IBannerService
    {
        Task<NewsPortal.Domain.Models.Banner> CreateBannerAsync(BannerCreateDto createDto);
        Task<bool> UpdateBannerAsync(BannerUpdateDto updateDto);
        Task<bool> DeleteBannerAsync(int id);
        Task<NewsPortal.Domain.Models.Banner?> GetBannerByIdAsync(int id);
        Task<PaginatedResult<NewsPortal.Domain.Models.Banner>> GetBannersAsync(int page = 1, int pageSize = 10, string? searchTerm = null);
        Task<bool> AssignBannerToPositionAsync(int bannerId, int positionId, int priority);
        Task<bool> RemoveBannerFromPositionAsync(int bannerId, int positionId);
    }
}
