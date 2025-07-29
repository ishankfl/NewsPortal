namespace NewsPortal.Domain.Models
{
    public class GetUsersResult
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalItems / PageSize);
        public List<User> Items { get; set; } = new();
    }

}
