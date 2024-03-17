namespace api.Data
{
    public class Variant
    {
        public int Id { get; set; }
        public required string Attribute { get; set; }
        public required string Value { get; set; }
    }
}