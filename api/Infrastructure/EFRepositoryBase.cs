using System.Linq.Expressions;
using api.Data;
using api.Dto;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure
{
    public abstract class EFRepositoryBase<TEntity>(AppDatabaseContext context) : IRepositorySimple<TEntity> where TEntity : class
    {
        protected AppDatabaseContext _context = context;
        protected readonly DbSet<TEntity> dbSet = context.Set<TEntity>();
        protected readonly IQueryable<TEntity> dbSetNoTracking = context.Set<TEntity>().AsNoTracking();


        public async Task<ApiResponse<TEntity>> GetResponseByEntityIdAsync<T>(int id)
        {
            var entity = await GetByKeyAsync(id);

            if (entity is null)
            {
                return new ApiResponse<TEntity>
                {
                    ErrorMsg = "Item not found"
                };
            }

            return new ApiResponse<TEntity>
            {
                Data = entity
            };
        }

        public virtual bool Insert(TEntity item)
        {
            if (item != null)
            {
                dbSet.Add(item);
                return true;
            }
            return false;
        }

        public async Task<ApiResponse<TViewModel>> InsertAndReturnViewModelAsync<TViewModel>(TEntity item)
        {
            try
            {
                await dbSet.AddAsync(item);
                await _context.SaveChangesAsync();

                return new ApiResponse<TViewModel>
                {
                    Data = item.ToViewModel<TViewModel, TEntity>()
                };

            }
            catch (Exception exp)
            {
                return new ApiResponse<TViewModel>
                {
                    ErrorMsg = "An error occurred" + exp.Message
                };
            }
        }


        public virtual TEntity InsertAndReturnItem(TEntity item)
        {
            dbSet.Add(item);
            return item;
        }

        public virtual bool Update(TEntity item)
        {
            if (item is not null)
            {
                dbSet.Attach(item);
                _context.Entry(item).State = EntityState.Modified;

                return true;
            }

            return false;
        }

        public async Task<ApiResponse<TViewModel>> UpdateAndReturnViewModelAsync<TViewModel>(TEntity item)
        {
            try
            {
                dbSet.Attach(item);
                _context.Entry(item).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return new ApiResponse<TViewModel>
                {
                    Data = item.ToViewModel<TViewModel, TEntity>()
                };
            }
            catch (Exception exp)
            {
                return new ApiResponse<TViewModel>
                {
                    ErrorMsg = "An error occurred: " + exp.Message
                };
            }
        }

        public async Task<ApiResponse<bool>> RemoveAsync(int id)
        {

            var entity = await GetByKeyAsync(id);

            if (entity is not null)
            {

                dbSet.Remove(entity);
                await _context.SaveChangesAsync();

                return new ApiResponse<bool>
                {
                    Data = true
                };
            }
            else
            {
                return new ApiResponse<bool>
                {
                    ErrorMsg = "An error occurred"
                };
            }

        }

        public virtual bool Delete(TEntity entity)
        {
            dbSet.Remove(entity);
            return true;
        }

        public virtual bool Delete(int id)
        {
            TEntity? entity = dbSet.Find(id)
                ?? throw new ApplicationException("Cannot delete entity. Does not exist: " + id);

            dbSet.Remove(entity);
            return true;
        }

        public virtual void Delete(Expression<Func<TEntity, bool>> where)
        {
            IEnumerable<TEntity> objects = dbSet.Where(where).AsEnumerable();

            foreach (TEntity obj in objects)
            {
                dbSet.Remove(obj);
            }
        }

        public virtual ICollection<TEntity> GetAll()
        {
            return [.. dbSet];
        }

        public virtual ICollection<TEntity> GetAll(params Expression<Func<TEntity, object>>[] includeProperties)
        {
            var query = dbSet.AsQueryable();

            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }

            return [.. query];
        }

        public virtual ICollection<TEntity> Find(Expression<Func<TEntity, bool>> where)
        {
            return [.. dbSet.Where(where)];
        }
        public TEntity? FindOne(Expression<Func<TEntity, bool>> where)
        {
            return dbSet.Where(where).FirstOrDefault();
        }

        public TEntity? FindOneWithRelations(Expression<Func<TEntity, bool>> where, params Expression<Func<TEntity, object>>[] relations)
        {
            var query = dbSet.Where(where);

            foreach (var relation in relations)
            {
                query = query.Include(relation);
            }

            return query.FirstOrDefault();
        }

        public TEntity? GetSingle(Expression<Func<TEntity, bool>> where)
        {
            return dbSet.Where(where).SingleOrDefault();
        }
        public IEnumerable<TEntity> GetManyWithRelations(Expression<Func<TEntity, bool>> where, Expression<Func<TEntity, object>> relations)
        {
            return [.. dbSet.Where(where).Include(relations)];
        }
        public IEnumerable<TEntity> GetManyWithRelations(Expression<Func<TEntity, bool>> where, string relations)
        {
            return [.. dbSet.Where(where).Include(relations)];
        }

        public IEnumerable<TEntity> GetManyWithRelations(Expression<Func<TEntity, bool>> where, params Expression<Func<TEntity, object>>[] relations)
        {
            var query = dbSet.Where(where);

            foreach (var relation in relations)
            {
                query = query.Include(relation);
            }

            return [.. query];
        }

        protected virtual IQueryable<TEntity> QueryNoTracking()
        {
            return dbSetNoTracking;
        }

        protected virtual IQueryable<TEntity> Query()
        {
            return dbSet;
        }
        protected virtual DbSet<TEntity> DbSet()
        {
            return dbSet;
        }
        [Obsolete("Use GetManyWithRelations, which does not expose IQueryable")]
        public IQueryable<TEntity> Find(Expression<Func<TEntity, bool>> where, params Expression<Func<TEntity, object>>[] includeProperties)
        {
            IQueryable<TEntity> query = dbSet.Where(where);

            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }

            return query;
        }

        public ICollection<TEntity> Find(Expression<Func<TEntity, bool>> searchPredicate, int pageNumber, int pageSize)
        {
            return [.. dbSet.Where(searchPredicate).Skip(pageNumber * pageSize).Take(pageSize)];
        }

        // public ICollection<TEntity> Find(Expression<Func<TEntity, bool>> searchPredicate, string columnToOrderBy, int pageNumber, int pageSize, bool orderByDescending = false)
        // {
        //     Expression<Func<TEntity, object>> orderByFunc = x => x.GetType().GetProperty(columnToOrderBy).GetValue(x, null);
        //     IQueryable<TEntity> query = dbSet.Where(searchPredicate);

        //     query = orderByDescending ? query.OrderByDescending(orderByFunc) : query.OrderBy(orderByFunc);
        //     return [.. query.Skip(pageNumber * pageSize).Take(pageSize)];
        // }

        public bool InsertIfNotExists(TEntity item, Expression<Func<TEntity, bool>> searchPredicate)
        {
            if (item != null && !dbSet.Any(searchPredicate))
            {
                dbSet.Add(item);
                return true;
            }

            return false;
        }

        public bool Insert(IEnumerable<TEntity> items)
        {
            foreach (var item in items)
            {
                dbSet.Add(item);
            }

            return true;
        }

        public bool Update(IEnumerable<TEntity> items)
        {
            foreach (var item in items)
            {
                InsertOrUpdate(item);
            }
            return true;
        }

        public bool InsertOrUpdate(TEntity item)
        {
            var key = GetKey(item);
            var entity = GetByKey(key);

            if (entity == null)
            {
                return Insert(item);
            }
            else
            {
                return Update(item);
            }
        }

        /// <summary>
        /// get the PK for TEntity i.e. "return entity.ID"
        /// </summary>
        protected virtual int GetKey(TEntity entity)
        {
            //invoke the expression on our entity
            return BuildKeyExpression().Compile().Invoke(entity);
        }

        /// <summary>
        /// Programatically build a linq expression to get the PK i.e. 'item => item.ID'
        /// </summary>
        protected virtual Expression<Func<TEntity, int>> BuildKeyExpression()
        {
            //programatically build a linq expression to get the PK e.g. "item => item.ID"
            var itemParameter = Expression.Parameter(typeof(TEntity), "item");
            return Expression.Lambda<Func<TEntity, int>>
            (
                Expression.Property(itemParameter, "Id"), itemParameter
            );
        }


        public virtual TEntity? GetByKey(int id)
        {
            return ((DbSet<TEntity>)Query()).Find(id);
        }

        public virtual async Task<TEntity?> GetByKeyAsync(int id)
        {
            return await ((DbSet<TEntity>)Query()).FindAsync(id);
        }

        public int Count(Expression<Func<TEntity, bool>>? Predicate = null)
        {
            return Predicate is null ? dbSet.Count() : dbSet.Count(Predicate);
        }

        public bool Delete(IEnumerable<TEntity> items)
        {
            foreach (var item in items)
            {
                dbSet.Remove(item);
            }
            return true;
        }

        public ICollection<TEntity> GetAll(int pageNum, int pageSize)
        {
            return [.. dbSet.Skip(pageSize * pageNum).Take(pageSize)];
        }

        public async Task<IList<TEntity>> GetListAsync(Expression<Func<TEntity, bool>>? where = null)
        {
            if (where is not null)
            {
                return await dbSet.Where(where).ToListAsync();
            }

            return await dbSet.ToListAsync();
        }

        public async Task<ApiResponse<TViewModel>> GetViewModelAsync<TViewModel>(int id)
        {
            var entity = await GetByKeyAsync(id);

            if (entity is null)
            {
                return new ApiResponse<TViewModel>
                {
                    ErrorMsg = "Item not found"
                };
            }

            return new ApiResponse<TViewModel>
            {
                Data = entity.ToViewModel<TViewModel, TEntity>()
            };
        }

        public async Task<IList<TViewModel>> GetViewModelAsync<TViewModel>(Expression<Func<TEntity, bool>>? where = null)
        {
            if (where is not null)
            {
                var list = await dbSet.Where(where).ToListAsync();
                return ToViewModel<TViewModel>(list);
            }

            var results = await dbSet.ToListAsync();
            return ToViewModel<TViewModel>(results);
        }

        private static IList<T> ToViewModel<T>(List<TEntity> entity)
        {
            return entity.ToList().Select(x => x.ToViewModel<T, TEntity>()).ToList();
        }
    }
}