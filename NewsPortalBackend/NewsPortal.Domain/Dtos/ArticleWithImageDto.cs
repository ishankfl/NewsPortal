namespace NewsPortal.Domain.Dtos
{
    public class ArticleWithImageDto
    {
        // Article properties matching your domain model:
        public int Id { get; set; }
        public string LanguageCode { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Status { get; set; } = "draft";
        public DateTime? PublicationDatetime { get; set; }
        public bool AllowComments { get; set; } = true;
        public int? CoverImageId { get; set; }
        public int AuthorId { get; set; }
        public int? ReporterId { get; set; }
        public string SeoTitle { get; set; } = string.Empty;
        public string SeoDescription { get; set; } = string.Empty;
        public string SeoKeywords { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Extra field from joined table
        public string? ImageUrl { get; set; }
    }
}
