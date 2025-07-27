using NewsPortal.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsPortal.Domain.Models
{
    public class Advertisement
    {
        public int Id { get; set; }
        public string Title_En { get; set; } = default;
        public string Title_Np { get; set; } = default;
        public string ImageUrl { get; set; } = default;
        public string RedirectUrl { get; set; }
        public string PlacementKey { get; set; } = default;
        public AdPlacementType PlacementType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }

        public User Creator { get; set; }
    }
}
