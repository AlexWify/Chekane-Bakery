using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChekaneCRM.Backend.Data;
using ChekaneCRM.Backend.Models.Database;

namespace ChekaneCRM.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AuthController(AppDbContext db)
        {
            _db = db;
        }

        // Вход по номеру телефона
        [HttpPost("login-by-phone")]
        public async Task<IActionResult> LoginByPhone([FromBody] LoginByPhoneRequest request)
        {
            Console.WriteLine($"Попытка входа: телефон={request.Phone}, пароль={request.Password}");
            
            var user = await _db.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Phone == request.Phone && u.Password == request.Password);

            if (user == null)
            {
                Console.WriteLine("Пользователь не найден");
                return Unauthorized(new { message = "Неверный номер телефона или пароль" });
            }

            Console.WriteLine($"Пользователь найден: {user.Name}, роль: {user.RoleId}");

            return Ok(new
            {
                userId = user.Id,
                name = user.Name,
                surname = user.Surname,
                email = user.Email,
                phone = user.Phone,
                login = user.Login,
                role = user.Role?.Name,
                roleId = user.RoleId
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Проверка на существующий телефон
            if (await _db.Users.AnyAsync(u => u.Phone == request.Phone))
                return BadRequest(new { message = "Пользователь с таким номером телефона уже существует" });

            // Проверка на существующий email
            if (await _db.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest(new { message = "Email уже зарегистрирован" });

            var user = new User
            {
                Name = request.Name,
                Surname = request.Surname,
                Phone = request.Phone,
                Email = request.Email,
                Login = request.Login ?? request.Phone,
                Password = request.Password,
                RoleId = 4  /
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            Console.WriteLine($"Создан пользователь: {user.Name}, телефон: {user.Phone}, роль: {user.RoleId} (клиент)");

            return Ok(new { message = "Регистрация успешна" });
        }
    }

    public class LoginByPhoneRequest
    {
        public string Phone { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
