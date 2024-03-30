namespace api.Dto
{
    public class VerifyEmailDto
    {
        public required string Email { get; set; }
        public required int Code { get; set; }
    }

    public class VerificationEmailDto
    {
        public bool Sent { get; set; }
        public bool Verified { get; set; }
    }


    public class VerificationEmailRequestDto
    {
        public required string Email { get; set; }
        public bool Send { get; set; }
    }
}