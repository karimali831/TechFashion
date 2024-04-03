using api.Data;
using api.Helper;
using api.Infrastructure;
using api.Models;

namespace api.Repository
{
    public interface ICartProductRepository
    {
        Task<bool> AddAsync(CartProduct model);
        Task<bool> RemoveProductAsync(int id);
        Task<bool> UpdateProductQuantityAsync(int id, int quantity);
        Task<IList<CartProductDetail>> GetBasketAsync(int cartId, bool incArchived = false);
    }

    public class CartProductRepository(IConfiguration configuration) : DapperBaseRepository(configuration),
        ICartProductRepository
    {
        private static readonly string TABLE = "CartProducts";
        private static readonly string[] FIELDS = typeof(CartProduct).DapperFields();


        public async Task<bool> UpdateProductQuantityAsync(int id, int quantity)
        {
            return await ExecuteAsync(@$"
                ;UPDATE {TABLE}
                SET Quantity = @quantity
                WHERE Id = @id
            ", new
            {
                quantity,
                id
            });
        }

        public async Task<bool> AddAsync(CartProduct model)
        {
            return await ExecuteAsync(DapperHelper.Insert(TABLE, FIELDS), model);
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
            return await ExecuteAsync(@$"
                ;UPDATE {TABLE}
                SET RemovedDate = @date
                WHERE Id = @id
            ", new
            {
                date = DateTime.UtcNow,
                id
            });
        }
    }
}