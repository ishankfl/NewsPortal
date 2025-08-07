using System;

namespace NewsPortal.Application.Articles.DTOs
{
    public class ArticleResponse
    {
        public int Id { get; set; }
        
        // Language: English or Nepali
        public string LanguageCode { get; set; } = default; // 'en' or 'np'
        
        // Titles & Content
        public string Title { get; set; } = default;
        public string Slug { get; set; } = default;
        public string Content { get; set; } = default;
        public string Summary { get; set; } = default;
        
        // Status & Publishing Info
        public string Status { get; set; } = default; // 'draft' or 'published'
        public DateTime? PublicationDatetime { get; set; }
        public bool AllowComments { get; set; }
        
        // Media & Users
        public int? CoverImageId { get; set; }
        public string CoverImageUrl { get; set; } = default;
        public int AuthorId { get; set; }
        public string AuthorName { get; set; } = default;
        public int? ReporterId { get; set; }
        public string ReporterName { get; set; } = default;
        
        // SEO
        public string SeoTitle { get; set; } = default;
        public string SeoDescription { get; set; } = default;
        public string SeoKeywords { get; set; } = default;
        
        // Audit
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
