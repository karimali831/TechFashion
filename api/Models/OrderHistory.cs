using api.Enum;
using api.Helper;

namespace api.Models
{
    public class OrderHistory
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public required string PaymentStatus { get; set; }
        public OrderStatus Status { get; set; }
        public long Total { get; set; }
        [DbIgnore]
        public string IdStr => $"#{Id}";
        [DbIgnore]
        public string DateStr => Date.ToString("MMMM dd, yyyy");
        [DbIgnore]
        public string DateTimeStr => Date.ToString("MMMM dd, yyyy HH:mm");
        [DbIgnore]
        public string TotalStr => Total.ToCurrencyGbp();

    }
}