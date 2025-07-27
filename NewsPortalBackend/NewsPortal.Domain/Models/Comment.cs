using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsPortal.Domain.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = default;
        public DateTime CreatedAt { get; set; }

        public Article Article { get; set; }
        public User User { get; set; }
    }
}
