using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using api.Service;

namespace CloudChef.Library.Services
{
    public interface IMailService
    {
        Task SendAsync(string subject, string body, string email);
        Task SendAsync(string subject, IEnumerable<int> userIds, string body);
        Task SendAsync(string subject, IEnumerable<int> userIds, string body, IList<FileAttachment> attachments);
        Task<string> GetHtmlTemplateAsync(string fileName, string? subfolder = null);
    }

    public class MailService(
        IConfiguration configuration,
        IUserService userService) : IMailService
    {
        private readonly IUserService _userService = userService;
        private readonly IConfiguration _configuration = configuration;

        public async Task SendAsync(string subject, IEnumerable<int> userIds, string body, IList<FileAttachment> attachments)
        {
            var sendTo = await _userService.GetEmailsByUserIds(userIds);
            await SendAsync(subject, body, sendTo, attachments);
        }

        public async Task SendAsync(string subject, IEnumerable<int> userIds, string body)
        {
            var sendTo = await _userService.GetEmailsByUserIds(userIds);
            await SendAsync(subject, body, sendTo);
        }

        public async Task SendAsync(string subject, string email, string body)
        {
            await SendAsync(subject, body, [email]);
        }

        private async Task SendAsync(
            string subject,
            string body,
            IEnumerable<string> sendTo,
            IList<FileAttachment>? attachments = null)
        {
            try
            {



                var emailBody = (await GetHtmlTemplateAsync("WrapperTemplate"))
                    .Replace("[Content]", body);

                var fromEmail = _configuration["Mail:From:Email"];
                var fromName = _configuration["Mail:From:Name"];
                var mailServer = _configuration["Mail:Server"];
                var testEmail = _configuration["Mail:Settings:TestEmail"];
                var postMasterEmail = _configuration["Mail:PostMaster:Email"];
                var postMasterPassword = _configuration["Mail:PostMaster:Password"];
                var replyToEmail = _configuration["Mail:ReplyTo:Email"];
                var replyToName = _configuration["Mail:ReplyTo:Name"];

                var mail = new MailMessage
                {
                    From = new MailAddress(fromEmail, fromName),
                    Subject = subject,
                    Body = emailBody,
                    IsBodyHtml = true,
                    DeliveryNotificationOptions = DeliveryNotificationOptions.OnSuccess
                };

                mail.ReplyToList.Add(new MailAddress(replyToEmail, replyToName));

                if (_configuration["Mail:Settings:Mode"] == "Test")
                {
                    mail.Headers.Add("OriginalRecipient", sendTo.First());
                    mail.To.Add(new MailAddress(testEmail));
                }
                else
                {
                    foreach (var email in sendTo)
                    {
                        mail.To.Add(new MailAddress(email));
                    }
                }

                if (attachments != null && attachments.Any())
                {
                    foreach (var attachment in attachments)
                    {
                        var bytes = await BytesFromUrlAsync(attachment.Path);
                        var stream = new MemoryStream(bytes);

                        var media = new Attachment(stream, attachment.FileName, MediaTypeNames.Application.Octet);
                        mail.Attachments.Add(media);
                    }
                }

                var smtp = new SmtpClient(mailServer, 8889);
                var credentials = new NetworkCredential(postMasterEmail, postMasterPassword);

                smtp.UseDefaultCredentials = false;
                smtp.Credentials = credentials;
                smtp.Port = 8889;    //alternative port number is 8889
                smtp.EnableSsl = false;

                // smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.Send(mail);

            }
            catch (Exception exp)
            {
                throw;
            }
        }

        public async Task<string> GetHtmlTemplateAsync(string fileName, string? subfolder = null)
        {
            var filePath = $"Templates/Emails/{(subfolder != null ? $"/{subfolder}" : "")}/{fileName}.html";

            if (!File.Exists(filePath))
            {
                var error = new ApplicationException($"HTML subscription email template: {filePath} does not exist");
                throw error;
            }

            using var reader = new StreamReader(filePath);
            return await reader.ReadToEndAsync();
        }

        private static async Task<byte[]> BytesFromUrlAsync(string url)
        {
            using var client = new HttpClient();
            using var response = await client.GetAsync(url);
            return await response.Content.ReadAsByteArrayAsync().ConfigureAwait(false);
        }
    }

    public class FileAttachment
    {
        public required string FileName { get; set; }
        public required string Path { get; set; }
        public required string Type { get; set; }
    }
}
