using api.Helper;
using Newtonsoft.Json;

namespace api.Models
{
    public class CartProductDetail
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int? ProductVariantId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ImageSrc { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string? Variations { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal UnitTotal { get; set; }
        [DbIgnore]
        public string UnitPriceStr { get; set; } = string.Empty;
        [DbIgnore]
        public string UnitTotalStr { get; set; } = string.Empty;
        [DbIgnore]
        public IList<ProductVariantObj> VariationsList => string.IsNullOrEmpty(Variations) ? [] :
            JsonConvert.DeserializeObject<List<ProductVariantObj>>(Variations) ?? [];
    }
}