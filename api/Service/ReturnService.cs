using api.Data;
using api.Repository;

namespace api.Service
{
    public interface IReturnService
    {
        Task AddAsync(Order model);
    }

    public class ReturnService(IReturnRepository returnRepository) : IReturnService
    {
        private readonly IReturnRepository _returnRepository = returnRepository;

        public async Task AddAsync(Order model)
        {
            await _returnRepository.AddAsync(model);
        }
    }
}