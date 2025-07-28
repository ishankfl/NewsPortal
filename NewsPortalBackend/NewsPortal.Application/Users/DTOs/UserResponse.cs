using NewsPortal.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsPortal.Application.Users.DTOs
{

    public class UserResponse
    {
        public int Id { get; set; }
        public string Username { get; set; } = default;
        public string Email { get; set; } = default;
        public Role Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsSuspended { get; set; }
        public DateTime? SuspendedAt { get; set; }
    }
}
