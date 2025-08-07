using System;
using System.Collections.Generic;

namespace NewsPortal.Application.Articles.DTOs
{
    public class ArticleListResponse
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalItems / PageSize);
        public IEnumerable<ArticleResponse> Items { get; set; } = new List<ArticleResponse>();
    }
}
