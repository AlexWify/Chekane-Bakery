using Microsoft.EntityFrameworkCore;
using ChekaneCRM.Backend.Models.Database;

namespace ChekaneCRM.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderProduct> OrderProducts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Order>()
                .Property(o => o.TotalPrice)
                .HasPrecision(18, 2);

            // КАСКАДНОЕ УДАЛЕНИЕ - при удалении пользователя удаляются все его заказы
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Client)
                .WithMany()
                .HasForeignKey(o => o.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Admin)
                .WithMany()
                .HasForeignKey(o => o.AdminId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrderProduct>()
                .HasOne(op => op.Order)
                .WithMany(o => o.OrderProducts)
                .HasForeignKey(op => op.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Роли
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "admin" },
                new Role { Id = 2, Name = "seller" },
                new Role { Id = 3, Name = "baker" },
                new Role { Id = 4, Name = "client" }
            );

            // Админ
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Surname = "Иванов",
                    Name = "Админ",
                    Phone = "79991234567",
                    Email = "admin@chekane.ru",
                    Login = "admin",
                    Password = "Dde303dde",  
                    RoleId = 1
                }
            );

            // Товары 
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Круассан", Description = "Слоеный с маслом", Price = 120, Category = "Булочки", IsAvailable = true },
                new Product { Id = 2, Name = "Багет", Description = "Хрустящий французский", Price = 80, Category = "Хлеб", IsAvailable = true },
                new Product { Id = 3, Name = "Медовик", Description = "Нежный медовый торт", Price = 450, Category = "Торты", IsAvailable = true }
            );
        }
    }
}
