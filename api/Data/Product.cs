namespace api.Data
{
    public class Product
    {
        public required int Id { get; set; }
        public required string Slug { get; set; } = string.Empty;
        public string? Sku { get; set; }
        public required string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public required decimal Price { get; set; }
        public int? Stock { get; set; }
        public required bool Active { get; set; } = true;
        public DateTime CreatedDate => DateTime.UtcNow;
        public DateTime? ModifiedDate { get; set; }
    }
}