using api.Data;
using api.Dto;
using api.Infrastructure;
using api.Repository;

namespace api.Service
{
    public interface ICartProductService
    {
        Task<IList<CartProductStock>> StockCheckAsync(int id, bool IsVariant);
        Task<ApiResponse<int>> AddProductAsync(AddProductToCartDto dto);
        Task<ApiResponse<int>> RemoveProductAsync(int id);
        Task<ApiResponse<int>> UpdateProductQuantityAsync(int id, int quantity, bool replinish);
        Task UpdateStockAsync(int id, int stock, bool isVariant);
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

        public async Task<ApiResponse<int>> AddProductAsync(AddProductToCartDto dto)
        {
            int? cartId = null;
            if (dto.CartUser.FirebaseUid is not null)
            {
                var user = await _userService.GetByFirebaseUIdAsync(dto.CartUser.FirebaseUid);

                if (user is null)
                {
                    return new ApiResponse<int>
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
                return new ApiResponse<int>
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
                var stockCheck = await UpdateStock(create.Data.Id, replinish: false, dto.Quantity, newItem: true);

                if (!stockCheck.HasValue)
                {
                    await _cartProductRepository.RemoveProductAsync(create.Data.Id);

                    return new ApiResponse<int>
                    {
                        ErrorMsg = "Quantity not available or is now out of stock"
                    };
                }


                return new ApiResponse<int>
                {
                    Data = stockCheck.Value
                };
            }

            return new ApiResponse<int>
            {
                ErrorMsg = "Something went wrong"
            };
        }

        public async Task<ApiResponse<int>> RemoveProductAsync(int id)
        {
            var stockCheck = await UpdateStock(id, quantity: 0, replinish: true, newItem: false);

            if (stockCheck.HasValue)
            {
                if (await _cartProductRepository.RemoveProductAsync(id))
                {
                    return new ApiResponse<int> { Data = stockCheck.Value };
                }
            }

            return new ApiResponse<int> { ErrorMsg = "Something went wrong." };
        }

        public async Task<ApiResponse<int>> UpdateProductQuantityAsync(int id, int quantity, bool replinish)
        {
            var stockCheck = await UpdateStock(id, replinish, quantity, newItem: false);

            if (stockCheck.HasValue)
            {
                if (await _cartProductRepository.UpdateProductQuantityAsync(id, quantity))
                {
                    return new ApiResponse<int> { Data = stockCheck.Value };
                }
            }

            return new ApiResponse<int> { ErrorMsg = "Quantity not available" };
        }

        public async Task<IList<CartProductStock>> StockCheckAsync(int id, bool IsVariant)
        {
            if (IsVariant)
            {
                return await _cartProductRepository.ProductVariantStockCheckAsync(id);
            }

            return await _cartProductRepository.ProductStockCheckAsync(id);
        }

        private async Task<int?> UpdateStock(int id, bool replinish, int quantity, bool newItem)
        {
            var cartProduct = await _cartProductRepository.GetAsync(id);

            bool productIsVariant = cartProduct.VariantId.HasValue;
            var stockCheck = await StockCheckAsync(cartProduct.VariantId ?? cartProduct.ProductId!.Value, productIsVariant);

            if (!stockCheck.Any())
                return 0;

            var remainingStock = stockCheck.First().Stock;
            var originalStock = stockCheck.First().OriginalStock;

            var userQuantity = stockCheck.First(x => x.CartProductId == id).Quantity;

            if (quantity > originalStock)
                return null;

            var quantityInCart = stockCheck.Sum(x => x.Quantity);

            if (quantityInCart > originalStock && !replinish)
                return null;

            var quantityTotal = quantityInCart -
                (replinish ? userQuantity - quantity : userQuantity - quantity);

            var stock = originalStock - (newItem ? quantityInCart : quantityTotal);


            if (stock > originalStock)
                return null;

            if (!replinish && quantityTotal > originalStock)
                return null;

            await UpdateStockAsync(stockCheck.First().Id, stock, productIsVariant);
            return stock;
        }

        public async Task UpdateStockAsync(int id, int stock, bool isVariant)
        {
            if (isVariant)
            {
                await _productVariantRepository.UpdateStockAsync(id, stock);
            }
            else
            {
                await _productRepository.UpdateStockAsync(id, stock);
            }
        }
    }
}