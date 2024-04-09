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
        Task<T> QueryFirstAsync<T>(string query, object? parameters = null);
        Task<T?> QuerySingleOrDefaultAsync<T>(string query, object? parameters = null);
        Task<T> QuerySingleAsync<T>(string query, object? parameters = null);
        Task<int?> ExecuteScalarAsync(string query, object? parameters);
        Task<bool> ItemExistsAsync(string table, string where, object parameters);
        Task<bool> ItemExistsAsync<T>(string table, T id);
    }

    public abstract class DapperBaseRepository(DapperContext context) : IDapperBaseRepository
    {
        private readonly DapperContext _context = context;

        public async Task<IEnumerable<T>> QueryAsync<T>(string query, object? parameters = null)
        {
            try
            {
                using var connection = _context.CreateConnection();
                return await connection.QueryAsync<T>(query, parameters);
            }
            catch (Exception exp)
            {
                throw new Exception(exp.Message);
            }
        }

        public async Task<bool> ItemExistsAsync(string table, string where, object parameters)
        {
            try
            {
                using var connection = _context.CreateConnection();

                return await connection.ExecuteScalarAsync<bool>(@$"
                    ;SELECT CAST(CASE WHEN EXISTS (SELECT 1 FROM {table} WHERE {where}) THEN 1 ELSE 0 END as BIT)", parameters
                );
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
                using var connection = _context.CreateConnection();

                return await connection.ExecuteScalarAsync<bool>($";SELECT count(1) FROM {table} WHERE Id = @id",
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
                using var connection = _context.CreateConnection();
                return await connection.QueryFirstOrDefaultAsync<T>(query, parameters);
            }
            catch (Exception exp)
            {
                throw new Exception(exp.Message);
            }
        }

        public async Task<T> QueryFirstAsync<T>(string query, object? parameters = null)
        {
            try
            {
                using var connection = _context.CreateConnection();
                return await connection.QueryFirstAsync<T>(query, parameters);
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
                using var connection = _context.CreateConnection();
                return await connection.QuerySingleOrDefaultAsync<T>(query, parameters);
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
                using var connection = _context.CreateConnection();
                return await connection.ExecuteScalarAsync<int>(query, parameters);
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
                using var connection = _context.CreateConnection();
                await connection.ExecuteAsync(query, parameters);

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
                using var connection = _context.CreateConnection();
                return await connection.ExecuteScalarAsync<T>(query, parameters);
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
                using var connection = _context.CreateConnection();
                return await connection.QuerySingleAsync<T>(query, parameters);
            }
            catch (Exception exp)
            {
                throw new Exception(exp.Message);
            }
        }
    }
}