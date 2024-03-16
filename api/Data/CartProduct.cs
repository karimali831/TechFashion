namespace api.Data
{
    public class CartProduct
    {
        public int Id { get; set; }
        public required int CartId { get; set; }
        public int? ProductId { get; set; }
        public int? VariantId { get; set; }
        public required int Quantity { get; set; }
        public DateTime CreatedDate => DateTime.UtcNow;
        public DateTime? ModifiedDate { get; set; }
        public DateTime? RemovedDate { get; set; }
    }
}