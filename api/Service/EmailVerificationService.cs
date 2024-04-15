using api.Data;
using api.Dto;
using api.Helper;
using api.Repository;
using CloudChef.Library.Services;

namespace api.Service
{
    public interface IEmailVerificationService
    {
        Task<DateTime?> IsVerifiedAsync(int userId);
        Task<EmailVerification?> GetUnverifiedAsync(string email, Guid? guestCheckoutId = null);
        Task<bool> VerifyAsync(string email, int code);
        Task<ApiResponse<bool>> SendAsync(VerificationEmailRequestDto request);
    }

    public class EmailVerificationService(
        IMailService mailService,
        IEmailVerificationRepository emailVerificationRepository) : IEmailVerificationService
    {
        private readonly IMailService _mailService = mailService;
        private readonly IEmailVerificationRepository _emailVerificationRepository = emailVerificationRepository;

        public async Task<EmailVerification?> GetUnverifiedAsync(string email, Guid? guestCheckoutId = null)
        {
            return await _emailVerificationRepository.GetUnverifiedAsync(email, guestCheckoutId);
        }


        public async Task<DateTime?> IsVerifiedAsync(int userId)
        {
            return await _emailVerificationRepository.IsVerifiedAsync(userId);
        }

        public async Task<bool> VerifyAsync(string email, int code)
        {
            return await _emailVerificationRepository.VerifyAsync(email, code);
        }

        public async Task<ApiResponse<bool>> SendAsync(VerificationEmailRequestDto request)
        {
            try
            {
                var guestCheckoutId = request.FirebaseUid is null ? request.GuestCheckoutId : null;
                var existing = GetUnverifiedAsync(request.Email, guestCheckoutId);

                if (existing is not null)
                {
                    return new ApiResponse<bool>
                    {
                        Data = true
                    };
                }

                var otp = (NumberHelper.NextInt() % 1000000).ToString("000000");
                var create = await _emailVerificationRepository.CreateAsync(request.Email, int.Parse(otp), guestCheckoutId);

                if (!create)
                    throw new ApplicationException("An error occurred");

                string mailBody = @$"
                <hr /><br /> 
                Sign in to Tech Fashion as {request.Email} <br /><br />
                Enter this code to sign in: <br /> <br />
                <h1>{otp}</h1><br /> 
                This code will expire in 10 minutes and can only be used once.
            ";

                await _mailService.SendAsync("Sign in to Tech Fashion", request.Email, mailBody);

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