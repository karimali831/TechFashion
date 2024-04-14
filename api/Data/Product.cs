namespace api.Data
{
    public class Product
    {
        public int Id { get; set; }
        public int CatId { get; set; }
        public required string Slug { get; set; } = string.Empty;
        public string? Sku { get; set; }
        public long? EbayItemNo { get; set; }
        public required string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public int? Stock { get; set; }
        public int? OriginalStock { get; set; }
        public required bool Active { get; set; } = true;
        public DateTime CreatedDate => DateTime.UtcNow;
        public DateTime? ModifiedDate { get; set; }
    }
}