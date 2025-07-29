

using NewsPortal.Domain.Enums;

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
