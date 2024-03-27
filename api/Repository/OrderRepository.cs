using api.Data;
using api.Helper;
using api.Infrastructure;
using api.Models;

namespace api.Repository
{
    public interface IOrderRepository
    {
        Task AddAsync(Order model);
        Task<IList<OrderHistory>> GetHistoryAsync(int userId);
        Task<IList<OrderItem>> GetOrderedItemsAsync(int orderId);
    }

    public class OrderRepository(IConfiguration configuration) : DapperBaseRepository(configuration), IOrderRepository
    {
        private const string Table = "Orders";
        private static readonly string[] Fields = typeof(Order).DapperFields();


        public async Task AddAsync(Order model)
        {
            await ExecuteAsync(DapperHelper.Insert(Table, Fields), model);
        }

        public async Task<IList<OrderHistory>> GetHistoryAsync(int userId)
        {
            var sqlTxt = @$"
                SELECT
                    O.Id,
                    O.CreatedDate AS Date,
                    P.Status AS PaymentStatus,
                    O.Status,
                    P.Amount AS Total
                FROM [Orders] AS O
                JOIN [Carts] AS C
                ON C.Id = O.CartId
                JOIN [StripePayments] AS P
                ON O.PaymentId = P.Id
                WHERE C.ArchiveDate IS NOT NULL
                AND C.UserID = @userId
            ";

            return (await QueryAsync<OrderHistory>(sqlTxt, new { userId })).ToList();
        }

        public async Task<IList<OrderItem>> GetOrderedItemsAsync(int orderId)
        {
            const string sqlTxt = @$"
                ;SELECT 
                    cp.Id,
                    p.Id AS ProductId,
                    p.Title AS Product, 
                    p.Slug AS ProductSlug,
                    P.Sku,
                    cp.Quantity,
                    p.Price,
                    p.Price * cp.Quantity AS Total
                FROM [Products] AS P
                JOIN [CartProducts] AS CP
                ON CP.ProductId = P.Id
                JOIN [Carts] AS C
                ON C.Id = CP.CartId 
                JOIN [Orders] AS O
                ON O.CartId = C.Id
                WHERE O.Id = @orderId
                AND CP.RemovedDate IS NULL
                AND CP.VariantId IS NULL
                AND C.ArchiveDate IS NOT NULL

                UNION

                SELECT 
                    cp.Id,
                    p.Id,
                    p.Title, 
                    p.Slug,
                    pv.Sku,
                    cp.Quantity,
                    pv.Price,
                    pv.Price * cp.Quantity
                FROM [Products] AS P
                JOIN [ProductVariants] AS PV
                ON PV.ProductId = P.Id
                JOIN [CartProducts] CP 
                ON cp.VariantId = pv.Id
                JOIN [Carts] AS C
                ON C.Id = CP.CartId 
                JOIN [Orders] AS O
                ON O.CartId = C.Id
                WHERE O.Id = @orderId
                AND CP.RemovedDate IS NULL
                AND C.ArchiveDate IS NOT NULL
            ";

            return (await QueryAsync<OrderItem>(sqlTxt, new { orderId }))
                .ToList();
        }
    }
}