using api.Data;
using api.Dto;
using api.Infrastructure;
using api.Repository;

namespace api.Service
{
    public interface ICartProductService
    {
        Task<CartProductStock> StockCheckAsync(int id, bool IsVariant);
        Task<ApiResponse<bool>> AddProductAsync(AddProductToCartDto dto);
        Task RemoveProductAsync(int id);
        Task UpdateProductQuantityAsync(int id, int quantity, bool replinish);
    }

    public class CartProductService(
        AppDatabaseContext context,
        ICartRepository cartRepository,
        IUserService userService,
        IProductRepository productRepository,
        IProductVariantRepository productVariantRepository,
        ICartProductRepository cartProductRepository) : EFRepositoryBase<CartProduct>(context), ICartProductService
    {
        private readonly ICartRepository _cartRepository = cartRepository;
        private readonly IUserService _userService = userService;
        private readonly ICartProductRepository _cartProductRepository = cartProductRepository;
        private readonly IProductRepository _productRepository = productRepository;
        private readonly IProductVariantRepository _productVariantRepository = productVariantRepository;

        public async Task<ApiResponse<bool>> AddProductAsync(AddProductToCartDto dto)
        {
            int? cartId = null;
            if (dto.CartUser.FirebaseUid is not null)
            {
                var user = await _userService.GetByFirebaseUIdAsync(dto.CartUser.FirebaseUid);

                if (user is null)
                {
                    return new ApiResponse<bool>
                    {
                        ErrorMsg = "Something went wrong"
                    };
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
                return new ApiResponse<bool>
                {
                    ErrorMsg = "Something went wrong"
                };
            }

            var create = await InsertAndReturnViewModelAsync<CartProduct>(
                new CartProduct
                {
                    CartId = cartId.Value,
                    Quantity = dto.Quantity,
                    ProductId = dto.ProductId,
                    VariantId = dto.VariantId
                });

            if (create is { Data: not null })
            {
                if (!await UpdateStock(create.Data.Id, replinish: false, dto.Quantity))
                {
                    await _cartProductRepository.RemoveProductAsync(create.Data.Id);

                    return new ApiResponse<bool>
                    {
                        ErrorMsg = "This product is now longer available"
                    };
                }


                return new ApiResponse<bool>
                {
                    Data = true
                };
            }

            return new ApiResponse<bool>
            {
                ErrorMsg = "Something went wrong"
            };
        }

        public async Task RemoveProductAsync(int id)
        {
            if (await UpdateStock(id, quantity: 0, replinish: true))
            {
                await _cartProductRepository.RemoveProductAsync(id);
            }
        }

        public async Task UpdateProductQuantityAsync(int id, int quantity, bool replinish)
        {

            if (await UpdateStock(id, replinish, quantity))
            {
                await _cartProductRepository.UpdateProductQuantityAsync(id, quantity);
            }
        }

        public async Task<CartProductStock> StockCheckAsync(int id, bool IsVariant)
        {
            if (IsVariant)
            {
                return await _cartProductRepository.ProductVariantStockCheckAsync(id);
            }

            return await _cartProductRepository.ProductStockCheckAsync(id);
        }

        private async Task<bool> UpdateStock(int id, bool replinish, int quantity)
        {
            var cartProduct = await _cartProductRepository.GetAsync(id);

            bool productIsVariant = cartProduct.VariantId.HasValue;
            var stockCheck = await StockCheckAsync(cartProduct.VariantId ?? cartProduct.ProductId!.Value, productIsVariant);

            if (stockCheck.Stock is null)
                return false;

            if (!replinish && stockCheck.Quantity > stockCheck.Stock)
                return false;

            var stock = replinish ?
                stockCheck.Stock.Value + (quantity == 0 ? stockCheck.Quantity : quantity) :
                stockCheck.Stock.Value - quantity;

            stock = stock < 0 ? 0 : stock;

            if (productIsVariant)
            {
                await _productVariantRepository.UpdateStockAsync(stockCheck.Id, stock);
            }
            else
            {
                await _productRepository.UpdateStockAsync(stockCheck.Id, stock);
            }

            return true;
        }
    }
}