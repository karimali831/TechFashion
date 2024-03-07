using System.Linq.Expressions;

namespace api.Infrastructure
{
    /// <summary>
    /// Describes a low level repository use for basic data access
    /// Useful for entities with compound keys
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    public interface IRepositorySimple<TEntity>
        where TEntity : class
    {

        void Delete(Expression<Func<TEntity, bool>> where);
        TEntity? FindOne(Expression<Func<TEntity, bool>> where);
        TEntity? FindOneWithRelations(Expression<Func<TEntity, bool>> where, params Expression<Func<TEntity, object>>[] relations);
        ICollection<TEntity> Find(Expression<Func<TEntity, bool>> where);
        IEnumerable<TEntity> GetManyWithRelations(Expression<Func<TEntity, bool>> where, params Expression<Func<TEntity, object>>[] relations);
        [Obsolete("Use GetManyWithRelations, which does not expose IQueryable")]
        IQueryable<TEntity> Find(Expression<Func<TEntity, bool>> where, params Expression<Func<TEntity, object>>[] includeProperties);
        ICollection<TEntity> Find(Expression<Func<TEntity, bool>> searchPredicate, int pageNumber, int pageSize);
        ICollection<TEntity> Find(Expression<Func<TEntity, bool>> searchPredicate, string columnToOrderBy, int pageNumber, int pageSize, bool orderByDescending = false);
        ICollection<TEntity> GetAll();
        ICollection<TEntity> GetAll(params Expression<Func<TEntity, object>>[] includeProperties);
        ICollection<TEntity> GetAll(int pageNum, int pageSize);
        bool InsertIfNotExists(TEntity item, Expression<Func<TEntity, bool>> SearchPredicate);
        bool Insert(IEnumerable<TEntity> items);
        bool Insert(TEntity item);
        TEntity InsertAndReturnItem(TEntity item);
        bool Update(IEnumerable<TEntity> items);
        bool Update(TEntity item);
        bool Delete(IEnumerable<TEntity> items);
        bool Delete(TEntity item);
    }
}