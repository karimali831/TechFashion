namespace api.Data
{
    public class ProductImage
    {
        public required int Id { get; set; }
        public required string Url { get; set; }
        public int? ProductId { get; set; }
        public int? ProductVariantId { get; set; }
        public required bool Main { get; set; }
        public DateTime CreatedDate => DateTime.UtcNow;
        public DateTime? ModifiedDate { get; set; }
    }
}