using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChekaneCRM.Backend.Data;
using ChekaneCRM.Backend.Models.Database;

namespace ChekaneCRM.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UsersController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _db.Users
                .Include(u => u.Role)
                .Select(u => new UserResponse
                {
                    Id = u.Id,
                    Name = u.Name,
                    Surname = u.Surname,
                    Email = u.Email,
                    Phone = u.Phone,
                    Login = u.Login,
                    RoleId = u.RoleId,
                    RoleName = u.Role != null ? u.Role.Name : "client"
                })
                .ToListAsync();
            return Ok(users);
        }

        [HttpGet("staff")]
        public async Task<IActionResult> GetStaff()
        {
            var staff = await _db.Users
                .Include(u => u.Role)
                .Where(u => u.RoleId != 4)
                .Select(u => new UserResponse
                {
                    Id = u.Id,
                    Name = u.Name,
                    Surname = u.Surname,
                    Email = u.Email,
                    Phone = u.Phone,
                    RoleId = u.RoleId,
                    RoleName = u.Role != null ? u.Role.Name : "staff"
                })
                .ToListAsync();
            return Ok(staff);
        }

        [HttpPatch("{userId}/role")]
        public async Task<IActionResult> ChangeRole(int userId, [FromBody] int roleId)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user == null) return NotFound(new { message = "Пользователь не найден" });
            
            user.RoleId = roleId;
            await _db.SaveChangesAsync();
            
            return Ok(new { success = true, message = "Роль изменена" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateRequest request)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Пользователь не найден" });
            
            user.Name = request.Name;
            user.Surname = request.Surname;
            user.Email = request.Email;
            user.Login = request.Login;
            
            if (!string.IsNullOrEmpty(request.Password))
            {
                user.Password = request.Password;
            }
            
            await _db.SaveChangesAsync();
            return Ok(new { success = true, message = "Пользователь обновлён" });
        }

        [HttpDelete("{id}")]
public async Task<IActionResult> DeleteUser(int id)
{
    try
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) 
            return NotFound(new { message = "Пользователь не найден" });
        
        // Получаем все заказы пользователя
        var orders = await _db.Orders
            .Where(o => o.ClientId == id)
            .ToListAsync();
        
        foreach (var order in orders)
        {
            // Получаем товары для каждого заказа
            var orderProducts = await _db.OrderProducts
                .Where(op => op.OrderId == order.Id)
                .ToListAsync();
            
            _db.OrderProducts.RemoveRange(orderProducts);
        }
        
        _db.Orders.RemoveRange(orders);
        
        // Сохраняем изменения перед удалением пользователя
        await _db.SaveChangesAsync();
        
        // Удаляем пользователя
        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        
        return Ok(new { success = true, message = "Пользователь удалён" });
    }
    catch (Exception ex)
    {
        return BadRequest(new { message = "Ошибка: " + ex.Message });
    }
}

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserCreateRequest request)
        {
            if (await _db.Users.AnyAsync(u => u.Login == request.Login))
            {
                return BadRequest(new { message = "Пользователь с таким логином уже существует" });
            }

            var user = new User
            {
                Name = request.Name,
                Surname = request.Surname,
                Phone = request.Phone,
                Email = request.Email,
                Login = request.Login,
                Password = request.Password,
                RoleId = 4
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return Ok(new { success = true, message = "Пользователь создан" });
        }
    }

    public class UserResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }

    public class UserCreateRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UserUpdateRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string? Password { get; set; }
    }
}
