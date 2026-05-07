using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChekaneCRM.Backend.Data;
using ChekaneCRM.Backend.Models.Database;

namespace ChekaneCRM.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public OrdersController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _db.Orders
                .Include(o => o.Client)
                .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
            return Ok(orders);
        }

        [HttpGet("client/{clientId}")]
        public async Task<IActionResult> GetByClient(int clientId)
        {
            var orders = await _db.Orders
                .Include(o => o.Client)
                .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                .Where(o => o.ClientId == clientId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _db.Orders
                .Include(o => o.Client)
                .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                .FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderCreateRequest request)
        {
            if (request == null || request.OrderProducts == null || !request.OrderProducts.Any())
            {
                return BadRequest(new { message = "Заказ не содержит товаров" });
            }

            var order = new Order
            {
                ClientId = request.ClientId,
                AdminId = 1,
                CreatedAt = DateTime.Now,
                Status = "New",
                TotalPrice = request.TotalPrice
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            foreach (var item in request.OrderProducts)
            {
                var orderProduct = new OrderProduct
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity
                };
                _db.OrderProducts.Add(orderProduct);
            }
            await _db.SaveChangesAsync();

            return Ok(new { success = true, orderId = order.Id, order });
        }

        [HttpPatch("{orderId}/status")]
        public async Task<IActionResult> UpdateStatus(int orderId, [FromBody] StatusUpdateRequest request)
        {
            var order = await _db.Orders.FindAsync(orderId);
            if (order == null) return NotFound();
            
            order.Status = request.Status;
            await _db.SaveChangesAsync();
            return Ok(new { success = true, status = order.Status });
        }
    }

    public class OrderCreateRequest
    {
        public int ClientId { get; set; }
        public decimal TotalPrice { get; set; }
        public List<OrderItemRequest> OrderProducts { get; set; } = new();
    }

    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class StatusUpdateRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}