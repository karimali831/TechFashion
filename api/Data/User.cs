namespace api.Data
{
    public class User
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public required string Email { get; set; }
        public string? FirebaseUid { get; set; }
        public Guid? GuestCheckoutId { get; set; }
        public string? StripeCustomerId { get; set; }
        public DateTime? StripeCustomerDeleted { get; set; }
    }
}