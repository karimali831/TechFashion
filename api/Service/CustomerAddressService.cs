using api.Data;
using api.Repository;

namespace api.Service
{
    public interface ICustomerAddressService
    {
        Task<int> AddAsync(CustomerAddress model);
    }

    public class CustomerAddressService(ICustomerAddressRepository customerAddressRepository) : ICustomerAddressService
    {
        private readonly ICustomerAddressRepository _customerAddressRepository = customerAddressRepository;

        public async Task<int> AddAsync(CustomerAddress model)
        {
            return await _customerAddressRepository.AddAsync(model);
        }
    }
}