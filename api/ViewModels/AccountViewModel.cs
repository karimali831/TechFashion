using api.Data;
using api.Models;

namespace api.ViewModels
{
    public class AccountViewModel
    {
        public IList<OrderDetail> Orders { get; set; } = [];
        public IList<CustomerAddress> Addresses { get; set; } = [];
    }
}