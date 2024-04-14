using CsvHelper.Configuration.Attributes;

namespace api.Models.Ebay
{
    public class ProductActiveListing
    {
        [Name("Item number")]
        public long ItemNo { get; set; }
        public required string Title { get; set; }
        [Name("Variation details")]
        public required string Variants { get; set; }
        [Name("Custom label (SKU)")]
        public required string Sku { get; set; }
        [Name("Available quantity")]
        public int Stock { get; set; }
        [Name("Start price")]
        public decimal Price { get; set; }
        [Name("eBay category 1 name")]
        public required string Category { get; set; }
        [Name("eBay category 2 number")]
        public string? SecondCategory { get; set; }
    }
}