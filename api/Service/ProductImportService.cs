using api.Data;
using api.Models;
using api.Models.Ebay;
using api.Repository;

namespace api.Service
{
    public interface IProductImportService
    {
        void DoAsync(IFormFile file);
    }

    public class ProductImportService(
        ICsvImportService csvImportService,
        IProductRepository productRepository,
        IProductVariantRepository productVariantRepository) : IProductImportService
    {
        private readonly ICsvImportService _csvImportService = csvImportService;
        private readonly IProductRepository _productRepository = productRepository;
        private readonly IProductVariantRepository _productVariantRepository = productVariantRepository;

        public void DoAsync(IFormFile file)
        {
            var listing = _csvImportService.Read<ProductActiveListing>(file);

            var products= new List<Product>();
            var productVariants = new List<ProductVariant>();

            int idx = 1;
            foreach (var product in listing)
            {
                if (product.Variants == "")
                {
                    products.Add(new Product
                    {
                        
                    });
                }

                var list = new List<ProductVariantObj>();

                var variants = product.Variants.Split("|");

                foreach (var variant in variants)
                {
                    var key = variant.Split("=")[0];

                    if (key == "")
                        continue;

                    var options = variant.Split("=")[1];

                    var values = options.Split(";");

                    foreach (var value in values)
                    {
                        list.Add(new ProductVariantObj
                        {
                            Attribute = key,
                            Value = value
                        });
                    }
                }


                tt.Add(idx, list);
                idx++;
            }

            var ok = tt;
        }
    }
}