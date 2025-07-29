using NewsPortal.Domain.Enums;
using NewsPortal.Domain.Models;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NewsPortal.Domain.Interfaces
{
    public interface IUserRepository
    {
        /// <summary>
        /// Creates a new user in the database
        /// </summary>
        /// <param name="user">User entity to create</param>
        /// <returns>The ID of the newly created user</returns>
        Task<int> CreateAsync(User user);

        /// <summary>
        /// Gets a user by their ID
        /// </summary>
        /// <param name="id">User ID to search for</param>
        /// <returns>The user if found, otherwise null</returns>
        Task<User> GetByIdAsync(int id);

        /// <summary>
        /// Gets a user by their username or email
        /// </summary>
        /// <param name="usernameOrEmail">Username or email to search for</param>
        /// <returns>The user if found, otherwise null</returns>
        Task<User> GetByUsernameOrEmailAsync(string usernameOrEmail);

        /// <summary>
        /// Deletes a user by their ID
        /// </summary>
        /// <param name="id">ID of the user to delete</param>
        /// <returns>True if deletion was successful, false otherwise</returns>
        Task<bool> DeleteAsync(int id);

        /// <summary>
        /// Suspends a user account
        /// </summary>
        /// <param name="id">ID of the user to suspend</param>
        /// <returns>True if suspension was successful, false otherwise</returns>
        Task<bool> SuspendAsync(int id);

        /// <summary>
        /// Unsuspends a user account
        /// </summary>
        /// <param name="id">ID of the user to unsuspend</param>
        /// <returns>True if unsuspension was successful, false otherwise</returns>
        Task<bool> UnsuspendAsync(int id);

        /// <summary>
        /// Updates an existing user
        /// </summary>
        /// <param name="user">User entity with updated information</param>
        /// <returns>True if update was successful, false otherwise</returns>
        Task<bool> UpdateAsync(User user);

        Task<IEnumerable<User>> GetAllAsync();

    }
}