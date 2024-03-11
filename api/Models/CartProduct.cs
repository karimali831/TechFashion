using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class CartProduct
    {
        [Key]
        public required int Id { get; set; }
        [Required]
        [ForeignKey(nameof(CartId))]
        public required int CartId { get; set; }
        public required Cart Cart { get; set; }
        [Required]
        public required int Quantity { get; set; }
        public int? ProductId { get; set; }
        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }
        public int? ProductVariantOptionId { get; set; }
        [ForeignKey(nameof(ProductVariantOptionId))]
        public ProductVariantOption? ProductVariantOption { get; set; }
        [Required]
        [Column(TypeName = "decimal(8,2)")]
        public required decimal Total { get; set; }
        [Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}