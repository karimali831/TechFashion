using api.Data;
using api.Helper;
using api.Models;
using api.Models.Ebay;
using api.Repository;
using Newtonsoft.Json;

namespace api.Service
{
    public interface IProductImportService
    {
        Task DoAsync(IFormFile file);
    }

    public class ProductImportService(
        ICsvImportService csvImportService,
        IProductRepository productRepository,
        IProductVariantRepository productVariantRepository) : IProductImportService
    {
        private readonly ICsvImportService _csvImportService = csvImportService;
        private readonly IProductRepository _productRepository = productRepository;
        private readonly IProductVariantRepository _productVariantRepository = productVariantRepository;

        public async Task DoAsync(IFormFile file)
        {
            var listing = _csvImportService.Read<ProductActiveListing>(file);

            var products = new List<Product>();
            var productVariants = new List<ProductVariant>();

            foreach (var product in listing)
            {
                var productId =
                    await _productRepository.AddAsync(new Product
                    {
                        EbayItemNo = product.ItemNo,
                        Slug = product.Title.GenerateSlug(),
                        Sku = product.Sku,
                        Title = product.Title,
                        Price = product.Price,
                        Stock = product.Stock,
                        Active = false
                    });

                if (product.Variants != "")
                {
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

                    productVariants.Add(new ProductVariant
                    {
                        ProductId = productId,
                        Variant = JsonConvert.SerializeObject(list),
                        Variant2 = "",
                        Sku = product.Sku,
                        Stock = product.Stock,
                        Price = product.Price
                    });
                }
            }
        }
    }
}