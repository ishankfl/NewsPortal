namespace NewsPortal.Application.Articles.DTOs
{
    public class ArticleDto
    {
        public int Id { get; set; }
        public string LanguageCode { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Summary { get; set; }
        public string Status { get; set; }
        public DateTime? PublicationDatetime { get; set; }
        public bool AllowComments { get; set; }
        public int? CoverImageId { get; set; }
        public int? AuthorId { get; set; }
        public int? ReporterId { get; set; }

        public string SeoTitle { get; set; }
        public string SeoDescription { get; set; }
        public string SeoKeywords { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
