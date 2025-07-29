using System.Threading.Tasks;

namespace NewsPortal.Application.Common.Interfaces
{
    public interface IEmailSenderSmtp
    {
        Task SendAsync(string to, string subject, string htmlBody);
    }
}
