using NewsPortal.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsPortal.Application.Users.DTOs
{
    public class CreateUserRequest
    {
        public string Username { get; set; } = default;
        public string Email { get; set; } = default;
        public string PlainPassword { get; set; }   
        public Role Role { get; set; }
    }
}
