using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
    }
}
