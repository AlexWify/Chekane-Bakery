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
}