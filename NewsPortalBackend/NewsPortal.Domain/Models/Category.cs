namespace NewsPortal.Domain.Models
{
    public class Categories
    {
        public int Id { get; set; }
        public string Name_En { get; set; } = default!;
        public string Name_Np { get; set; } = default!;
        public string Slug { get; set; } = default!;
    }
}
