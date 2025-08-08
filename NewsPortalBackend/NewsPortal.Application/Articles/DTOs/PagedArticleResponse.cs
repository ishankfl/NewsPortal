namespace NewsPortal.Application.Articles.DTOs
{
    public class PagedArticleResponse
    {
        public IEnumerable<ArticleDto> Articles { get; set; }
        public int TotalCount { get; set; }
    }
}
