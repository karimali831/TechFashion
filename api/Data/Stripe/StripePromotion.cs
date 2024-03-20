namespace api.Data.Stripe
{
    public class StripePromotion
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CouponId { get; set; }
        public required string Code { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
}