using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface IEmailVerificationRepository
    {
        Task<DateTime?> IsVerifiedAsync(int userId);
        Task<EmailVerification?> GetUnverifiedAsync(string email, Guid? guestCheckoutId = null);
        Task<bool> CreateAsync(string email, int code, Guid? guestCheckoutId = null);
        Task<bool> VerifyAsync(string email, int code);
    }

    public class EmailVerificationRepository(DapperContext context) : DapperBaseRepository(context), IEmailVerificationRepository
    {
        private const string Table = "[dbo].[EmailVerification]";
        private static readonly string[] Fields = typeof(EmailVerification).DapperFields();

        public async Task<EmailVerification?> GetUnverifiedAsync(string email, Guid? guestCheckoutId = null)
        {
            var sqlTxt = @$"
                {DapperHelper.Select(Table, Fields)} 
                WHERE Email = @email 
                AND GuestCheckoutId = @guestCheckoutId
                AND RemovedDate IS NULL 
                AND VerifiedDate IS NULL 
                AND CreatedDate >= DateADD(MINUTE, -10, GETDATE()) AND CreatedDate< GETDATE()";

            return await QueryFirstOrDefaultAsync<EmailVerification?>(sqlTxt,
                new { email, guestCheckoutId }
            );
        }

        public async Task<bool> CreateAsync(string email, int code, Guid? guestCheckoutId = null)
        {
            var sqlTxt = @$"
                UPDATE {Table} 
                Set RemovedDate = GETDATE() 
                WHERE Email = @email 
                AND GuestCheckoutId = @guestCheckoutId";

            await ExecuteAsync(sqlTxt, new { email, guestCheckoutId });

            return await ExecuteAsync($"INSERT INTO {Table} (Email, Code, GuestCheckoutId) VALUES (@email, @code, @guestCheckoutId)",
                new { email, code, guestCheckoutId }
            );
        }

        public async Task<bool> VerifyAsync(string email, int code)
        {
            var existing = await GetUnverifiedAsync(email);

            if (existing is null || existing.Code != code)
                return false;

            return await ExecuteAsync($"UPDATE {Table} Set VerifiedDate = GETDATE() WHERE Id = @id",
                new { id = existing.Id }
            );
        }

        public async Task<DateTime?> IsVerifiedAsync(int userId)
        {
            var sqlTxt = @$"
                SELECT ev.VerifiedDate
                FROM Users AS u
                JOIN EmailVerification AS ev
                ON ev.Email = u.Email
                WHERE u.Id = @userId
                AND u.RemovedDate IS NULL
                AND ev.RemovedDate IS NULl
                AND ev.VerifiedDate IS NOT NULL
            ";

            return await QueryFirstOrDefaultAsync<DateTime?>(sqlTxt, new { userId });
        }
    }
}