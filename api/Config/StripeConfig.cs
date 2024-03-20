namespace api.Config
{
    public class StripeConfig
    {
        public required string PublishableKey { get; set; }
        public required string SecretKey { get; set; }
        public required string WebhookSecret { get; set; }
        public required string Vat20TaxRateId { get; set; }
    }
}