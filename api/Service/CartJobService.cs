using api.Repository;

namespace api.Service
{
    public interface ICartJobService
    {
        Task RemoveInactiveCartsAsync();
    }

    public class CartJobService(
        ICartRepository cartRepository,
        ICartProductService cartProductService,
        ICartProductRepository cartProductRepository) : ICartJobService
    {
        private readonly ICartRepository _cartRepository = cartRepository;
        private readonly ICartProductService _cartProductService = cartProductService;
        private readonly ICartProductRepository _cartProductRepository = cartProductRepository;


        public async Task RemoveInactiveCartsAsync()
        {
            // Stock check
            var stockCheck = await _cartProductRepository.ProductsStockCheckAsync();

            foreach (var sc in stockCheck.GroupBy(x => x.Id))
            {
                var id = sc.Key;
                var originalStock = sc.First().OriginalStock;
                var remainingStock = sc.First().Stock;
                var quantity = sc.Sum(x => x.Quantity);

                var stock = remainingStock + quantity;

                if (remainingStock >= originalStock)
                    continue;

                if (stock > originalStock)
                    stock = originalStock;

                if (stock < 0)
                    stock = 0;

                // Update stock
                await _cartProductService.UpdateStockAsync(id, stock, sc.First().IsVariant);

                foreach (var product in sc)
                {
                    // Remove products from cart if inactive after 20 mins
                    await _cartProductRepository.RemoveInactiveAsync(product.CartProductId);
                }
            }

            // Archive carts that no longer has any products
            await _cartRepository.ArchiveInactiveAsync();
        }
    }
}