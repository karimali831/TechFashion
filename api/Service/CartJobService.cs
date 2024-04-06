using api.Repository;

namespace api.Service
{
    public interface ICartJobService
    {
        Task RemoveInactiveCartsAsync();
    }

    public class CartJobService(
        ICartRepository cartRepository,
        ICartProductRepository cartProductRepository) : ICartJobService
    {
        private readonly ICartRepository _cartRepository = cartRepository;
        private readonly ICartProductRepository _cartProductRepository = cartProductRepository;


        public async Task RemoveInactiveCartsAsync()
        {
            // Remove products from cart if inactive after 20 mins
            await _cartProductRepository.RemoveInactiveAsync();

            // Archive carts that no longer has any products
            await _cartRepository.ArchiveInactiveAsync();
        }
    }
}