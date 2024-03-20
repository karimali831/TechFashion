using api.Helper;

namespace api.ViewModels
{
    public class PromotionViewModel
    {
        public required string CouponName { get; set; }
        public required string Code { get; set; }
        public DateTime ExpiryDate { get; set; }
        [DbIgnore]
        public required string ExpiryDateStr { get; set; }
    }
}