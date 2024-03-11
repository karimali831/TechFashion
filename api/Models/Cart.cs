using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Cart
    {
        [Key]
        public required int Id { get; set; }
        [Required]
        [Column(TypeName = "decimal(8,2)")]
        public required decimal Total { get; set; }
        [Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}