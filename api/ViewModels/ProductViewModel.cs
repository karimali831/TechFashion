namespace api.ViewModels
{
    public class ProductViewModel
    {
        public int Id {get; set;}
        public string Sku {get; set;} = string.Empty;
        public decimal Price { get; set; }
    }
}