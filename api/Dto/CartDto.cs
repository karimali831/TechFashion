using api.Models;

namespace api.Dto
{
    public class AddProductToCartDto
    {
        public int CartId { get; set; }
        public int Quantity { get; set; }
        public int ProductId { get; set; }
        public int? VariantId { get; set; }
    }
}