using api.Enum;

namespace api.Data
{
    public class Order
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public int PaymentId { get; set; }
        public int ShippingAddressId { get; set; }
        public OrderStatus Status { get; set; }
    }
}