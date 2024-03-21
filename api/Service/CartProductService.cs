using api.Data;
using api.Dto;
using api.Infrastructure;
using api.Repository;

namespace api.Service
{
    public interface ICartProductService
    {
        Task<bool> AddProductAsync(AddProductToCartDto dto);
        Task<bool> RemoveProductAsync(int id);
        Task<bool> UpdateProductQuantityAsync(int id, int quantity);
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