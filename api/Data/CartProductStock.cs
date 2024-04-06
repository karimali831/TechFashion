namespace api.Data
{
    public class CartProductStock
    {
        public int Id { get; set; } // If IsVariant: ProductVariantId. Otherwise: ProductId.
        public int CartProductId { get; set; }
        public decimal Price { get; set; }
        public int? Stock { get; set; }
        public int? OriginalStock { get; set; }
        public int Quantity { get; set; }
    }
}