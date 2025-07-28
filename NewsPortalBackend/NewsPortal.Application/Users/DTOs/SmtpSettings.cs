using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsPortal.Application.Users.DTOs
{
    public class SmtpSettings
    {
        public string Host { get; set; } = default;
        public int Port { get; set; }
        public bool EnableSsl { get; set; }
        public string SenderEmail { get; set; } = default;
        public string SenderName { get; set; } = "News Portal";
        public string Username { get; set; } = default;
        public string Password { get; set; } = default;
    }

}
