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
        public string Title_En { get; set; } = default;
        public string Title_Np { get; set; } = default;
        public string Slug { get; set; } = default;
        public string Content_En { get; set; } = default;
        public string Content_Np { get; set; } = default;
        public string CoverImageUrl { get; set; }
        public int CategoryId { get; set; }
        public int AuthorId { get; set; }
        public DateTime PublishedAt { get; set; }

        public Category Category { get; set; }
        public User Author { get; set; }
    }
}
