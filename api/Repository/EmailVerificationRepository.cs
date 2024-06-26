using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface IEmailVerificationRepository
    {
        Task<DateTime?> IsVerifiedAsync(int userId, Guid? firebaseUid);
        Task<EmailVerification?> GetUnverifiedAsync(string email);
        Task<bool> CreateAsync(string email, int code);
        Task<bool> VerifyAsync(string email, int code);
    }

    public class EmailVerificationRepository(DapperContext context) : DapperBaseRepository(context), IEmailVerificationRepository
    {
        private const string Table = "[dbo].[EmailVerification]";
        private static readonly string[] Fields = typeof(EmailVerification).DapperFields();


        public async Task<EmailVerification?> GetUnverifiedAsync(string email)
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
            var existing = await GetUnverifiedAsync(email);

            if (existing is null || existing.Code != code)
                return false;

            return await ExecuteAsync($"UPDATE {Table} Set VerifiedDate = GETDATE() WHERE Id = @id",
                new { id = existing.Id }
            );
        }

        public async Task<DateTime?> IsVerifiedAsync(int userId, Guid? guestCheckoutId)
        {
            string? sqlTxt;
            if (guestCheckoutId.HasValue)
            {
                sqlTxt = @$"
                    SELECT ev.VerifiedDate
                    FROM Users AS u
                    JOIN EmailVerification AS ev
                    ON ev.Email = u.Email
                    JOIN Carts AS c
                    ON c.GuestCheckoutId = @guestCheckoutId
                    WHERE u.Id =  @userId
                    --AND ev.VerifiedDate >= DateADD(MINUTE, -10, GETDATE()) AND ev.VerifiedDate < GETDATE()
                    AND u.RemovedDate IS NULL
                    AND ev.VerifiedDate IS NOT NULL
                    AND c.ArchiveDate IS NOT NULL
                ";
            }
            else
            {
                sqlTxt = @$"
                    SELECT ev.VerifiedDate
                    FROM Users AS u
                    JOIN EmailVerification AS ev
                    ON ev.Email = u.Email
                    WHERE u.Id = @userId
                    AND u.RemovedDate IS NULL
                    AND ev.VerifiedDate IS NOT NULL
                ";
            }

            return await QueryFirstOrDefaultAsync<DateTime?>(sqlTxt, new { userId, guestCheckoutId });
        }
    }
}