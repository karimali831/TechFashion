using api.Helper;
using Newtonsoft.Json;

namespace api.Models
{
    public class CartProductDetail
    {
        public int Id { get; set; }
        public required int ProductId { get; set; }
        public int? VariantId { get; set; }
        public required string Title { get; set; }
        public required int Quantity { get; set; }
        public string? Variant { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal UnitTotal { get; set; }
        [DbIgnore]
        public string UnitPriceStr { get; set; } = string.Empty;
        [DbIgnore]
        public string UnitTotalStr { get; set; } = string.Empty;
        [DbIgnore]
        public IList<ProductVariantObj> VariantList => string.IsNullOrEmpty(Variant) ? [] :
            JsonConvert.DeserializeObject<List<ProductVariantObj>>(Variant) ?? [];
    }
}