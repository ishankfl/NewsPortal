using System;
using System.Linq;
using BCrypt.Net;

namespace NewsPortal.Application.Common.Utils
{
    public static class PasswordGenerator
    {
        private static readonly string ValidChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$?_-";

        public static string Generate(int length = 12)
        {
            var rnd = new Random();
            return new string(Enumerable.Repeat(ValidChars, length)
                .Select(s => s[rnd.Next(s.Length)]).ToArray());
        }

        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}
