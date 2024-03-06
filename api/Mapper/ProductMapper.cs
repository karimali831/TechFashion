
using api.Dto;
using api.Models;
using api.ViewModels;

namespace api.Mapper
{
    public static class ProductMapper
    {
        public static ProductViewModel ToViewModel(this Product model) 
        {
            return new ProductViewModel 
            {
                Id = model.Id,
                Sku = model.Sku,
                Price = model.Price
            };
        }

        public static Product ToEntity(this CreateProductRequestDto viewModel)
        {
            return new Product
            {
                Sku = viewModel.Sku,
                Price = viewModel.Price
            };
        }
    }
}