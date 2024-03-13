namespace api.Data
{
    public class CartProduct
    {
        public required int Id { get; set; }
        public required int CartId { get; set; }
        public required int Quantity { get; set; }
        public int? ProductId { get; set; }
        public int? ProductVariantId { get; set; }
        public DateTime CreatedDate => DateTime.UtcNow;
        public DateTime? ModifiedDate { get; set; }
        public DateTime? RemovedDate { get; set; }
    }
}