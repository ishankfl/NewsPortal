using NewsPortal.Application.Common.Interfaces;
using NewsPortal.Application.Common.Utils;
using NewsPortal.Application.Users.DTOs;
using NewsPortal.Application.Users.Interfaces;
using NewsPortal.Domain.Enums;
using NewsPortal.Domain.Interfaces;
using NewsPortal.Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailSenderSmtp _emailSender; 

    public UserService(IUserRepository userRepository, IEmailSenderSmtp emailSender = null)
    {
        _userRepository = userRepository;
        _emailSender = emailSender;
    }

    public async Task<int> CreateAsync(CreateUserRequest request, bool autoGeneratePassword = true)
    {
        var plainPassword = autoGeneratePassword
            ? PasswordGenerator.Generate()
            : request.PlainPassword ?? throw new ArgumentException("PlainPassword is required when autoGeneratePassword=false");
       // HashPassword
        var passwordHash = PasswordGenerator.HashPassword(plainPassword);

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = passwordHash,
            Role = request.Role,
            IsSuspended = false
        };

        var newId = await _userRepository.CreateAsync(user);

        if (_emailSender !=  null)
        {
            var subject = "Your account has been created";
            var body = $@"
                <p>Hello {request.Username},</p>
                <p>Your account has been created with role <strong>{request.Role}</strong>.</p>
                <p><strong>Username:</strong> {request.Username}</p>
                <p><strong>Password:</strong> {plainPassword}</p>
                <p>Please change your password after first login.</p>";
            await _emailSender.SendAsync(request.Email, subject, body);
        }

        return newId;
    }

    public Task<bool> DeleteAsync(int id) => _userRepository.DeleteAsync(id);

    public Task<bool> SuspendAsync(int id) => _userRepository.SuspendAsync(id);

    public Task<bool> UnsuspendAsync(int id) => _userRepository.UnsuspendAsync(id);

    public Task<GetUsersResult> GetAllAsync(int page = 1, int pageSize = 10, string? searchTerm = null)
    {
        return _userRepository.GetAllAsync(page, pageSize, searchTerm);
    }


    public async Task<UserResponse> GetByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user is null ? null : MapToResponse(user);
    }

    public async Task<bool> UpdateRoleAsync(int id, Role newRole)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user is null) return false;

        if (user.Role == newRole) return true;

        user.Role = newRole;
        var ok = await _userRepository.UpdateAsync(user);

        if (ok && _emailSender !=  null)
        {
            var subject = "Your role has been updated";
            var body = $@"
                <p>Hello {user.Username},</p>
                <p>Your role has been changed to <strong>{newRole}</strong>.</p>";
            await _emailSender.SendAsync(user.Email, subject, body);
        }

        return ok;
    }

/*    private static UserResponse MapToResponse(User u) => new()
    {
        Id = u.Id,
        Username = u.Username,
        Email = u.Email,
        Role = u.Role,
        CreatedAt = u.CreatedAt,
        IsSuspended = u.IsSuspended,
        SuspendedAt = u.SuspendedAt
    };*/

    private static UserResponse MapToResponse(User u)
    {
        // ArgumentNullException.(u);

        return new UserResponse
        {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            Role = u.Role,
            CreatedAt = u.CreatedAt,
            IsSuspended = u.IsSuspended,
            SuspendedAt = u.SuspendedAt
        };
    }
}
