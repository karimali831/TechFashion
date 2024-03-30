using api.Helper;

namespace api.Data
{
    public class User
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public required string Email { get; set; }
        public string? FirebaseUid { get; set; }
        public string? StripeCustomerId { get; set; }
        public DateTime? StripeCustomerDeleted { get; set; }
        public DateTime? RemovedDate { get; set; }
        [DbIgnore]
        public CustomerAddress? MainAddress { get; set; }
        [DbIgnore]
        public bool EmailVerified { get; set; }
    }
}