using NewsPortal.Application.Users.Interfaces;
using NewsPortal.Application.Users.Services;
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

app.UseCors("AllowLocalhost5173"); // ✅ Use before authorization
app.UseAuthorization();

app.MapControllers();

app.Run();
