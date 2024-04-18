using api.Data;
using api.Dto;
using api.Helper;
using api.Repository;
using CloudChef.Library.Services;

namespace api.Service
{
    public interface IEmailVerificationService
    {
        Task<DateTime?> IsVerifiedAsync(int userId, Guid? guestCheckoutId);
        Task<EmailVerification?> GetUnverifiedAsync(string email);
        Task<bool> VerifyAsync(string email, int code);
        Task<ApiResponse<bool>> SendAsync(string email);
    }

    public class EmailVerificationService(
        IMailService mailService,
        IEmailVerificationRepository emailVerificationRepository) : IEmailVerificationService
    {
        private readonly IMailService _mailService = mailService;
        private readonly IEmailVerificationRepository _emailVerificationRepository = emailVerificationRepository;

        public async Task<EmailVerification?> GetUnverifiedAsync(string email)
        {
            return await _emailVerificationRepository.GetUnverifiedAsync(email);
        }

        public async Task<DateTime?> IsVerifiedAsync(int userId, Guid? guestCheckoutId)
        {
            return await _emailVerificationRepository.IsVerifiedAsync(userId, guestCheckoutId);
        }

        public async Task<bool> VerifyAsync(string email, int code)
        {
            return await _emailVerificationRepository.VerifyAsync(email, code);
        }

        public async Task<ApiResponse<bool>> SendAsync(string email)
        {
            try
            {
                var existing = await GetUnverifiedAsync(email);

                if (existing is not null)
                {
                    return new ApiResponse<bool>
                    {
                        Data = true
                    };
                }

                var otp = (NumberHelper.NextInt() % 1000000).ToString("000000");
                var create = await _emailVerificationRepository.CreateAsync(email, int.Parse(otp));

                if (!create)
                    throw new ApplicationException("An error occurred");

                string mailBody = @$"
                <hr /><br /> 
                Sign in to Elegance Craft as {email} <br /><br />
                Enter this code to sign in: <br /> <br />
                <h1>{otp}</h1><br /> 
                This code will expire in 10 minutes and can only be used once.
            ";

                await _mailService.SendAsync("Sign in to Elegance Craft", email, mailBody);

                return new ApiResponse<bool>
                {
                    Data = true
                };
            }
            catch (Exception exp)
            {
                return new ApiResponse<bool>
                {
                    ErrorMsg = exp.Message
                };
            }
        }
    }
}