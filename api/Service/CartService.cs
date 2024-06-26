using api.Data;
using api.Dto;
using api.Helper;
using api.Infrastructure;
using api.Repository;
using api.ViewModels;

namespace api.Service
{
    public interface ICartService
    {
        Task ArchiveAsync(int cartId);
        Task<CartViewModel?> GetAsync(int userId, string? firebaseUid);
        Task<CartViewModel?> GetAsync(CartUserDto dto);
        Task SetUserIdAsync(int userId, Guid guestCheckoutId);
    }

    public class CartService(
        AppDatabaseContext context,
        ICartRepository cartRepository,
        IUserService userService,
        IProductRepository productRepository,
        IProductVariantRepository productVariantRepository,
        ICartProductRepository cartProductRepository) : EFRepositoryBase<CartProduct>(context), ICartService
    {
        private readonly ICartRepository _cartRepository = cartRepository;
        private readonly IUserService _userService = userService;
        private readonly ICartProductRepository _cartProductRepository = cartProductRepository;
        private readonly IProductRepository _productRepository = productRepository;
        private readonly IProductVariantRepository _productVariantRepository = productVariantRepository;


        public async Task EmptyAsync(User user)
        {
            var cart = await _cartRepository.GetByUserIdAsync(user.Id);

            if (cart is null)
            {
                throw new ApplicationException("Unhandled error");
            }

            await ArchiveAsync(cart.Id);
        }


        public async Task ArchiveAsync(int cartId)
        {
            await _cartRepository.EmptyAsync(cartId);
        }

        public async Task<CartViewModel?> GetAsync(int userId, string? firebaseUid)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId);
            return await GetViewModelAsync(cart, firebaseUid);
        }

        public async Task<CartViewModel?> GetAsync(CartUserDto dto)
        {
            Cart? cart = null;
            if (dto.FirebaseUid is not null)
            {
                var user = await _userService.GetByFirebaseUIdAsync(dto.FirebaseUid);
                cart = user is null ? null : await _cartRepository.GetByUserIdAsync(user.Id);
            }
            else if (dto.GuestCheckoutId.HasValue)
            {
                cart = await _cartRepository.GetByGuestCheckoutIdAsync(dto.GuestCheckoutId.Value);
            }

            return await GetViewModelAsync(cart, dto.FirebaseUid);
        }

        public async Task SetUserIdAsync(int userId, Guid guestCheckoutId)
        {
            await _cartRepository.SetUserIdAsync(userId, guestCheckoutId);
        }

        private async Task<CartViewModel?> GetViewModelAsync(Cart? cart, string? firebaseUid)
        {
            if (cart is null)
                return null;

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
                Id = cart.Id,
                Products = products,
                Total = total,
                ShowGuestCheckout = products.Count != 0 && firebaseUid is null,
                TotalStr = total.ToCurrencyGbp()
            };
        }
    }
}