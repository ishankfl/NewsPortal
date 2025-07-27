using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsPortal.Domain.Models
{

    public class Media
    {
        public int Id { get; set; }
        public string FileName { get; set; } = default;
        public string FileUrl { get; set; } = default;
        public int? UploadedBy { get; set; }
        public DateTime UploadedAt { get; set; }

        public User Uploader { get; set; }
    }
}
