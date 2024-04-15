namespace api.Data
{
    public class EmailVerification
    {
        public int Id { get; set; }
        public required string Email { get; set; }
        public int Code { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? VerifiedDate { get; set; }
    }
}