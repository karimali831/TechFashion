using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface IEmailVerificationRepository
    {
        Task<EmailVerification?> GetAsync(string email);
        Task<bool> CreateAsync(string email, int code);
        Task<bool> VerifyAsync(string email, int code);
    }

    public class EmailVerificationRepository(IConfiguration configuration) : DapperBaseRepository(configuration), IEmailVerificationRepository
    {
        private const string Table = "[dbo].[EmailVerification]";
        private static readonly string[] Fields = typeof(EmailVerification).DapperFields();

        public async Task<EmailVerification?> GetAsync(string email)
        {
            return await QueryFirstOrDefaultAsync<EmailVerification?>($"{DapperHelper.Select(Table, Fields)} WHERE Email = @email AND RemovedDate IS NULL AND VerifiedDate IS NULL AND CreatedDate >= DateADD(MINUTE, -10, GETDATE()) AND CreatedDate< GETDATE()",
                new { email }
            );
        }

        public async Task<bool> CreateAsync(string email, int code)
        {
            await ExecuteAsync($"UPDATE {Table} Set RemovedDate = GETDATE() WHERE Email = @email", new { email });

            return await ExecuteAsync($"INSERT INTO {Table} (Email, Code) VALUES (@email, @code)",
                new { email, code }
            );
        }

        public async Task<bool> VerifyAsync(string email, int code)
        {
            var existing = await GetAsync(email);

            if (existing is null || existing.Code != code)
                return false;

            return await ExecuteAsync($"UPDATE {Table} Set VerifiedDate = GETDATE() WHERE Id = @id",
                new { id = existing.Id }
            );
        }

    }
}