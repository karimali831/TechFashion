namespace api.Data
{
    public class CustomerAddress
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public required string Name { get; set; }
        public required string Line1 { get; set; }
        public string? Line2 { get; set; }
        public string? City { get; set; }
        public required string PostalCode { get; set; }
        public required string Country { get; set; }
        public bool Main { get; set; }
    }
}