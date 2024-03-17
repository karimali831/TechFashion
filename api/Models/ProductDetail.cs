using api.Helper;
using Newtonsoft.Json;

namespace api.Models
{
    public class ProductDetail
    {
        public int Id { get; set; }
        public int? VariantId { get; set; }
        public required string Title { get; set; }
        public string Description { get; set; } = string.Empty;
        public required string Slug { get; set; }
        public required decimal Price { get; set; }
        public int? Stock { get; set; }
        public string Sku { get; set; } = string.Empty;
        public bool Active { get; set; }
        public string? Variant { get; set; }
        public string? Variant2 { get; set; }
        public string? ImageSrc { get; set; }
        [DbIgnore]
        public string PriceStr { get; set; } = string.Empty;
        [DbIgnore]
        public IList<ProductVariantObj> VariantList => string.IsNullOrEmpty(Variant) ? [] :
            JsonConvert.DeserializeObject<List<ProductVariantObj>>(Variant) ?? [];
    }
}