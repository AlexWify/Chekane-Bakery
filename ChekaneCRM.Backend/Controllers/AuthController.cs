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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _db.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Login == request.Login && u.Password == request.Password);

            if (user == null)
                return Unauthorized(new { message = "Неверный логин или пароль" });

            return Ok(new
            {
                userId = user.Id,
                name = user.Name,
                role = user.Role?.Name,
                roleId = user.RoleId
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (await _db.Users.AnyAsync(u => u.Login == user.Login))
                return BadRequest(new { message = "Логин уже существует" });

            user.RoleId = 4;
            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Регистрация успешна" });
        }
    }

    public class LoginRequest
    {
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}