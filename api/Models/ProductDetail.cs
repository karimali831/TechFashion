using api.Helper;
using Newtonsoft.Json;

namespace api.Models
{
    public class ProductDetail
    {
        public int Id { get; set; }
        public int? ProductVariantId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int? Stock { get; set; }
        public string Sku { get; set; } = string.Empty;
        public bool Active { get; set; }
        public string? Variations { get; set; }
        public string? ImageSrc { get; set; }
        public bool? ImageMain { get; set; }
        [DbIgnore]
        public string PriceStr { get; set; } = string.Empty;
        [DbIgnore]
        public IList<ProductVariantObj> VariationsList => string.IsNullOrEmpty(Variations) ? [] :
            JsonConvert.DeserializeObject<List<ProductVariantObj>>(Variations) ?? [];
    }
}