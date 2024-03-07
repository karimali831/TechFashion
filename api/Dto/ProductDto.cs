namespace api.Dto
{
    public class CreateProductRequestDto
    {
        public string Sku { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }

    public class UpdateProductRequestDto
    {
        public int Id { get; set; }
        public string Sku { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}