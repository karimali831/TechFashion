namespace api.Dto.Stripe
{
    public class PaymentIntentResponse
    {
        public string? ClientSecret { get; set; }
        public string? ErrorMsg { get; set; }
        public string? Coupon { get; set; }
        public string? DiscountedAmount { get; set; }
        public string? Amount { get; set; }
    }

    public class PaymentIntentRequest
    {
        public int CartId { get; set; }
        public string? FirebaseUid { get; set; }
        public GuestCheckoutDto? GuestUser { get; set; }
        public string? PromoCode { get; set; }
    }
}