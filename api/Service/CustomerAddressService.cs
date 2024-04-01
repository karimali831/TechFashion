using api.Data;
using api.Dto;
using api.Repository;

namespace api.Service
{
    public interface ICustomerAddressService
    {
        Task<int> GetOrAddAsync(CustomerAddress model);
        Task<CustomerAddress?> GetMainAsync(int userId);
        Task<IList<CustomerAddress>> GetAllAsync(int userId);
        Task<ApiResponse<bool>> AddOrUpdateAddress(CustomerAddress model);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }

    public class CustomerAddressService(ICustomerAddressRepository customerAddressRepository) : ICustomerAddressService
    {
        private readonly ICustomerAddressRepository _customerAddressRepository = customerAddressRepository;

        public async Task<int> GetOrAddAsync(CustomerAddress model)
        {
            return await _customerAddressRepository.GetOrAddAsync(model);
        }

        public async Task<CustomerAddress?> GetMainAsync(int userId)
        {
            return await _customerAddressRepository.GetMainAsync(userId);
        }

        public async Task<IList<CustomerAddress>> GetAllAsync(int userId)
        {
            return await _customerAddressRepository.GetAllAsync(userId);
        }

        public async Task<ApiResponse<bool>> AddOrUpdateAddress(CustomerAddress model)
        {
            if (model.Id == 0)
            {
                if (await _customerAddressRepository.FindAsync(model) is not null)
                {

                    return new ApiResponse<bool>
                    {
                        ErrorMsg = "This address already exists"
                    };
                }
            }
            else
            {
                if (await _customerAddressRepository.DeepFindAsync(model) is not null)
                {
                    return new ApiResponse<bool>
                    {
                        ErrorMsg = "Address unchanged or already exists"
                    };
                }
            }

            if (await _customerAddressRepository.AddOrUpdateAddress(model))
            {
                return new ApiResponse<bool>
                {
                    Data = true
                };
            }

            return new ApiResponse<bool>
            {
                ErrorMsg = "Something went wrong"
            };
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var find = await _customerAddressRepository.GetByIdAsync(id);

            if (find?.Main is true)
            {
                var allAddressess = await GetAllAsync(find.UserId);

                if (allAddressess.Count > 1)
                {
                    return new ApiResponse<bool>
                    {
                        ErrorMsg = "You can not delete the default address. Update another address as default before deleting this."
                    };
                }
            }

            if (await _customerAddressRepository.DeleteAsync(id))
            {
                return new ApiResponse<bool> { Data = true };
            }
            else
            {
                return new ApiResponse<bool> { ErrorMsg = "An error occurred" };
            }
        }
    }
}