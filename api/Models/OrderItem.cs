using api.Helper;

namespace api.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public required string Product { get; set; }
        public required string ProductSlug { get; set; }
        public string? Sku { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Total { get; set; }
        [DbIgnore]
        public string PriceStr => Price.ToCurrencyGbp();
        [DbIgnore]
        public string TotalStr => Total.ToCurrencyGbp();
    }
}