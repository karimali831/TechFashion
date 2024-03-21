using api.Data;
using api.Dto;
using api.Helper;
using api.Infrastructure;
using api.Repository;
using api.ViewModels;

namespace api.Service
{
    public interface ICartProductService
    {
        Task<bool> AddProductAsync(AddProductToCartDto dto);
        Task<bool> RemoveProductAsync(int id);
        Task<bool> UpdateProductQuantityAsync(int id, int quantity);
        Task<CartViewModel?> GetBasketAsync(int userId);
    }

    public class CartProductService(
        AppDatabaseContext context,
        ICartRepository cartRepository,
        ICartProductRepository cartProductRepository) : EFRepositoryBase<CartProduct>(context), ICartProductService
    {
        private readonly ICartRepository _cartRepository = cartRepository;
        private readonly ICartProductRepository _cartProductRepository = cartProductRepository;

        public async Task<bool> AddProductAsync(AddProductToCartDto dto)
        {
            var create = await InsertAndReturnViewModelAsync<CartProduct>(
                new CartProduct
                {
                    CartId = dto.CartId,
                    Quantity = dto.Quantity,
                    ProductId = dto.ProductId,
                    VariantId = dto.VariantId
                });

            return create.ErrorMsg is not null;
        }

        // public async Task<CartViewModel?> EmptyBasketAsync()
        // {

        // }

        public async Task<CartViewModel?> GetBasketAsync(int userId)
        {
            var cart = await _cartRepository.GetAsync(userId);

            if (cart is null)
            {
                return new CartViewModel();
            }

            var products = (await _cartProductRepository.GetBasketAsync(cart.Id))
                .Select(x =>
                {
                    x.UnitPriceStr = x.UnitPrice.ToCurrencyGbp();
                    x.UnitTotalStr = x.UnitTotal.ToCurrencyGbp();
                    return x;
                })
                .ToList();

            var total = products.Sum(x => x.UnitTotal);

            return new CartViewModel
            {
                Products = products,
                Total = total,
                TotalStr = total.ToCurrencyGbp()
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