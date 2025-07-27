using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsPortal.Domain.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name_En { get; set; } = default;
        public string Name_Np { get; set; } = default;
        public string Slug { get; set; } = default;
    }
}
