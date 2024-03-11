using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Cart
    {
        [Key]
        public required int Id { get; set; }
        [Required]
        public required int Quantity { get; set; }
        public int? ProductId { get; set; }
        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }
        public int? ProductVariantId { get; set; }
        [ForeignKey(nameof(ProductVariantId))]
        public ProductVariant? ProductVariant { get; set; }
        [Required]
        [Column(TypeName = "decimal(8,2)")]
        public required decimal Total { get; set; }
        [Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}