using System;
using System.ComponentModel.DataAnnotations;

namespace NewsPortal.Application.Articles.DTOs
{
    public class CreateArticleRequest
    {
        [Required]
        [StringLength(10)]
        public string LanguageCode { get; set; } = default; // 'en' or 'np'
        
        [Required]
        [StringLength(255)]
        public string Title { get; set; } = default;
        
        [Required]
        [StringLength(255)]
        public string Slug { get; set; } = default;
        
        public string Content { get; set; } = default;
        
        public string Summary { get; set; } = default;
        
        [StringLength(20)]
        public string Status { get; set; } = "draft"; // 'draft' or 'published'
        
        public DateTime? PublicationDatetime { get; set; }
        
        public bool AllowComments { get; set; } = true;
        
        public int? CoverImageId { get; set; }
        
        [Required]
        public int AuthorId { get; set; }
        
        public int? ReporterId { get; set; }
        
        [StringLength(70)]
        public string SeoTitle { get; set; } = default;
        
        [StringLength(160)]
        public string SeoDescription { get; set; } = default;
        
        public string SeoKeywords { get; set; } = default;
    }
}
