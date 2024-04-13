using api.Data;
using api.Helper;
using api.Infrastructure;
using api.Models;

namespace api.Repository
{
    public interface IOrderRepository
    {
        Task AddAsync(Order model);
        Task<Order?> GetByRefAsync(int orderRef);
        Task<OrderHistory> GetByPaymentIdAsync(string paymentIntentId);
        Task<IList<OrderHistory>> GetHistoryAsync(int userId);
        Task<IList<OrderItem>> GetOrderedItemsAsync(int orderRef);
    }

    public class OrderRepository(DapperContext context) : DapperBaseRepository(context), IOrderRepository
    {
        private const string Table = "Orders";
        private static readonly string[] Fields = typeof(Order).DapperFields();


        public async Task AddAsync(Order model)
        {
            await ExecuteAsync(DapperHelper.Insert(Table, Fields), model);
        }

        public async Task<Order?> GetByRefAsync(int orderRef)
        {
            return await QueryFirstOrDefaultAsync<Order>($"{DapperHelper.Select(Table, Fields)} WHERE Ref = @orderRef", new { orderRef });
        }

        public async Task<OrderHistory> GetByPaymentIdAsync(string paymentIntentId)
        {
            var sqlTxt = @$"
                SELECT
                    O.Id,
                    O.Ref,
                    O.CreatedDate AS Date,
                    P.Status AS PaymentStatus,
                    O.Status,
                    CA.Name,
                    CA.Line1,
                    CA.Line2,
                    CA.City,
                    CA.PostalCode,
                    CA.Country,
                    P.Amount AS Total
                FROM [Orders] AS O
                JOIN [Carts] AS C
                ON C.Id = O.CartId
                JOIN [StripePayments] AS P
                ON O.PaymentId = P.Id
                JOIN [CustomerAddress] AS CA
                ON CA.Id = O.ShippingAddressId
                WHERE C.ArchiveDate IS NOT NULL
                AND P.PaymentIntentId = @paymentIntentId
            ";

            return await QueryFirstAsync<OrderHistory>(sqlTxt, new { paymentIntentId });
        }

        public async Task<IList<OrderHistory>> GetHistoryAsync(int userId)
        {
            var sqlTxt = @$"
                SELECT
                    O.Id,
                    O.Ref,
                    O.CreatedDate AS Date,
                    P.Status AS PaymentStatus,
                    O.Status,
                    CA.Name,
                    CA.Line1,
                    CA.Line2,
                    CA.City,
                    CA.PostalCode,
                    CA.Country,
                    P.Amount AS Total
                FROM [Orders] AS O
                JOIN [Carts] AS C
                ON C.Id = O.CartId
                JOIN [StripePayments] AS P
                ON O.PaymentId = P.Id
                JOIN [CustomerAddress] AS CA
                ON CA.Id = O.ShippingAddressId
                WHERE C.ArchiveDate IS NOT NULL
                AND C.UserID = @userId
            ";

            return (await QueryAsync<OrderHistory>(sqlTxt, new { userId })).ToList();
        }

        public async Task<IList<OrderItem>> GetOrderedItemsAsync(int orderRef)
        {
            const string sqlTxt = @$"
                ;SELECT 
                    cp.Id,
                    p.Id AS ProductId,
                    p.Title AS Product, 
                    p.Slug AS ProductSlug,
                    NULL AS Variant,
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
                WHERE O.Ref = @orderRef
                AND CP.VariantId IS NULL
                AND C.ArchiveDate IS NOT NULL

                UNION

                SELECT 
                    cp.Id,
                    p.Id,
                    p.Title, 
                    p.Slug,
                    pv.Variant,
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
                WHERE O.Ref = @orderRef
                AND C.ArchiveDate IS NOT NULL
            ";

            return (await QueryAsync<OrderItem>(sqlTxt, new { orderRef }))
                .ToList();
        }
    }
}