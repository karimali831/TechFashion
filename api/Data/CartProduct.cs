using System.ComponentModel.DataAnnotations.Schema;
using api.Models;
using Newtonsoft.Json;

namespace api.Data
{
    public class CartProduct
    {
        public int Id { get; set; }
        public required int CartId { get; set; }
        public required int ProductId { get; set; }
        public required int Quantity { get; set; }
        public string? Variant { get; set; }
        [NotMapped]
        public IList<ProductVariantObj> VariantList =>
            !string.IsNullOrEmpty(Variant) ? JsonConvert.DeserializeObject<List<ProductVariantObj>>(Variant) ?? [] : [];
        public DateTime CreatedDate => DateTime.UtcNow;
        public DateTime? ModifiedDate { get; set; }
        public DateTime? RemovedDate { get; set; }
    }
}