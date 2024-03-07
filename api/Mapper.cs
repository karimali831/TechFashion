using Omu.ValueInjecter;

namespace api
{
    public static class Mapper
    {

        public static TViewModel ToViewModel<TViewModel, TEntity>(this TEntity entity)
            where TEntity : class
        {
            var dto = (TViewModel?)Activator.CreateInstance(typeof(TViewModel))
                ?? throw new ApplicationException("Unable to entity model to view model");

            dto.InjectFrom(entity);
            return dto;
        }

        public static TEntity ToEntity<TEntity, DTO>(this DTO viewModel)
        where DTO : class
        {
            var model = (TEntity?)Activator.CreateInstance(typeof(TEntity))
                ?? throw new ApplicationException("Unable to map DTO to entity model");

            model.InjectFrom(viewModel);
            return model;
        }
    }
}