namespace api.Data
{
    public class CartProductStock
    {
        public int Id { get; set; } // If IsVariant: PV - Id otherwise: product Id.
        public decimal Price { get; set; }
        public int? Stock { get; set; }
        public int Quantity { get; set; }
    }
}