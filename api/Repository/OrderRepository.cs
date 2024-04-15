using api.Data;
using api.Enum;
using api.Helper;
using api.Infrastructure;
using api.Models;

namespace api.Repository
{
    public interface IOrderRepository
    {
        Task<Order> GetAsync(int id);
        Task<Order?> GetPendingByCartIdAsync(int cartId);
        Task<int> AddAsync(Order model);
        Task UpdateAsync(Order model);
        Task<Order?> GetByRefAsync(int orderRef);
        Task<OrderDetail> GetDetailsAsync(int? id, int? orderRef);
        Task<IList<OrderDetail>> GetHistoryAsync(int userId);
        Task<IList<OrderItem>> GetOrderedItemsAsync(int orderRef);
        Task UpdateShippingAddressIdAsync(int id, int? shippingAddressId);
    }

    public class OrderRepository(DapperContext context) : DapperBaseRepository(context), IOrderRepository
    {
        private const string Table = "Orders";
        private static readonly string[] Fields = typeof(Order).DapperFields();

        public async Task<Order?> GetPendingByCartIdAsync(int cartId)
        {
            var sqlTxt = @$"
                {DapperHelper.Select(Table, Fields)}
                WHERE CartId = @cartId 
                AND RemovedDate IS NULL
                AND Status = {(int)OrderStatus.Created}
            ";

            return await QueryFirstOrDefaultAsync<Order?>(sqlTxt,
                new { cartId }
            );
        }

        public async Task<Order> GetAsync(int id)
        {
            return await QueryFirstAsync<Order>($"{DapperHelper.Select(Table, Fields)} WHERE Id = @id AND RemovedDate IS NULL", new { id });
        }

        public async Task<int> AddAsync(Order model)
        {
            var create = await QueryAsync<int>(DapperHelper.Insert(Table, Fields), model);
            return create.Single();
        }

        public async Task UpdateAsync(Order model)
        {
            await ExecuteAsync(DapperHelper.Update(Table, Fields), model);
        }

        public async Task<Order?> GetByRefAsync(int orderRef)
        {
            return await QueryFirstOrDefaultAsync<Order>($"{DapperHelper.Select(Table, Fields)} WHERE Ref = @orderRef", new { orderRef });
        }

        public async Task<OrderDetail> GetDetailsAsync(int? id, int? orderRef)
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
                LEFT JOIN [StripePayments] AS P
                ON O.PaymentId = P.Id
                LEFT JOIN [CustomerAddress] AS CA
                ON CA.Id = O.ShippingAddressId
                WHERE O.Ref = @orderRef OR O.Id = @id
            ";

            return await QueryFirstAsync<OrderDetail>(sqlTxt, new { id, orderRef });
        }

        public async Task<IList<OrderDetail>> GetHistoryAsync(int userId)
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

            return (await QueryAsync<OrderDetail>(sqlTxt, new { userId })).ToList();
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
            ";

            return (await QueryAsync<OrderItem>(sqlTxt, new { orderRef }))
                .ToList();
        }

        public async Task UpdateShippingAddressIdAsync(int id, int? shippingAddressId)
        {
            var sqlTxt = @$"
                UPDATE {Table} 
                SET ShippingAddressId = @ShippingAddressId 
                WHERE Id = @id AND Status = {(int)OrderStatus.Canceled}
            ";

            await ExecuteAsync(sqlTxt, new { id, shippingAddressId });
        }
    }
}