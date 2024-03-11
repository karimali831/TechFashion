using api.Models;

namespace api.ViewModels
{
    public class ProductViewModel
    {
        public int Id { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string PriceStr { get; set; } = string.Empty;
        public int? Stock { get; set; }
        public IList<ProductVariant> Variants { get; set; } = [];

    }
}