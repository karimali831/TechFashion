namespace api.Data.Stripe
{
    public class StripeCoupon
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int? PercentOff { get; set; }
        public double? FixedAmountOff { get; set; }
    }
}