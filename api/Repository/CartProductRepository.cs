using api.Data;
using api.Helper;
using api.Infrastructure;
using api.Models;

namespace api.Repository
{
    public interface ICartProductRepository
    {
        Task<IList<CartProductStock>> ProductStockCheckAsync(int productId);
        Task<IList<CartProductStock>> ProductVariantStockCheckAsync(int productVariantId);
        Task<IList<CartProductStock>> ProductsStockCheckAsync();
        Task<CartProduct> GetAsync(int id);
        Task<bool> AddAsync(CartProduct model);
        Task<bool> RemoveProductAsync(int id);
        Task<bool> UpdateProductQuantityAsync(int id, int quantity);
        Task<IList<CartProductDetail>> GetBasketAsync(int cartId, bool incArchived = false);
        Task RemoveInactiveAsync(int id);
    }

    public class CartProductRepository(IConfiguration configuration) : DapperBaseRepository(configuration),
        ICartProductRepository
    {
        private static readonly string Table = "CartProducts";
        private static readonly string[] Fields = typeof(CartProduct).DapperFields();

        public async Task<IList<CartProductStock>> ProductStockCheckAsync(int productId)
        {
            var sqlTxt = @$"
                SELECT p.Id, cp.Id AS CartProductId, p.Stock, cp.Quantity, p.Price, p.OriginalStock, 0 AS IsVariant
                FROM Products AS P
                JOIN CartProducts AS CP
                ON cp.ProductId = P.Id AND cp.VariantId IS NULL
                WHERE p.Id = @productId
                AND cp.RemovedDate IS NULL
                AND p.Stock IS NOT NULL
                AND p.OriginalStock IS NOT NULL";

            return (await QueryAsync<CartProductStock>(sqlTxt, new { productId })).ToList();
        }

        public async Task<IList<CartProductStock>> ProductVariantStockCheckAsync(int productVariantId)
        {
            var sqlTxt = @$"
                SELECT pv.Id, cp.Id AS CartProductId, pv.Stock, cp.Quantity, pv.Price, pv.OriginalStock, 1 AS IsVariant
                FROM ProductVariants AS PV
                JOIN CartProducts AS CP
                ON cp.VariantId = pv.Id
                WHERE pv.Id = @productVariantId
                AND cp.RemovedDate IS NULL
                AND pv.Stock IS NOT NULL
                AND pv.OriginalStock IS NOT NULL";

            return (await QueryAsync<CartProductStock>(sqlTxt, new { productVariantId })).ToList();
        }

        public async Task<IList<CartProductStock>> ProductsStockCheckAsync()
        {
            var sqlTxt = @$"
                SELECT p.Id, cp.Id AS CartProductId, p.Stock, cp.Quantity, p.Price, p.OriginalStock, 0 AS IsVariant
                FROM Products AS P
                JOIN CartProducts AS CP
                ON cp.ProductId = P.Id AND cp.VariantId IS NULL
                WHERE GETDATE() > DATEADD(minute, 30, cp.CreatedDate)
                AND cp.RemovedDate IS NULL
                AND p.Stock IS NOT NULL
                AND p.OriginalStock IS NOT NULL

                UNION

                SELECT pv.Id, cp.Id, pv.Stock, cp.Quantity, pv.Price, pv.OriginalStock, 1
                FROM ProductVariants AS PV
                JOIN CartProducts AS CP
                ON cp.VariantId = pv.Id
                WHERE GETDATE() > DATEADD(minute, 30, cp.CreatedDate)
                AND cp.RemovedDate IS NULL
                AND pv.Stock IS NOT NULL
                AND pv.OriginalStock IS NOT NULL";

            return (await QueryAsync<CartProductStock>(sqlTxt)).ToList();
        }

        public async Task<bool> UpdateProductQuantityAsync(int id, int quantity)
        {
            return await ExecuteAsync($";UPDATE {Table} SET Quantity = @quantity WHERE Id = @id",
                new
                {
                    quantity,
                    id
                });
        }

        public async Task<bool> AddAsync(CartProduct model)
        {
            return await ExecuteAsync(DapperHelper.Insert(Table, Fields), model);
        }

        public async Task<IList<CartProductDetail>> GetBasketAsync(int cartId, bool incArchived = false)
        {
            string sqlTxt = @$"
                ;SELECT 
                    cp.Id,
                    p.Id AS ProductId,
                    NULL AS VariantId,
                    p.Title, 
                    cp.Quantity,
                    p.Stock,
                    NULL AS Variant,
                    p.Price AS UnitPrice,
                    p.Price * cp.Quantity AS UnitTotal
                FROM [Products] AS P
                JOIN [CartProducts] AS CP
                ON CP.ProductId = P.Id
                JOIN [Carts] AS C
                ON C.Id = CP.CartId 
                WHERE P.Active = 1 
                AND CP.CartId = @cartId
                AND CP.RemovedDate IS NULL
                AND CP.VariantId IS NULL
                {(incArchived ? "" : "AND C.ArchiveDate IS NULL")}

                UNION

                SELECT 
                    cp.Id,
                    pv.ProductId,
                    pv.Id,
                    p.Title, 
                    cp.Quantity,
                    pv.Stock,
                    pv.Variant,
                    pv.Price,
                    pv.Price * cp.Quantity
                FROM [Products] AS P
                JOIN [ProductVariants] AS PV
                ON PV.ProductId = P.Id
                JOIN [CartProducts] CP 
                ON cp.VariantId = pv.Id
                JOIN [Carts] AS C
                ON C.Id = CP.CartId 
                WHERE p.Active = 1
                AND CP.CartId = @cartId
                AND CP.RemovedDate IS NULL
                {(incArchived ? "" : "AND C.ArchiveDate IS NULL")}
            ";

            return (await QueryAsync<CartProductDetail>(sqlTxt, new { cartId }))
                .ToList();
        }

        public async Task<bool> RemoveProductAsync(int id)
        {
            return await ExecuteAsync($"UPDATE {Table} SET RemovedDate = @date WHERE Id = @id",
                new
                {
                    date = DateTime.UtcNow,
                    id
                });
        }

        public async Task<CartProduct> GetAsync(int id)
        {
            return await QueryFirstAsync<CartProduct>($"{DapperHelper.Select(Table, Fields)} WHERE Id = @id", new { id });
        }

        public async Task RemoveInactiveAsync(int id)
        {
            await ExecuteAsync($"UPDATE {Table} SET RemovedDate = GETDATE(), RemovedByJob = 1 WHERE Id = @id", new { id });
        }
    }
}