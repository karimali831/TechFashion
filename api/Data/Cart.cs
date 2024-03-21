namespace api.Data
{
    public class Cart
    {
        public required int Id { get; set; }
        public required int UserId { get; set; }
        public DateTime CreatedDate => DateTime.UtcNow;
        public DateTime? ArchiveDate { get; set; }
    }
}