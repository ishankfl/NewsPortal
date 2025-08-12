using NewsPortal.Application.Categories.Services;
using NewsPortal.Application.Category.Interfaces;
using NewsPortal.Application.Users.Interfaces;
using NewsPortal.Application.Users.Services;
using NewsPortal.Application.Articles.Interfaces;
using NewsPortal.Application.Articles.Services;
using NewsPortal.Controller.Filters;
using NewsPortal.Domain.Interfaces;
using NewsPortal.Infrastructure.Persistence;
using NewsPortal.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// CORS setup
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost5173", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // ✅ Fix here
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<DapperDbContext>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IAuthenticationRepository, AuthenticationRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IImageRepository, ImageRepository>();
builder.Services.AddScoped<IImageService, ImageService>();


builder.Services.AddScoped<ICategoryRepository, CategoriesRepository>();
builder.Services.AddScoped<ICategoryService, CategoriesService>();

builder.Services.AddScoped<IArticleRepository, ArticleRepository>();
builder.Services.AddScoped<IArticleService, ArticleService>();

builder.Services.AddMemoryCache();

builder.Services.AddScoped<RateLimitFilter>();

builder.Services.AddControllers(options =>
{
    options.Filters.Add<RateLimitFilter>();
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowLocalhost5173");
app.UseAuthorization();
app.UseStaticFiles();  // In Program.cs or Startup.cs

app.MapControllers();


app.Run();
