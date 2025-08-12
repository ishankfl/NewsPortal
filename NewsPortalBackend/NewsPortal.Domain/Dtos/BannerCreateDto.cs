namespace NewsPortal.Domain.Dtos
{
    public class BannerCreateDto
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string ImageUrl { get; set; } = null!;
        public string? TargetUrl { get; set; }
        public int? BannerTypeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; } = true;
        public int Priority { get; set; } = 0;
        public int CreatedBy { get; set; }
    }

    public class BannerUpdateDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string ImageUrl { get; set; } = null!;
        public string? TargetUrl { get; set; }
        public int? BannerTypeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
        public int Priority { get; set; }
    }
}
