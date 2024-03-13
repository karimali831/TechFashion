using api.Helper;

namespace api.Models
{
    public class ProductCatalogue
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? ImageSrc { get; set; }
        public bool Variant { get; set; }
        [DbIgnore]
        public string PriceStr { get; set; } = string.Empty;

    }
}