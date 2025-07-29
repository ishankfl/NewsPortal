using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace NewsPortal.Controller.Filters
{
    public class RateLimitFilter : IActionFilter
    {
        private readonly IMemoryCache _cache;

        public RateLimitFilter(IMemoryCache cache)
        {
            _cache = cache;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var httpContext = context.HttpContext;

            // Unique key per device (IP or Header or JWT or Cookie-based)
            var clientId = httpContext.Connection.RemoteIpAddress?.ToString();
            var cacheKey = $"rate_limit_{clientId}";

            if (_cache.TryGetValue(cacheKey, out _))
            {
                context.Result = new ContentResult
                {
                    StatusCode = 429,
                    Content = "Please wait before making another request."
                };
            }
            else
            {
                _cache.Set(cacheKey, true, TimeSpan.FromSeconds(5));
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // No need to do anything here
        }
    }
}
