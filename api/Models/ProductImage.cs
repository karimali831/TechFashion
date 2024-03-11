using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class ProductImage
    {
        [Key]
        public required int Id { get; set; }
        [Required]
        public required string Url { get; set; }
        public int? ProductId { get; set; }
        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }
        public int? ProductVariantId { get; set; }
        [ForeignKey(nameof(ProductVariantId))]
        public ProductVariant? ProductVariant { get; set; }
        [Required]
        public required bool Main { get; set; }
        [Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}