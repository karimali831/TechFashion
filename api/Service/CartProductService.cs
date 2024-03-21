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
        Task<CartViewModel?> GetBasketAsync(CartUserDto dto);
        Task<CartViewModel?> GetBasketAsync(int userId);
        Task EmptyBasketAsync(int userId);
    }

    public class CartProductService(
        AppDatabaseContext context,
        ICartRepository cartRepository,
        IUserService userService,
        ICartProductRepository cartProductRepository) : EFRepositoryBase<CartProduct>(context), ICartProductService
    {
        private readonly ICartRepository _cartRepository = cartRepository;
        private readonly IUserService _userService = userService;
        private readonly ICartProductRepository _cartProductRepository = cartProductRepository;

        public async Task<bool> AddProductAsync(AddProductToCartDto dto)
        {
            int? cartId = null;
            if (dto.CartUser.FirebaseUid is not null)
            {
                var user = await _userService.GetByFirebaseUIdAsync(dto.CartUser.FirebaseUid);

                if (user is null)
                {
                    throw new ApplicationException("FirebaseUid/user record not found");
                }

                var cart = await _cartRepository.GetByUserIdAsync(user.Id);

                if (cart is null)
                {
                    var model = new Cart { UserId = user.Id };

                    await _context.Carts.AddAsync(model);
                    await _context.SaveChangesAsync();

                    cartId = model.Id;
                }
                else
                {
                    cartId = cart.Id;
                }
            }
            else if (dto.CartUser.GuestCheckoutId.HasValue)
            {
                var cart = await _cartRepository.GetByGuestCheckoutIdAsync(dto.CartUser.GuestCheckoutId.Value);

                if (cart is null)
                {
                    var model = new Cart { GuestCheckoutId = dto.CartUser.GuestCheckoutId };

                    await _context.Carts.AddAsync(model);
                    await _context.SaveChangesAsync();

                    cartId = model.Id;
                }
                else
                {
                    cartId = cart.Id;
                }
            }

            if (!cartId.HasValue)
            {
                throw new ApplicationException("An error occurred");
            }

            var create = await InsertAndReturnViewModelAsync<CartProduct>(
                new CartProduct
                {
                    CartId = cartId.Value,
                    Quantity = dto.Quantity,
                    ProductId = dto.ProductId,
                    VariantId = dto.VariantId
                });

            return create.ErrorMsg is not null;
        }

        public async Task EmptyBasketAsync(int userId)
        {
            var user = await _userService.GetByIdAsync(userId);

            if (user is null)
            {
                throw new ApplicationException("Unhandled error");
            }

            Cart? cart = null;

            if (user.GuestCheckoutId.HasValue)
            {
                cart = await _cartRepository.GetByGuestCheckoutIdAsync(user.GuestCheckoutId.Value);
            }
            else
            {
                cart = await _cartRepository.GetByUserIdAsync(user.Id);
            }

            if (cart is null)
            {
                throw new ApplicationException("Unhandled error");
            }

            await _cartRepository.EmptyAsync(cart.Id);
        }

        public async Task<CartViewModel?> GetBasketAsync(int userId)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId);
            return await GetViewModelAsync(cart);
        }

        public async Task<CartViewModel?> GetBasketAsync(CartUserDto dto)
        {
            Cart? cart = null;

            if (dto.FirebaseUid is not null)
            {
                var user = await _userService.GetByFirebaseUIdAsync(dto.FirebaseUid);

                if (user is null)
                {
                    throw new ApplicationException("An error occurred");
                }

                cart = await _cartRepository.GetByUserIdAsync(user.Id);
            }
            else if (dto.GuestCheckoutId.HasValue)
            {
                cart = await _cartRepository.GetByGuestCheckoutIdAsync(dto.GuestCheckoutId.Value);
            }

            return await GetViewModelAsync(cart);
        }

        public async Task<bool> RemoveProductAsync(int id)
        {
            return await _cartProductRepository.RemoveProductAsync(id);
        }

        public async Task<bool> UpdateProductQuantityAsync(int id, int quantity)
        {
            return await _cartProductRepository.UpdateProductQuantityAsync(id, quantity);
        }

        private async Task<CartViewModel> GetViewModelAsync(Cart? cart)
        {
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
    }
}