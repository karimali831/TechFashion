namespace api.Dto
{
    public class CreateProductRequestDto
    {
        public string Sku {get; set;} = string.Empty;
        public decimal Price {get; set;}
    }

    public class UpdateProductRequestDto 
    {
         public string Sku {get; set;} = string.Empty;
        public decimal Price {get; set;}
    }
}