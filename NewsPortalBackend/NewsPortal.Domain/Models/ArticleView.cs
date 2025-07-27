using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsPortal.Domain.Models
{
    public class ArticleView
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public string UserIp { get; set; }
        public DateTime ViewedAt { get; set; }

        public Article Article { get; set; }
    }
}
