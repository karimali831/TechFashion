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
        public int? ProductVariantOptionId { get; set; }
        [ForeignKey(nameof(ProductVariantOptionId))]
        public ProductVariantOption? ProductVariantOption { get; set; }
        [Required]
        public required bool Main { get; set; }
        [Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}