using api.Data;
using api.Repository;

namespace api.Service
{
    public interface IUserService
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByFirebaseUIdAsync(string id);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByGuestCheckoutIdAsync(Guid guestCheckoutId);
        Task<User?> GetByCustomerIdAsync(string customerId);
        Task<User?> CreateGuestAccountAsync(string email, Guid guestCheckoutId);
        Task SetCustomerIdAsync(string customerId, int userId);
        Task SetStripeCustomerDeletedAsync(string customerId, DateTime? deletedDate);
        Task SetEmailAsync(string email, Guid guestCheckoutId);
    }

    public class UserService(IUserRepository userRepository) : IUserService
    {
        private readonly IUserRepository _userRepository = userRepository;

        public Task<User?> GetByFirebaseUIdAsync(string id)
        {
            return _userRepository.GetByFirebaseUidAsync(id);
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }

        public async Task<User?> GetByGuestCheckoutIdAsync(Guid guestCheckoutId)
        {
            return await _userRepository.GetByGuestCheckoutIdAsync(guestCheckoutId);
        }

        public async Task<User?> GetByCustomerIdAsync(string customerId)
        {
            return await _userRepository.GetByCustomerIdAsync(customerId);
        }

        public async Task<User?> CreateGuestAccountAsync(string email, Guid guestCheckoutId)
        {
            await _userRepository.CreateGuestAccountAsync(email, guestCheckoutId);
            return await GetByEmailAsync(email);
        }

        public async Task SetCustomerIdAsync(string customerId, int userId)
        {
            var getByCustomerId = await _userRepository.GetByCustomerIdAsync(customerId);

            if (getByCustomerId is not null)
            {
                if (getByCustomerId.StripeCustomerDeleted.HasValue)
                {
                    await SetStripeCustomerDeletedAsync(customerId, deletedDate: null);
                }

                return;
            }

            var getById = await _userRepository.GetByIdAsync(userId);

            if (getById is not null)
            {
                if (getById.StripeCustomerDeleted.HasValue)
                {
                    await SetStripeCustomerDeletedAsync(customerId, deletedDate: null);
                }


                await _userRepository.SetStripeCustomerIdAsync(customerId, userId);
            }
        }

        public async Task SetStripeCustomerDeletedAsync(string customerId, DateTime? deletedDate)
        {
            await _userRepository.SetStripeCustomerDeletedAsync(customerId, deletedDate);
        }

        public async Task SetEmailAsync(string email, Guid guestCheckoutId)
        {
            await _userRepository.SetEmailAsync(email, guestCheckoutId);
        }
    }
}