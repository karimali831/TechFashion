using api.Data;
using api.Helper;
using api.Infrastructure;

namespace api.Repository
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByFirebaseUidAsync(string id);
    }

    public class UserRepository(IConfiguration configuration) : DapperBaseRepository(configuration),
        IUserRepository
    {
        private const string Table = "[dbo].[Users]";
        private static readonly string[] Fields = typeof(User).DapperFields();


        public async Task<User?> GetByIdAsync(int id)
        {
            return await QueryFirstOrDefaultAsync<User>($"{DapperHelper.Select(Table, Fields)} WHERE Id = @id", new { id });
        }

        public async Task<User?> GetByFirebaseUidAsync(string id)
        {
            return await QueryFirstOrDefaultAsync<User>($"{DapperHelper.Select(Table, Fields)} WHERE FirebaseUid = @id", new { id });
        }
    }
}