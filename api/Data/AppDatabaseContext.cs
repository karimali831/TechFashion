using api.Data.Stripe;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class AppDatabaseContext(DbContextOptions dbContextOptions) : DbContext(dbContextOptions)
    {
        public DbSet<CartProduct> CartProducts { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CustomerAddress> CustomerAddress { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<Return> Returns { get; set; }
        public DbSet<StripeCoupon> StripeCoupons { get; set; }
        public DbSet<StripePayment> StripePayments { get; set; }
        public DbSet<StripePromotion> StripePromotions { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Variant> Variants { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }

        public override int SaveChanges()
        {
            DoCustomEntityPreparations();
            return base.SaveChanges();
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            DoCustomEntityPreparations();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            DoCustomEntityPreparations();
            return await base.SaveChangesAsync(cancellationToken);
        }


        private void DoCustomEntityPreparations()
        {
            var modifiedEntitiesWithTrackDate = ChangeTracker.Entries().Where(c => c.State == EntityState.Modified);
            foreach (var entityEntry in modifiedEntitiesWithTrackDate)
            {
                // Do not confuse "modified" track state and "modified" your property
                if (entityEntry.Properties.Any(c => c.Metadata.Name == "ModifiedDate"))
                {
                    entityEntry.Property("ModifiedDate").CurrentValue = DateTime.UtcNow;
                }
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Product>(entity =>
            {
                entity.HasIndex(e => e.Slug).IsUnique();
            });
        }
    }
}