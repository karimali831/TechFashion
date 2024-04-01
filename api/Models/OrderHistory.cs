using api.Enum;
using api.Helper;

namespace api.Models
{
    public class OrderHistory
    {
        public int Id { get; set; }
        public int Ref { get; set; }
        public DateTime Date { get; set; }
        public required string PaymentStatus { get; set; }
        public OrderStatus Status { get; set; }
        public required string Name { get; set; }
        public required string Line1 { get; set; }
        public required string Line2 { get; set; }
        public required string City { get; set; }
        public required string PostalCode { get; set; }
        public required string Country { get; set; }
        public long Total { get; set; }
        [DbIgnore]
        public string IdStr => $"#100{Id}";
        [DbIgnore]
        public string DateStr => Date.ToString("MMMM dd, yyyy");
        [DbIgnore]
        public string DateTimeStr => Date.ToString("MMMM dd, yyyy HH:mm");
        [DbIgnore]
        public string TotalStr => Total.ToCurrencyGbp();

    }
}