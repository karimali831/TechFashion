using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Product
    {
        [Key]
        public required int Id { get; set; }
        [Required]
        public string Slug { get; set; } = string.Empty;
        public string? Sku { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        [Column(TypeName = "varchar(MAX)")]
        public string Description { get; set; } = string.Empty;
        [Required]
        [Column(TypeName = "decimal(8,2)")]
        public decimal Price { get; set; }
        public int? Stock { get; set; }
        [Required]
        public required bool Active { get; set; } = true;
        [Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public ICollection<ProductVariant> Variants { get; set; } = [];
        public ICollection<ProductImage> Images { get; set; } = [];
    }
}