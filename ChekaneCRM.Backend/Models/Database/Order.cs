using System;
using System.Collections.Generic;

namespace ChekaneCRM.Backend.Models.Database
{
    public class Order
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public int AdminId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public User? Client { get; set; }
        public User? Admin { get; set; }
        public List<OrderProduct>? OrderProducts { get; set; }
    }
}