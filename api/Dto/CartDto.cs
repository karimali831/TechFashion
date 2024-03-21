namespace api.Dto
{
    public class AddProductToCartDto
    {
        public required CartUserDto CartUser { get; set; }
        public int Quantity { get; set; }
        public int ProductId { get; set; }
        public int? VariantId { get; set; }
    }

    public class CartUserDto
    {
        public string? FirebaseUid { get; set; }
        public Guid? GuestCheckoutId { get; set; }
    }
}