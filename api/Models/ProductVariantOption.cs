using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class ProductVariantOption
    {
        [Key]
        public required int Id { get; set; }
        [Required]
        public int ProductVariantId { get; set; }
        [ForeignKey(nameof(ProductVariantId))]
        [Required]
        public required ProductVariant ProductVariant { get; set; }
        [Required]
        public required string Name { get; set; }
        public string Sku { get; set; } = string.Empty;
        public int? Stock { get; set; }
        [Required]
        [Column(TypeName = "decimal(8,2)")]
        public decimal Price { get; set; }
        [Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}