namespace api.Data
{
    public class ProductCategory
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int? Cat2Id { get; set; }
    }
}