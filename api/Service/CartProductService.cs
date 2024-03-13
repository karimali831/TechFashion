using api.Data;
using api.Helper;
using api.Repository;
using api.ViewModels;

namespace api.Service
{
    public interface ICartProductService
    {
        Task<bool> AddProductAsync(CartProduct model);
        Task<bool> RemoveProductAsync(int id);
        Task<bool> UpdateProductQuantityAsync(int id, int quantity);
        Task<CartViewModel> GetBasketAsync();
    }

    public class CartProductService(
        ICartRepository cartRepository,
        ICartProductRepository cartProductRepository) : ICartProductService
    {
        private readonly ICartRepository _cartRepository = cartRepository;
        private readonly ICartProductRepository _cartProductRepository = cartProductRepository;

        public async Task<bool> AddProductAsync(CartProduct model)
        {
            return await _cartProductRepository.AddAsync(model);
        }

        public async Task<CartViewModel> GetBasketAsync()
        {
            var cart = await _cartRepository.GetAsync();

            if (cart is null)
            {
                return new CartViewModel();
            }

            var products = await _cartProductRepository.GetBasketAsync(cart.Id);

            return new CartViewModel
            {
                Products = products,
                TotalStr = cart.Total.ToCurrencyGbp()
            };
        }

        public async Task<bool> RemoveProductAsync(int id)
        {
            return await _cartProductRepository.RemoveProductAsync(id);
        }

        public async Task<bool> UpdateProductQuantityAsync(int id, int quantity)
        {
            return await _cartProductRepository.UpdateProductQuantityAsync(id, quantity);
        }
    }
}