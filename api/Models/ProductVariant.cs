using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class ProductVariant
    {
        [Key]
        public required int Id { get; set; }
        [Required]
        public required string Key { get; set; }
        [Required]
        public required string Value { get; set; }
        public string Sku { get; set; } = string.Empty;
        public int? Stock { get; set; }
        [Required]
        [Column(TypeName = "decimal(8,2)")]
        public decimal Price { get; set; }
        [Required]
        public int ProductId { get; set; }
        [ForeignKey(nameof(ProductId))]
        [Required]
        public required Product Product { get; set; }
        [Required]
        public required bool Active { get; set; } = true;
        [Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }


    }
}