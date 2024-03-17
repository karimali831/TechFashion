using Microsoft.Data.SqlClient;
using System.Data;
using Dapper;

namespace api.Infrastructure
{
    public interface IDapperBaseRepository
    {
        Task<IEnumerable<T>> QueryAsync<T>(string query, object? parameters = null);
        Task<bool> ExecuteAsync(string query, object? parameters = null);
        Task<T?> ExecuteScalarAsync<T>(string query, object? parameters = null);
        Task<T?> QueryFirstOrDefaultAsync<T>(string query, object? parameters = null);
        Task<T?> QuerySingleOrDefaultAsync<T>(string query, object? parameters = null);
        Task<int?> ExecuteScalarAsync(string query, object? parameters);
    }

    public abstract class DapperBaseRepository : IDapperBaseRepository, IDisposable
    {
        private readonly IDbConnection _dbConnection;

        protected DapperBaseRepository(IConfiguration configuration)
        {
            _dbConnection = new SqlConnection(configuration.GetConnectionString("DefaultConnection"));
        }


        public async Task<IEnumerable<T>> QueryAsync<T>(string query, object? parameters = null)
        {
            try
            {
                return await _dbConnection.QueryAsync<T>(query, parameters);
            }
            catch (Exception exp)
            {
                throw new Exception(exp.Message);
            }
        }

        public async Task<bool> ItemExistsAsync<T>(string table, T id)
        {
            try
            {
                return await _dbConnection.ExecuteScalarAsync<bool>($";SELECT count(1) FROM {table} WHERE Id = @id",
                    new { id });
            }
            catch (Exception exp)
            {
                throw new Exception(exp.Message);
            }
        }

        public async Task<T?> QueryFirstOrDefaultAsync<T>(string query, object? parameters = null)
        {
            try
            {
                return await _dbConnection.QueryFirstOrDefaultAsync<T>(query, parameters);
            }
            catch (Exception exp)
            {
                throw new Exception(exp.Message);
            }
        }

        public async Task<T?> QuerySingleOrDefaultAsync<T>(string query, object? parameters = null)
        {
            try
            {
                return await _dbConnection.QuerySingleOrDefaultAsync<T>(query, parameters);
            }
            catch (Exception exp)
            {
                throw new Exception(exp.Message);
            }
        }

        public async Task<int?> ExecuteScalarAsync(string query, object? parameters)
        {
            try
            {
                return await _dbConnection.ExecuteScalarAsync<int>(query, parameters);
            }
            catch (Exception exp)
            {
                throw new Exception(exp.Message);
            }
        }

        public async Task<bool> ExecuteAsync(string query, object? parameters = null)
        {
            try
            {
                await _dbConnection.ExecuteAsync(query, parameters);
                return true;
            }
            catch (SqlException exp)
            {
                throw new Exception(exp.Message);
            }
        }

        public async Task<T?> ExecuteScalarAsync<T>(string query, object? parameters = null)
        {
            try
            {
                return await _dbConnection.ExecuteScalarAsync<T>(query, parameters);
            }
            catch (Exception exp)
            {
                throw new Exception(exp.Message);
            }
        }

        public async Task<T> QuerySingleAsync<T>(string query, object? parameters = null)
        {
            try
            {
                return await _dbConnection.QuerySingleAsync<T>(query, parameters);
            }
            catch (Exception exp)
            {
                throw new Exception(exp.Message);
            }
        }

        public void Dispose()
        {
            _dbConnection.Dispose();
        }
    }
}