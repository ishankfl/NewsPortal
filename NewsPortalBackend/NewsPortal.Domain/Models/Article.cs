using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsPortal.Domain.Models
{
    public class Article
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
        public string Status { get; set; } = "draft"; // 'draft' or 'published'
        public DateTime? PublicationDatetime { get; set; }
        public bool AllowComments { get; set; } = true;

        // Media & Users
        public int? CoverImageId { get; set; }
        public int AuthorId { get; set; }
        public int? ReporterId { get; set; }

        // SEO
        public string SeoTitle { get; set; } = default;
        public string SeoDescription { get; set; } = default;
        public string SeoKeywords { get; set; } = default;

        // Audit
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation Properties
        public Image CoverImage { get; set; }
        public User Author { get; set; }
        public User Reporter { get; set; }
    }
}
