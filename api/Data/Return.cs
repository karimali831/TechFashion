using api.Enum;

namespace api.Data
{
    public class Return
    {
        public int Id { get; set; }
        public int CartProductId { get; set; }
        public ReturnStatus Status { get; set; }
    }
}