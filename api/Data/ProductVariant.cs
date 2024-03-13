using System.ComponentModel.DataAnnotations.Schema;
using api.Models;
using Newtonsoft.Json;

namespace api.Data
{
    public class ProductVariant
    {
        public required int Id { get; set; }
        public required int ProductId { get; set; }
        public required string Variations { get; set; }
        public string Sku { get; set; } = string.Empty;
        public int? Stock { get; set; }
        public required decimal Price { get; set; }
        public DateTime CreatedDate => DateTime.UtcNow;
        public DateTime? ModifiedDate { get; set; }
        [NotMapped]
        public IList<ProductVariantObj> VariationsList =>
            JsonConvert.DeserializeObject<List<ProductVariantObj>>(Variations) ?? [];

    }
}