using api.Data;
using api.Models;

namespace api.ViewModels
{
    public class AccountViewModel
    {
        public IList<OrderHistory> Orders { get; set; } = [];
        public IList<CustomerAddress> Addresses { get; set; } = [];
    }
}