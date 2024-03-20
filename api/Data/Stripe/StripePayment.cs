namespace api.Data.Stripe
{
    public class StripePayment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public required string PaymentIntentId { get; set; }
        public decimal Amount { get; set; }
        public required string Status { get; set; }
        public required string CardBrand { get; set; }
        public required string CardLast4 { get; set; }
    }
}