using api.Helper;

namespace api.Models
{
    public class ProductCatalogue
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string Slug { get; set; } = string.Empty;
        public string? ImageSrc { get; set; }
        public required decimal Price { get; set; }
        public required bool Variant { get; set; }
        [DbIgnore]
        public string PriceStr { get; set; } = string.Empty;

    }
}