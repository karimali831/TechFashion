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
        IProductCategoryRepository productCategoryRepository,
        IProductVariantRepository productVariantRepository) : IProductImportService
    {
        private readonly ICsvImportService _csvImportService = csvImportService;
        private readonly IProductRepository _productRepository = productRepository;
        private readonly IProductCategoryRepository _productCategoryRepository = productCategoryRepository;
        private readonly IProductVariantRepository _productVariantRepository = productVariantRepository;

        public async Task DoAsync(IFormFile file)
        {
            var listing = _csvImportService.Read<ProductActiveListing>(file);
            var products = new List<Product>();
            var productVariants = new List<ProductVariant>();

            var productsTopLevel = listing.GroupBy(x => x.ItemNo);
            var ids = new List<(int ProductId, long ItemNo)>();

            // Add products
            int idx = 1;
            foreach (var ptl in productsTopLevel)
            {
                var itemNo = ptl.Key;
                var firstProduct = ptl.First();

                if (await _productRepository.SkuExists(firstProduct.Sku))
                    continue;

                var slug = firstProduct.Title.GenerateSlug();

                if (await _productRepository.SlugExists(slug))
                {
                    slug += "-" + idx; ;
                }

                var getOrAddCategory = await _productCategoryRepository
                    .GetOrCreateAsync(firstProduct);

                var dbProdId = await _productRepository.InsertOrUpdateEbayItemAsync(
                    new Product
                    {
                        CatId = getOrAddCategory,

                        EbayItemNo = itemNo,
                        Slug = slug,
                        Sku = firstProduct.Sku == "None" ? null : firstProduct.Sku,
                        Title = firstProduct.Title,
                        Price = firstProduct.Price,
                        Stock = firstProduct.Stock,
                        OriginalStock = firstProduct.Stock,
                        Active = true
                    });

                ids.Add((dbProdId, itemNo));
                idx++;
            }

            // Add product variants
            var filteredVariants = listing.Where(x => x.Variants != "" && string.IsNullOrEmpty(x.CurrentPrice));

            foreach (var product in filteredVariants)
            {
                if (await _productVariantRepository.SkuExists(product.Sku))
                    continue;

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
                        Sku = product.Sku == "None" ? null : product.Sku,
                        Stock = product.Stock,
                        OriginalStock = product.Stock,
                        Price = product.Price
                    });
            }

        }
    }
}