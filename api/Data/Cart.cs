namespace api.Data
{
    public class Cart
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public Guid? GuestCheckoutId { get; set; }
    }
}