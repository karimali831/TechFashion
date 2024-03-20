namespace api.Data.Stripe
{
    public class StripeCustomer
    {
        public int Id { get; set; }
        public required string CustomerId { get; set; }
        public int? UserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool Active { get; set; }
    }
}