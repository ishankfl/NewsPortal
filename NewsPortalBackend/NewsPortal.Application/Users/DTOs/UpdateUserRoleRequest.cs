using NewsPortal.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsPortal.Application.Users.DTOs
{
    public class UpdateUserRoleRequest
    {
        public Role Role { get; set; }
    }
}
