using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Config;
using Ebaysharp.Entities;
using Ebaysharp.Entities.Order;
using Ebaysharp.Services.Fulfillment;
using Microsoft.Extensions.Options;

namespace api.Service.Ebay
{
    public interface IEbayFeedService
    {

    }

    public class EbayFeedService(IOptions<EbayConfig> configuration) : EbayBaseService(configuration), IEbayFeedService
    {
        public async Task GetItemsAsync()
        {
            var clientToken = GetClientToken();
            var accessToken = await GetAccessTokenAsync("");

            var limit = 10; //getting 10 records at a time
            var orderService = new OrderService(clientToken, accessToken);
            EbayList<Order, EbayFilter>? orders = null;
            do
            {
                var filter = orders != null ? orders.GetNextPageFilter() : new EbayFilter(limit);
                orders = await orderService.GetAllAsync(filter);
            } while (orders.HasNextPage());
        }
    }
}