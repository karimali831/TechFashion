namespace api.Data
{
    public class ProductImage
    {
        public required int Id { get; set; }
        public required int ProductId { get; set; }
        public required string ImageSrc { get; set; }
        public string? VariantKey { get; set; }
        public string? VariantValue { get; set; }
        public required bool Main { get; set; }
        public DateTime CreatedDate => DateTime.UtcNow;
        public DateTime? ModifiedDate { get; set; }
    }
}