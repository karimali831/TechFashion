using api.Data;
using api.Dto;
using api.Repository;
using Microsoft.EntityFrameworkCore;

namespace api.Service
{
    public interface IUserService
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetFullAccByEmailAsync(string email);
        Task<User?> GetByFirebaseUIdAsync(string id, Guid? guestCheckoutId = null);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByGuestCheckoutIdAsync(Guid guestCheckoutId);
        Task<User?> GetByCustomerIdAsync(string customerId);
        Task<User?> CreateGuestAccountAsync(string email);
        Task SetCustomerIdAsync(string customerId, int userId);
        Task SetStripeCustomerDeletedAsync(string customerId, DateTime? deletedDate);
        Task<ApiResponse<User>> CreateAsync(CreateUsertDto dto);
        Task<IEnumerable<string>> GetEmailsByUserIds(IEnumerable<int> userIds);
    }

    public class UserService(
        AppDatabaseContext context,
        IUserRepository userRepository,
        ICartRepository cartRepository,
        ICustomerAddressService customerAddressService,
        IEmailVerificationRepository emailVerificationRepository
        ) : IUserService
    {
        private readonly AppDatabaseContext _context = context;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly ICartRepository _cartRepository = cartRepository;
        private readonly IEmailVerificationRepository _emailVerificationRepository = emailVerificationRepository;
        private readonly ICustomerAddressService _customerAddressService = customerAddressService;

        public async Task<IEnumerable<string>> GetEmailsByUserIds(IEnumerable<int> userIds)
        {
            return (await _context.Users.ToListAsync())
                .Where(x => userIds.Contains(x.Id) && x.RemovedDate is null)
                .Select(x => x.Email);
        }

        public async Task<User?> GetByFirebaseUIdAsync(string id, Guid? guestCheckoutId = null)
        {
            var user = await _userRepository.GetByFirebaseUidAsync(id);

            if (user is not null)
            {
                guestCheckoutId = user.FirebaseUid is null ? guestCheckoutId : null;

                user.MainAddress = await _customerAddressService.GetMainAsync(user.Id);
                user.EmailVerified = (await _emailVerificationRepository
                    .IsVerifiedAsync(user.Id, guestCheckoutId)).HasValue;

                // If items were added to a cart on a guest account, we need to update entities to reflect this.
                // if (guestCheckoutId.HasValue)
                // {
                //     await _cartRepository.SetUserIdAsync(user.Id, guestCheckoutId.Value);
                // }
            }

            return user;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User?> GetFullAccByEmailAsync(string email)
        {
            return await _userRepository.GetFullAccByEmailAsync(email);
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

        public async Task<User?> CreateGuestAccountAsync(string email)
        {
            await _userRepository.CreateGuestAccountAsync(email);
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

        public async Task<ApiResponse<User>> CreateAsync(CreateUsertDto dto)
        {
            if (await _userRepository.GetByFirebaseUidAsync(dto.FirebaseUid) is not null)
            {
                return new ApiResponse<User>
                {
                    ErrorMsg = "Account already exists, please login"
                };
            }


            var exists = await _userRepository.GetByEmailAsync(dto.Email);

            if (exists is not null)
            {
                var guestCheckoutId = dto.FirebaseUid is null ? dto.GuestCheckoutId : null;
                var verified = await _emailVerificationRepository.IsVerifiedAsync(exists.Id, guestCheckoutId);

                if (!verified.HasValue)
                {

                }

                if (exists.FirebaseUid is null && dto.FirebaseUid is not null)
                {
                    // This will change a guest account to a full account
                    await _userRepository.SetFirebaseUidAsync(dto.FirebaseUid, dto.Name, exists.Id);

                    return new ApiResponse<User>
                    {
                        Data = exists
                    };
                }
            }

            var userId = await _userRepository.CreateAsync(dto);

            // If items were added to a cart on a guest account, we need to update entities to reflect this.
            if (dto.GuestCheckoutId.HasValue)
            {
                await _cartRepository.SetUserIdAsync(userId, dto.GuestCheckoutId.Value);
            }

            var user = await GetByIdAsync(userId);

            return new ApiResponse<User>
            {
                Data = user
            };
        }

    }
}