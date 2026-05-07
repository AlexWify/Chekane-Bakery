using Microsoft.EntityFrameworkCore;
using ChekaneCRM.Backend.Data;
using ChekaneCRM.Backend.Models.Database;
using ChekaneCRM.Backend.Models.Dto;

namespace ChekaneCRM.Backend.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _db;

        public ProductService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<ProductDto>> GetAllAsync()
        {
            var products = await _db.Products.ToListAsync();
            return products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Category = p.Category,
                IsAvailable = p.IsAvailable
            }).ToList();
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return null;
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Category = product.Category,
                IsAvailable = product.IsAvailable
            };
        }

        public async Task<ProductDto> CreateAsync(ProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = "",
                Price = dto.Price,
                Category = dto.Category,
                IsAvailable = true
            };
            _db.Products.Add(product);
            await _db.SaveChangesAsync();
            dto.Id = product.Id;
            return dto;
        }

        public async Task<ProductDto?> UpdateAsync(int id, ProductDto dto)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return null;

            product.Name = dto.Name;
            product.Price = dto.Price;
            product.Category = dto.Category;
            await _db.SaveChangesAsync();
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return false;
            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleAvailabilityAsync(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return false;
            product.IsAvailable = !product.IsAvailable;
            await _db.SaveChangesAsync();
            return true;
        }
    }
}