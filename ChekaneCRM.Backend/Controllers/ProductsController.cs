using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChekaneCRM.Backend.Data;
using ChekaneCRM.Backend.Models.Database;

namespace ChekaneCRM.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProductsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var products = await _db.Products.ToListAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound(new { error = "Товар не найден" });
            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Product product)
        {
            try
            {
                product.IsAvailable = true;
                _db.Products.Add(product);
                await _db.SaveChangesAsync();
                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Product updated)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound(new { error = "Товар не найден" });

            // Основные поля
            product.Name = updated.Name;
            product.Description = updated.Description;
            product.Price = updated.Price;
            product.Category = updated.Category;
            
            // БЖУ и состав 
            product.Proteins = updated.Proteins;
            product.Fats = updated.Fats;
            product.Carbohydrates = updated.Carbohydrates;
            product.Calories = updated.Calories;
            product.Ingredients = updated.Ingredients;
            
            await _db.SaveChangesAsync();
            return Ok(product);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound(new { error = "Товар не найден" });

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
            return Ok(new { success = true });
        }

        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult> ToggleAvailability(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound(new { error = "Товар не найден" });

            product.IsAvailable = !product.IsAvailable;
            await _db.SaveChangesAsync();
            return Ok(new { success = true, isAvailable = product.IsAvailable });
        }
    }
}
