namespace api.Data
{
    public class Cart
    {
        public required int Id { get; set; }
        public required decimal Total { get; set; }
        public DateTime CreatedDate => DateTime.UtcNow;
        public DateTime? ModifiedDate { get; set; }
    }
}