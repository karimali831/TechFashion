namespace api.Data.Stripe
{
    public class StripePaymentIntent
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public required string Status { get; set; }
        public required string CardBrand { get; set; }
        public required string CardLast4 { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}