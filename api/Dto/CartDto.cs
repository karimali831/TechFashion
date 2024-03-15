using api.Models;

namespace api.Dto
{
    public class AddProductToCartDto
    {
        public int CartId { get; set; }
        public int Quantity { get; set; }
        public int ProductId { get; set; }
        public IList<ProductVariantObj>? Variant { get; set; }
    }
}