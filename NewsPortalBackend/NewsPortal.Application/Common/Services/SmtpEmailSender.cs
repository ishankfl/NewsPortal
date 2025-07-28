using NewsPortal.Application.Common.Interfaces;
using NewsPortal.Application.Users.DTOs;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace NewsPortal.Application.Common.Services
{
    public class SmtpEmailSender : IEmailSender
    {
        private readonly SmtpSettings _smtpSettings;

        public SmtpEmailSender(SmtpSettings smtpSettings)
        {
            _smtpSettings = smtpSettings;
        }

        public async Task SendAsync(string to, string subject, string htmlBody)
        {
            using (var message = new MailMessage())
            {
                message.From = new MailAddress(_smtpSettings.SenderEmail, _smtpSettings.SenderName);
                message.Subject = subject;
                message.Body = htmlBody;
                message.IsBodyHtml = true;
                message.To.Add(to);

                using (var client = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port))
                {
                    client.EnableSsl = _smtpSettings.EnableSsl;
                    client.Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password);
                    await client.SendMailAsync(message);
                }
            }
        }

    }
}
