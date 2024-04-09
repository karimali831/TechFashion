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

            var productsTopLevel = listing.GroupBy(x => x.ItemNo);
            var ids = new List<(int ProductId, long ItemNo)>();

            // Add products
            foreach (var ptl in productsTopLevel)
            {
                var itemNo = ptl.Key;
                var firstProduct = ptl.First();

                var dbProdId = await _productRepository.InsertOrUpdateEbayItemAsync(
                    new Product
                    {
                        EbayItemNo = itemNo,
                        Slug = firstProduct.Title.GenerateSlug(),
                        Sku = firstProduct.Sku,
                        Title = firstProduct.Title,
                        Price = firstProduct.Price,
                        Stock = firstProduct.Stock,
                        OriginalStock = firstProduct.Stock,
                        Active = false
                    });

                ids.Add((dbProdId, itemNo));
            }

            // Add product variants
            foreach (var product in listing.Where(x => x.Variants != ""))
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

                var productId = ids.First(x => x.ItemNo == product.ItemNo).ProductId;

                await _productVariantRepository.InsertOrUpdateAsync(
                    new ProductVariant
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