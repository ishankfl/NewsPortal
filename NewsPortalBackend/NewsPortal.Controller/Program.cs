using Microsoft.AspNetCore.Identity.UI.Services;
using NewsPortal.Application.Common.Interfaces;
using NewsPortal.Application.Common.Services;
using NewsPortal.Application.Users.DTOs;
using NewsPortal.Application.Users.Interfaces;
using NewsPortal.Domain.Interfaces;
using NewsPortal.Infrastructure.Persistence;
using NewsPortal.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
 
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<DapperDbContext>();

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Services
builder.Services.AddScoped<IUserService, UserService>();
//var AppEmailSender = NewsPortal.ApplicSystem.AggregateException: 'Some services are not able to be constructed (Error while validating the service descriptor 'ServiceType: NewsPortal.Application.Users.Interfaces.IUserService Lifetime: Scoped ImplementationType: UserService': Unable to resolve service for type 'NewsPortal.Application.Users.DTOs.SmtpSettings' while attempting to activate 'NewsPortal.Application.Common.Services.SmtpEmailSender'.) (Error while validating the service descriptor 'ServiceType: NewsPortal.Application.Common.Interfaces.IEmailSenderSmtp Lifetime: Scoped ImplementationType: NewsPortal.Application.Common.Services.SmtpEmailSender': Unable to resolve service for type 'NewsPortal.Application.Users.DTOs.SmtpSettings' while attempting to activate 'NewsPortal.Application.Common.Services.SmtpEmailSender'.)'

builder.Services.Configure<SmtpSettings>(
    builder.Configuration.GetSection("Smtp")
);

//builder.Services.AddScoped<IEmailSenderSmtp, SmtpEmailSender>();

// Email sender (pick one)

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
