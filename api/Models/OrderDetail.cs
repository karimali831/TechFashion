using api.Enum;
using api.Helper;

namespace api.Models
{
    public class OrderDetail
    {
        public int Id { get; set; }
        public int Ref { get; set; }
        public DateTime Date { get; set; }
        public string? PaymentStatus { get; set; }
        public OrderStatus Status { get; set; }
        public string? Name { get; set; }
        public string? Line1 { get; set; }
        public string? Line2 { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
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