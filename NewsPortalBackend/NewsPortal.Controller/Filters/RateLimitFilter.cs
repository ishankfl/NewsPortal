using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Caching.Memory;

namespace NewsPortal.Controller.Filters
{
    public class RateLimitFilter : IActionFilter
    {
        private readonly IMemoryCache _cache;
        private readonly int _maxRequests = 5;
        private readonly TimeSpan _timeWindow = TimeSpan.FromSeconds(10);

        public RateLimitFilter(IMemoryCache cache)
        {
            _cache = cache;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var httpContext = context.HttpContext;
            var clientId = httpContext.Connection.RemoteIpAddress?.ToString();

            if (string.IsNullOrEmpty(clientId))
            {
                // Fallback if IP not found
                clientId = "unknown_client";
            }

            var cacheKey = $"rate_limit_{clientId}";

            var requestTimes = _cache.GetOrCreate(cacheKey, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = _timeWindow;
                return new List<DateTime>();
            });

            requestTimes.RemoveAll(t => t < DateTime.UtcNow - _timeWindow);
            requestTimes.Add(DateTime.UtcNow);

            if (requestTimes.Count > _maxRequests)
            {
                context.Result = new ContentResult
                {
                    StatusCode = 429,
                    Content = "Rate limit exceeded. Please wait before making more requests."
                };
            }
            else
            {
                // Update the cache
                _cache.Set(cacheKey, requestTimes, _timeWindow);
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // Optional: Logging or cleanup
        }
    }
}
