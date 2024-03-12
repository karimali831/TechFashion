using api.Helper;

namespace api.ViewModels
{
    public class ProductViewModel
    {
        public IList<ProductCatalogue> Catalogue { get; set; } = [];
        public IList<ProductDetail> Details { get; set; } = [];
    }

    public class ProductDetail
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int? Stock { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string? Variant { get; set; }
        public string? VariantValue { get; set; }
        public string? ImageSrc { get; set; }
        public bool? ImageMain { get; set; }
        [DbIgnore]
        public string PriceStr { get; set; } = string.Empty;
    }

    public class ProductCatalogue
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? ImageSrc { get; set; }
        public bool Variant { get; set; }
        [DbIgnore]
        public string PriceStr { get; set; } = string.Empty;

    }
}