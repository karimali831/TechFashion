using api.Models;

namespace api.ViewModels
{
    public class CartViewModel
    {
        public IList<CartProductDetail> Products { get; set; } = [];
        public decimal Total { get; set; }
        public string TotalStr { get; set; } = string.Empty;
    }
}