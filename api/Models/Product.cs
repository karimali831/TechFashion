using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Sku { get; set;} = string.Empty;
        [Column(TypeName = "decimal(8,2)")]
        public decimal Price {get; set;}
    }
}