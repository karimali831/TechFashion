using api.Models;

namespace api.ViewModels
{
    public class ProductViewModel
    {
        public IList<ProductCatalogue> Catalogue { get; set; } = [];
        public IList<ProductDetail> Details { get; set; } = [];
        public IList<ProductAttribute> Variants { get; set; } = [];
    }

    public class ProductAttribute
    {
        public int ProductId { get; set; }
        public string Attribute { get; set; } = string.Empty;
        public IEnumerable<string> Options { get; set; } = [];
    }
}