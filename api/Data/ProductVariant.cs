using System.ComponentModel.DataAnnotations.Schema;
using api.Helper;
using api.Models;
using Newtonsoft.Json;

namespace api.Data
{
    public class ProductVariant
    {
        public int Id { get; set; }
        public required int ProductId { get; set; }
        public required string Variant { get; set; }
        public required string Variant2 { get; set; }
        public string? Sku { get; set; }
        public int? Stock { get; set; }
        public int? OriginalStock { get; set; }
        public required decimal Price { get; set; }
        public DateTime CreatedDate => DateTime.UtcNow;
        public DateTime? ModifiedDate { get; set; }
        [DbIgnore]
        [NotMapped]
        public IList<ProductVariantObj> VariantList =>
            JsonConvert.DeserializeObject<List<ProductVariantObj>>(Variant) ?? [];

    }
}