using api.Data;
using api.Dto;
using api.Repository;

namespace api.Service
{
    public interface IUserService
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByFirebaseUIdAsync(string id, Guid? guestCheckoutId = null);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByGuestCheckoutIdAsync(Guid guestCheckoutId);
        Task<User?> GetByCustomerIdAsync(string customerId);
        Task<User?> CreateGuestAccountAsync(GuestCheckoutDto dto);
        Task SetCustomerIdAsync(string customerId, int userId);
        Task SetStripeCustomerDeletedAsync(string customerId, DateTime? deletedDate);
        Task SetNameAsync(string name, int userId);
        Task<ApiResponse<string>> CreateAsync(CreateUsertDto dto);
    }

    public class UserService(
        IUserRepository userRepository,
        ICartRepository cartRepository,
        ICustomerAddressService customerAddressService) : IUserService
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly ICartRepository _cartRepository = cartRepository;
        private readonly ICustomerAddressService _customerAddressService = customerAddressService;

        public async Task<User?> GetByFirebaseUIdAsync(string id, Guid? guestCheckoutId = null)
        {
            var user = await _userRepository.GetByFirebaseUidAsync(id);

            if (user is not null)
            {
                user.MainAddress = await _customerAddressService.GetMainAsync(user.Id);

                // If items were added to a cart on a guest account, we need to update entities to reflect this.
                if (guestCheckoutId.HasValue)
                {
                    await _cartRepository.SetUserIdAsync(user.Id, guestCheckoutId.Value);
                }
            }

            return user;
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

        public async Task<User?> CreateGuestAccountAsync(GuestCheckoutDto dto)
        {
            await _userRepository.CreateGuestAccountAsync(dto);
            return await GetByEmailAsync(dto.Email);
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


        public async Task SetNameAsync(string name, int userId)
        {
            await _userRepository.SetNameAsync(name, userId);
        }

        public async Task<ApiResponse<string>> CreateAsync(CreateUsertDto dto)
        {
            if (await _userRepository.GetByFirebaseUidAsync(dto.FirebaseUid) is not null)
            {
                return new ApiResponse<string>
                {
                    ErrorMsg = "Account already exists, please login"
                };
            }

            var exists = await _userRepository.GetByEmailAsync(dto.Email);

            if (exists is not null && exists.FirebaseUid is null)
            {
                // This will change a guest account to a full account
                await _userRepository.SetFirebaseUidAsync(dto.FirebaseUid, exists.Id);

                return new ApiResponse<string>
                {
                    Data = "Account created and you are now logged in"
                    // Data = "A guest account already exists for this email. We have now updated this as a full account and you can now login."
                };
            }

            var userId = await _userRepository.CreateAsync(dto);

            // If items were added to a cart on a guest account, we need to update entities to reflect this.
            if (dto.GuestCheckoutId.HasValue)
            {
                await _cartRepository.SetUserIdAsync(userId, dto.GuestCheckoutId.Value);
            }

            return new ApiResponse<string>
            {
                Data = "Account created and you are now logged in"
            };
        }
    }
}