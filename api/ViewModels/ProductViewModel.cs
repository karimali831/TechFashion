using api.Models;

namespace api.ViewModels
{
    public class ProductViewModel
    {
        public IList<ProductCatalogue> Catalogue { get; set; } = [];
        public IList<ProductDetail> Details { get; set; } = [];
    }

}